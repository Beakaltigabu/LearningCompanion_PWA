import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/userPreferenceController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Get current user's preferences
router.get('/me/preferences', authenticateToken, getPreferences);

// Update current user's preferences
router.put('/me/preferences', authenticateToken, updatePreferences);

export default router;
