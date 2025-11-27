import express from 'express';
import { body } from 'express-validator';
import {
  startGame,
  makeChoice,
  getGame,
  getMyGames,
  getStoryEndings,
  rollGameDice
} from '../controllers/game.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Validation rules
const startGameValidation = [
  body('storyId').isMongoId().withMessage('Valid story ID is required'),
  body('isPreview').optional().isBoolean()
];

const makeChoiceValidation = [
  body('choiceId').isMongoId().withMessage('Valid choice ID is required'),
  body('diceRoll').optional().isInt({ min: 1, max: 20 })
];

router.post('/start', protect, startGameValidation, validate, startGame);
router.post('/:id/choose', protect, makeChoiceValidation, validate, makeChoice);
router.get('/:id', protect, getGame);
router.get('/my/all', protect, getMyGames);
router.get('/story/:storyId/endings', protect, getStoryEndings);
router.post('/dice/roll', protect, rollGameDice);

export default router;
