import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Short-lived access token
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username }, // Use 'id' consistently
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Long-lived refresh token
    );
};

export { generateAccessToken, generateRefreshToken };
