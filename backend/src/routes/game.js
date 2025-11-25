const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// POST /api/game/start - Démarrer une partie
router.post('/start', auth, gameController.startGame);

// POST /api/game/choice - Faire un choix
router.post('/choice', auth, gameController.makeChoice);

// GET /api/game/stats/:storyId - Statistiques d'une histoire
router.get('/stats/:storyId', auth, gameController.getStoryStats);

// GET /api/game/history - Historique de jeu de l'utilisateur
router.get('/history', auth, gameController.getUserGameHistory);

module.exports = router;