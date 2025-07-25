// This controller will handle the request and response cycles for auth routes,
// calling the appropriate service methods.

import authService from '../services/auth.service.js';
import { validationResult } from 'express-validator';

class AuthController {
    // Placeholder for a test route
    async test(req, res, next) {
        try {
            res.status(200).json({ success: true, message: 'Auth route is working!' });
        } catch (error) {
            next(error);
        }
    }

    async registerStart(req, res, next) {
        console.log('=== REGISTER START ENDPOINT HIT ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username } = req.body;
            console.log('Starting registration for username:', username);
            const options = await authService.generateRegistrationOptions(username);
            console.log('Sending options back to client');
            res.status(200).json(options);
        } catch (error) {
            console.error('Error in registerStart:', error);
            next(error);
        }
    }

    async registerFinish(req, res, next) {
        console.log('=== REGISTER FINISH ENDPOINT HIT ===');
        console.log('Request body:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, attestationResponse } = req.body;
            const result = await authService.verifyRegistration(username, attestationResponse);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in registerFinish:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async authenticateStart(req, res, next) {
        console.log('=== AUTHENTICATE START ENDPOINT HIT ===');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username } = req.body;
            const options = await authService.generateAuthenticationOptions(username);
            res.status(200).json(options);
        } catch (error) {
            console.error('Error in authenticateStart:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async authenticateFinish(req, res, next) {
        console.log('=== AUTHENTICATE FINISH ENDPOINT HIT ===');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, assertionResponse } = req.body;
            const result = await authService.verifyAuthentication(username, assertionResponse);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in authenticateFinish:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async loginChild(req, res, next) {
        console.log('=== CHILD LOGIN ENDPOINT HIT ===');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { childId, pin } = req.body;
            const result = await authService.loginChild(childId, pin);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in loginChild:', error);
            res.status(401).json({ success: false, message: error.message });
        }
    }

    async refreshToken(req, res, next) {
        console.log('=== REFRESH TOKEN ENDPOINT HIT ===');
        console.log('Request body:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            const tokens = await authService.refreshTokens(refreshToken);
            console.log('Successfully refreshed tokens for user:', tokens.user.id);
            res.status(200).json(tokens);
        } catch (error) {
            console.error('Error in refreshToken:', error);

            // Send appropriate status codes
            if (error.message.includes('expired') || error.message.includes('Invalid')) {
                return res.status(401).json({ success: false, message: error.message });
            }

            if (error.message.includes('not recognized') || error.message.includes('not found')) {
                return res.status(403).json({ success: false, message: error.message });
            }

            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async logout(req, res, next) {
        console.log('=== LOGOUT ENDPOINT HIT ===');

        try {
            // Invalidate refresh token (if using a token store)
            res.status(200).json({ success: true, message: 'Logged out successfully.' });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

// Export individual functions for named imports
const authController = new AuthController();

export const startPasskeyRegistration = authController.registerStart.bind(authController);
export const finishPasskeyRegistration = authController.registerFinish.bind(authController);
export const startPasskeyAuthentication = authController.authenticateStart.bind(authController);
export const finishPasskeyAuthentication = authController.authenticateFinish.bind(authController);
export const loginChild = authController.loginChild.bind(authController);
export const refreshToken = authController.refreshToken.bind(authController);
export const logout = authController.logout.bind(authController);

// Also export the default instance for backward compatibility
export default authController;
