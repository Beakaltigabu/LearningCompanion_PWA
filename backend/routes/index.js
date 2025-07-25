import { Router } from 'express';
import authRoutes from './auth.routes.js';
import childRoutes from './childRoutes.js';
import mascotRoutes from './mascotRoutes.js';
import learningContentRoutes from './learningContentRoutes.js';
import userPreferenceRoutes from './userPreferenceRoutes.js';

const router = Router();

// All routes for the API will be prefixed with /api
router.use('/auth', authRoutes);
router.use('/children', childRoutes);
router.use('/mascots', mascotRoutes);
router.use('/content', learningContentRoutes);
router.use('/users', userPreferenceRoutes);

export default router;
