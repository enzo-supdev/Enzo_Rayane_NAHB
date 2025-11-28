import express from 'express';
import {
  getUserLibrary,
  toggleFavorite,
  checkFavorite,
  createReadingList,
  addToReadingList,
  removeFromReadingList,
  deleteReadingList
} from '../controllers/library.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Library routes
router.get('/', getUserLibrary);

// Favorites routes
router.post('/favorites/:storyId', toggleFavorite);
router.get('/favorites/:storyId/check', checkFavorite);

// Reading lists routes
router.post('/lists', createReadingList);
router.post('/lists/:listId/stories/:storyId', addToReadingList);
router.delete('/lists/:listId/stories/:storyId', removeFromReadingList);
router.delete('/lists/:listId', deleteReadingList);

export default router;
