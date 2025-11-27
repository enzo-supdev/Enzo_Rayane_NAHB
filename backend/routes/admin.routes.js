import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  banUser,
  unbanUser,
  promoteToAuthor,
  getAllStories,
  suspendStory,
  unsuspendStory,
  deleteStoryAdmin,
  getDashboardStats
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, restrictTo('admin'));

// Validation
const banValidation = [
  body('reason').optional().trim().isLength({ max: 500 })
];

const suspendValidation = [
  body('reason').optional().trim().isLength({ max: 500 })
];

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banValidation, validate, banUser);
router.put('/users/:id/unban', unbanUser);
router.put('/users/:id/promote', promoteToAuthor);

// Story management
router.get('/stories', getAllStories);
router.put('/stories/:id/suspend', suspendValidation, validate, suspendStory);
router.put('/stories/:id/unsuspend', unsuspendStory);
router.delete('/stories/:id', deleteStoryAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

export default router;
