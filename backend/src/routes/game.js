const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// POST /api/game/start - Démarrer une session de jeu
router.post('/start', auth, gameController.startGame);

// POST /api/game/choice - Faire un choix
router.post('/choice', auth, gameController.makeChoice);

// GET /api/game/sessions - Récupérer mes sessions
router.get('/sessions', auth, gameController.getMySessions);

// GET /api/game/sessions/:id - Récupérer une session par ID
router.get('/sessions/:id', auth, gameController.getSessionById);

// GET /api/game/unlocked-endings/:storyId - Fins déverrouillées pour une histoire
router.get('/unlocked-endings/:storyId', auth, gameController.getUnlockedEndings);

module.exports = router;