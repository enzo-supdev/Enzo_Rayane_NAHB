import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createComment,
  getStoryComments,
  updateComment,
  deleteComment,
  toggleLike
} from '../controllers/comment.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create comment for a story
router.post('/stories/:storyId/comments', createComment);

// Get all comments for a story
router.get('/stories/:storyId/comments', getStoryComments);

// Update a comment
router.put('/comments/:commentId', updateComment);

// Delete a comment
router.delete('/comments/:commentId', deleteComment);

// Toggle like on a comment
router.post('/comments/:commentId/like', toggleLike);

export default router;
