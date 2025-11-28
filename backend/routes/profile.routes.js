import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getLeaderboard
} from '../controllers/profile.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.use(protect);
router.get('/my', getUserProfile);
router.get('/:userId', getUserProfile);
router.put('/my', updateProfile);

export default router;
