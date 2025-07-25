import { Router } from 'express';
import {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
    createGradeLevel,
    getAllGradeLevels,
    getGradeLevelById,
    updateGradeLevel,
    deleteGradeLevel
} from '../controllers/learningContentController.js';
import { protect } from '../middleware/auth.middleware.js'; // Assuming a 'protect' middleware for auth
import { restrictTo } from '../middleware/roles.middleware.js'; // Assuming role restriction middleware

const router = Router();

// Subject Routes
router.route('/subjects')
    .get(getAllSubjects) // Publicly accessible
    .post(protect, restrictTo('admin'), createSubject); // Admin only

router.route('/subjects/:id')
    .get(getSubjectById) // Publicly accessible
    .put(protect, restrictTo('admin'), updateSubject) // Admin only
    .delete(protect, restrictTo('admin'), deleteSubject); // Admin only

// GradeLevel Routes
router.route('/grade-levels')
    .get(getAllGradeLevels) // Publicly accessible
    .post(protect, restrictTo('admin'), createGradeLevel); // Admin only

router.route('/grade-levels/:id')
    .get(getGradeLevelById) // Publicly accessible
    .put(protect, restrictTo('admin'), updateGradeLevel) // Admin only
    .delete(protect, restrictTo('admin'), deleteGradeLevel); // Admin only

// Placeholder for LearningPath Routes
// router.route('/learning-paths').get().post();
// router.route('/learning-paths/:id').get().put().delete();

// ... and so on for Lessons and Activities

export default router;
