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
import { protect, isAuthor, optionalAuth } from '../middlewares/auth.middleware.js';
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

// Protected routes (Author) - IMPORTANT: Ces routes spécifiques doivent venir AVANT les routes avec :id
router.get('/my/all', protect, isAuthor, getMyStories);
router.post('/', protect, isAuthor, createLimiter, createStoryValidation, validate, createStory);

// Routes avec paramètre :id (doivent venir APRÈS les routes spécifiques)
router.get('/:id', optionalAuth, getStory);
router.get('/:id/pages', optionalAuth, getStoryPages);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/cover', protect, upload.single('cover'), uploadCover);

export default router;
