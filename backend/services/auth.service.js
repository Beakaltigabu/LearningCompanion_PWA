import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} from '@simplewebauthn/server';
import dbPromise from '../models/index.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// For this example, we'll use a simple in-memory store.
// In a real-world app, you would want to use a database or a cache like Redis.
const challengeStore = {};

// In-memory store for refresh tokens (replace with Redis/db for production)
const refreshTokenStore = {};

class AuthService {
    /**
     * Generates registration options for a new Passkey.
     */
    async generateRegistrationOptions(username) {
        console.log('Generating registration options for:', username);

        const db = await dbPromise;
        const { User } = db;

        const user = await User.findOne({ where: { username } });
        console.log('Found existing user:', user ? 'Yes' : 'No');

        // Use Buffer for userID as required by @simplewebauthn/server
        const userIDBuffer = Buffer.from(username, 'utf8');
        const options = await generateRegistrationOptions({
            rpName: 'Learning Companion',
            rpID: process.env.RP_ID || 'localhost',
            userName: username,
            userID: userIDBuffer,
            userDisplayName: username,
            attestationType: 'none',
            // Prevent users from re-registering existing credentials
            excludeCredentials: user && user.passkey_credentials ? user.passkey_credentials.map(cred => ({
                id: cred.credentialID,
                type: 'public-key',
            })) : [],
            authenticatorSelection: {
                residentKey: 'preferred', // Changed from 'required' to 'preferred'
                userVerification: 'preferred',
            },
        });

        // Store the challenge to verify it later
        challengeStore[username] = options.challenge;
        console.log('Generated options:', options);

        return options;
    }

    /**
     * Verifies the registration response and creates a new user/credential.
     */
    async verifyRegistration(username, attestationResponse) {
        console.log('Verifying registration for:', username);
        console.log('Attestation response:', attestationResponse);

        const db = await dbPromise;
        const { User } = db;

        const expectedChallenge = challengeStore[username];

        if (!expectedChallenge) {
            throw new Error('Challenge not found for user.');
        }

        if (!attestationResponse || typeof attestationResponse !== 'object') {
            throw new Error('attestationResponse is missing or not an object.');
        }
        if (!attestationResponse.id) {
            throw new Error('attestationResponse.id is missing.');
        }

        const verification = await verifyRegistrationResponse({
            response: attestationResponse,
            expectedChallenge: expectedChallenge,
            // Use http://localhost:3000 for local frontend, or support both origins
            expectedOrigin: process.env.EXPECTED_ORIGIN || 'http://localhost:3000',
            expectedRPID: process.env.RP_ID || 'localhost',
            requireUserVerification: false, // Changed to false for testing
        });

        console.log('Verification result:', verification);

        if (!verification.verified) {
            throw new Error('Passkey verification failed.');
        }

        // At this point, registration is verified. Find or create the user and save the credential.
        const { registrationInfo } = verification;
        const { credential } = registrationInfo;
        const { id: credentialID, publicKey: credentialPublicKey, counter } = credential;

        const [user, created] = await User.findOrCreate({
            where: { username },
            defaults: {
                username,
                role: 'parent', // Default role for new registrations
                passkey_credentials: [],
            },
        });

        console.log('User created/found:', created ? 'Created' : 'Found');

        // Add the new credential to the user's list of credentials
        const existingCredentials = user.passkey_credentials || [];
        user.passkey_credentials = [...existingCredentials, {
            credentialID: attestationResponse.id, // Use id from the response (already base64-encoded)
            credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
            counter,
        }];

        await user.save();
        console.log('User saved with credentials');

        // Clean up the challenge
        delete challengeStore[username];

        return { verified: true };
    }

    /**
     * Generates authentication options for an existing Passkey.
     */
    async generateAuthenticationOptions(username) {
        const db = await dbPromise;
        const { User } = db;

        const user = await User.findOne({ where: { username } });
        if (!user || !user.passkey_credentials || user.passkey_credentials.length === 0) {
            throw new Error(`User not found or has no Passkeys: ${username}`);
        }

        const options = await generateAuthenticationOptions({
            allowCredentials: user.passkey_credentials.map(cred => ({
                id: cred.credentialID,
                type: 'public-key',
            })),
            userVerification: 'preferred',
        });

        // Store the challenge to verify it later
        challengeStore[username] = options.challenge;

        return options;
    }

    /**
     * Verifies the authentication response and prepares for token issuance.
     */
    async verifyAuthentication(username, assertionResponse) {
        const db = await dbPromise;
        const { User } = db;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error(`User not found: ${username}`);
        }

        const expectedChallenge = challengeStore[username];
        if (!expectedChallenge) {
            throw new Error('Challenge not found for user.');
        }

        const credential = user.passkey_credentials.find(cred =>
            cred.credentialID === assertionResponse.id
        );

        if (!credential) {
            throw new Error('Could not find credential for user.');
        }

        const verification = await verifyAuthenticationResponse({
            response: assertionResponse,
            expectedChallenge: expectedChallenge,
            expectedOrigin: process.env.EXPECTED_ORIGIN || 'http://localhost:3000',
            expectedRPID: process.env.RP_ID || 'localhost',
            credential: {
                id: credential.credentialID,
                publicKey: Buffer.from(credential.credentialPublicKey, 'base64'),
                counter: credential.counter,
            },
            requireUserVerification: false, // Changed to false for testing
        });

        if (!verification.verified) {
            throw new Error('Passkey authentication failed.');
        }

        // Update the credential counter
        credential.counter = verification.authenticationInfo.newCounter;
        await user.save();

        // Clean up the challenge
        delete challengeStore[username];

        // Issue JWTs
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token with proper user ID
        console.log('Storing refresh token for user ID:', user.id);
        this.storeRefreshToken(user.id, refreshToken);

        return {
            verified: true,
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, role: user.role }
        };
    }

    async loginChild(childId, pin) {
        const db = await dbPromise;
        const { Child } = db;

        const child = await Child.findByPk(childId);

        if (!child) {
            throw new Error('Child profile not found.');
        }

        const isPinValid = await child.checkPin(pin);

        if (!isPinValid) {
            throw new Error('Invalid PIN.');
        }

        // Generate tokens for child (same structure as parent login)
        const accessToken = generateAccessToken({
            id: child.id,
            username: child.name,
            role: 'child'
        });

        const refreshToken = generateRefreshToken({
            id: child.id,
            username: child.name,
            role: 'child'
        });

        // Store refresh token
        this.storeRefreshToken(child.id, refreshToken);

        // On success, return the child's data without the PIN hash
        const childData = child.toJSON();
        delete childData.pin;

        return {
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: child.id,
                username: child.name,
                role: 'child'
            }
        };
    }

    async refreshTokens(refreshToken) {
        console.log('=== REFRESH TOKEN DEBUG ===');
        console.log('Received refresh token:', refreshToken);
        console.log('Current refresh token store:', Object.keys(refreshTokenStore));

        if (!refreshToken) throw new Error('No refresh token provided');

        // Verify refresh token
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log('Decoded payload:', payload);
        } catch (err) {
            console.log('JWT verification error:', err.message);
            throw new Error('Invalid or expired refresh token');
        }

        // Check if token is in store (simulate persistent storage)
        const storedToken = refreshTokenStore[payload.id];
        console.log('Stored token for user:', payload.id, storedToken ? 'exists' : 'not found');
        console.log('Token comparison:', {
            received: refreshToken.substring(0, 50) + '...',
            stored: storedToken ? storedToken.substring(0, 50) + '...' : 'none'
        });

        if (!storedToken || storedToken !== refreshToken) {
            console.log('Token mismatch or not found');
            // Clean up invalid token
            delete refreshTokenStore[payload.id];
            throw new Error('Refresh token not recognized');
        }

        const db = await dbPromise;
        const { User, Child } = db;

        // Find user (check both User and Child models)
        let user = await User.findByPk(payload.id);
        if (!user) {
            // Try finding as child
            const child = await Child.findByPk(payload.id);
            if (child) {
                user = {
                    id: child.id,
                    username: child.name,
                    role: 'child'
                };
            }
        }

        if (!user) {
            console.log('User not found:', payload.id);
            delete refreshTokenStore[payload.id];
            throw new Error('User not found');
        }

        // Issue new tokens
        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update store with new refresh token
        refreshTokenStore[payload.id] = newRefreshToken;
        console.log('Updated refresh token store for user:', payload.id);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: { id: user.id, username: user.username, role: user.role }
        };
    }

    storeRefreshToken(userId, refreshToken) {
        console.log('Storing refresh token for user:', userId);
        refreshTokenStore[userId] = refreshToken;
        console.log('Current store keys:', Object.keys(refreshTokenStore));
        console.log('Stored token preview:', refreshToken.substring(0, 50) + '...');
    }

    // Add cleanup method for expired tokens
    cleanupExpiredTokens() {
        const now = Math.floor(Date.now() / 1000);

        Object.keys(refreshTokenStore).forEach(userId => {
            const token = refreshTokenStore[userId];
            try {
                const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                if (payload.exp < now) {
                    delete refreshTokenStore[userId];
                    console.log('Cleaned up expired refresh token for user:', userId);
                }
            } catch (error) {
                // Token is invalid, remove it
                delete refreshTokenStore[userId];
                console.log('Cleaned up invalid refresh token for user:', userId);
            }
        });
    }

    // Call cleanup periodically (add this to your server startup)
    constructor() {
        // Clean up expired tokens every hour
        setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);
    }
}

export default new AuthService();
