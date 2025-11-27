import express from 'express';
import { body } from 'express-validator';
import {
  createReport,
  getReports,
  getStoryReports,
  updateReport,
  getMyReports
} from '../controllers/report.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Validation rules
const reportValidation = [
  body('storyId').isMongoId().withMessage('Valid story ID is required'),
  body('reason').isIn([
    'inappropriate_content',
    'spam',
    'copyright',
    'offensive',
    'misleading',
    'broken',
    'other'
  ]).withMessage('Invalid reason'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters')
];

const updateReportValidation = [
  body('status').isIn(['pending', 'reviewed', 'resolved', 'rejected']).withMessage('Invalid status'),
  body('adminNote').optional().trim().isLength({ max: 500 })
];

router.post('/', protect, reportValidation, validate, createReport);
router.get('/', protect, restrictTo('admin'), getReports);
router.get('/story/:storyId', protect, restrictTo('admin'), getStoryReports);
router.put('/:id', protect, restrictTo('admin'), updateReportValidation, validate, updateReport);
router.get('/my/all', protect, getMyReports);

export default router;
