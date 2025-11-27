import express from 'express';
import { body } from 'express-validator';
import {
  getPage,
  createPage,
  updatePage,
  deletePage,
  uploadPageImage,
  addInteractiveZone,
  removeInteractiveZone
} from '../controllers/page.controller.js';
import { protect, isAuthor } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Validation rules
const createPageValidation = [
  body('storyId').isMongoId().withMessage('Valid story ID is required'),
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be 1-5000 characters'),
  body('title').optional().trim().isLength({ max: 100 }),
  body('isEnding').optional().isBoolean(),
  body('endingLabel').optional().trim().isLength({ max: 50 }),
  body('endingType').optional().isIn(['happy', 'sad', 'neutral', 'heroic', 'tragic', 'mysterious'])
];

const zoneValidation = [
  body('x').isNumeric().withMessage('X coordinate is required'),
  body('y').isNumeric().withMessage('Y coordinate is required'),
  body('width').isNumeric().withMessage('Width is required'),
  body('height').isNumeric().withMessage('Height is required'),
  body('targetPage').isMongoId().withMessage('Valid target page ID is required'),
  body('shape').optional().isIn(['rectangle', 'circle', 'polygon'])
];

router.get('/:id', getPage);
router.post('/', protect, isAuthor, createPageValidation, validate, createPage);
router.put('/:id', protect, updatePage);
router.delete('/:id', protect, deletePage);
router.post('/:id/image', protect, upload.single('image'), uploadPageImage);
router.post('/:id/zones', protect, zoneValidation, validate, addInteractiveZone);
router.delete('/:id/zones/:zoneId', protect, removeInteractiveZone);

export default router;
