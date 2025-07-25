import { Router } from 'express';
import {
  getCustomization,
  upsertCustomization,
} from '../controllers/customizationController.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireChild } from '../middleware/roles.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Get a child's customization (accessible by parent or child)
router.route('/:childId').get(getCustomization);

// Create or update a customization (accessible by child only)
router.route('/').post(requireChild, upsertCustomization);

export default router;
