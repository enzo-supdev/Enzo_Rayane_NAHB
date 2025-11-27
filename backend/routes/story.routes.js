import express from 'express';
import { body } from 'express-validator';
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  getMyStories,
  getStoryPages,
  uploadCover
} from '../controllers/story.controller.js';
import { protect, isAuthor } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Validation rules
const createStoryValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('theme').optional().isIn(['fantasy', 'sci-fi', 'horror', 'mystery', 'romance', 'adventure', 'historical', 'other']),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('estimatedDuration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive number')
];

// Public routes
router.get('/', getStories);
router.get('/:id', getStory);

// Protected routes (Author)
router.post('/', protect, isAuthor, createLimiter, createStoryValidation, validate, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.get('/my/all', protect, isAuthor, getMyStories);
router.get('/:id/pages', getStoryPages);
router.post('/:id/cover', protect, upload.single('cover'), uploadCover);

export default router;
