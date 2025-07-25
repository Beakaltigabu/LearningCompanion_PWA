import { Router } from 'express';
import {
  getAllMascots,
  getMascotById,
  createMascot,
  updateMascot,
  deleteMascot,
} from '../controllers/mascotController.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // Placeholder for auth

const router = Router();

// Public routes
router.route('/').get(getAllMascots);
router.route('/:id').get(getMascotById);

// Admin-only routes
// To be protected by auth middleware later
router.route('/')
  // .post(protect, admin, uploadSingleImage('image'), createMascot);
  .post(uploadSingleImage('image_url'), createMascot); // Simplified for now

router.route('/:id')
  // .put(protect, admin, uploadSingleImage('image'), updateMascot)
  .put(uploadSingleImage('image_url'), updateMascot) // Simplified for now
  // .delete(protect, admin, deleteMascot);
  .delete(deleteMascot); // Simplified for now

export default router;
