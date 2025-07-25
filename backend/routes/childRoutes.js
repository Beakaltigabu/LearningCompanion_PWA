import { Router } from 'express';
import { createChild, getChildren, getChildById, updateChild, deleteChild, getChildrenForSelection, updateChildPin } from '../controllers/childController.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireParent } from '../middleware/roles.middleware.js';

const router = Router();

// Public route for child selection (no auth required) - MUST be before protect middleware
router.get('/selection', getChildrenForSelection);

// Test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Child routes working', timestamp: new Date().toISOString() });
});

// All other routes below require authentication
router.use(protect);

// Only parents can create and list children
router.route('/')
    .post(requireParent, createChild)
    .get(requireParent, getChildren);

// Both parents and children can access child details (with proper authorization in controller)
router.route('/:childId')
    .get(getChildById)
    .put(requireParent, updateChild)
    .delete(requireParent, deleteChild);

// Only parents can update a child's PIN
router.route('/:childId/pin')
    .put(requireParent, updateChildPin);

export default router;
