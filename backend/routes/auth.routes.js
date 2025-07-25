import { Router } from 'express';
import { body } from 'express-validator';
import {
    startPasskeyRegistration,
    finishPasskeyRegistration,
    startPasskeyAuthentication,
    finishPasskeyAuthentication,
    loginChild,
    refreshToken,
    logout
} from '../controllers/auth.controller.js';

const router = Router();

// Simple test route first
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working' });
});

// Passkey Registration
router.post('/passkey/register/start',
    body('username').isString().notEmpty().withMessage('Username must be a non-empty string'),
    startPasskeyRegistration
);

router.post('/passkey/register/finish',
    body('username').isString().notEmpty(),
    body('attestationResponse').isObject(),
    finishPasskeyRegistration
);

// Passkey Authentication (Login)
router.post('/passkey/authenticate/start',
    body('username').isString().notEmpty(),
    startPasskeyAuthentication
);

router.post('/passkey/authenticate/finish',
    body('username').isString().notEmpty(),
    body('assertionResponse').isObject(),
    finishPasskeyAuthentication
);

// Child PIN Authentication
router.post('/child/login',
    body('childId').isUUID().withMessage('Child ID must be a valid UUID.'),
    body('pin').isString().isLength({ min: 4, max: 4 }).withMessage('PIN must be a 4-digit string.'),
    loginChild
);

// Refresh Token
router.post('/refresh-token',
    body('refreshToken').isString().notEmpty().withMessage('Refresh token is required'),
    refreshToken
);

// Logout
router.post('/logout', logout);

export default router;
