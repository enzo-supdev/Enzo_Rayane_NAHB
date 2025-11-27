import express from 'express';
import { body } from 'express-validator';
import {
  createChoice,
  updateChoice,
  deleteChoice,
  getPageChoices
} from '../controllers/choice.controller.js';
import { protect, isAuthor } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Validation rules
const createChoiceValidation = [
  body('pageId').isMongoId().withMessage('Valid page ID is required'),
  body('text').trim().isLength({ min: 1, max: 200 }).withMessage('Choice text must be 1-200 characters'),
  body('targetPage').isMongoId().withMessage('Valid target page ID is required'),
  body('requiresDice').optional().isBoolean(),
  body('diceCondition.minValue').optional().isInt({ min: 1, max: 20 }),
  body('diceCondition.maxValue').optional().isInt({ min: 1, max: 20 }),
  body('diceCondition.diceType').optional().isIn(['d4', 'd6', 'd8', 'd10', 'd12', 'd20'])
];

router.post('/', protect, isAuthor, createChoiceValidation, validate, createChoice);
router.put('/:id', protect, updateChoice);
router.delete('/:id', protect, deleteChoice);
router.get('/page/:pageId', getPageChoices);

export default router;
