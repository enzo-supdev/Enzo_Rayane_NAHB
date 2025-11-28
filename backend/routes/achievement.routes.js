import express from 'express';
import {
  seedAchievements,
  getAllAchievements,
  getUserAchievements
} from '../controllers/achievement.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/all', getAllAchievements);

// Protected routes
router.use(protect);
router.get('/my', getUserAchievements);

// Admin routes
router.post('/seed', authorize('admin'), seedAchievements);

export default router;
