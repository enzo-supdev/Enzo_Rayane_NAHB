import express from 'express';
import {
  getStoryStatistics,
  getAuthorStatistics,
  getGlobalStatistics,
  getPathStatistics
} from '../controllers/statistics.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/story/:storyId', protect, getStoryStatistics);
router.get('/author/:authorId', protect, getAuthorStatistics);
router.get('/global', protect, restrictTo('admin'), getGlobalStatistics);
router.get('/story/:storyId/paths', protect, getPathStatistics);

export default router;
