import express from 'express';
import { body } from 'express-validator';
import {
  createOrUpdateRating,
  getStoryRatings,
  getMyRating,
  deleteRating
} from '../controllers/rating.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Validation rules
const ratingValidation = [
  body('storyId').isMongoId().withMessage('Valid story ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
];

router.post('/', protect, ratingValidation, validate, createOrUpdateRating);
router.get('/story/:storyId', getStoryRatings);
router.get('/story/:storyId/mine', protect, getMyRating);
router.delete('/:id', protect, deleteRating);

export default router;
