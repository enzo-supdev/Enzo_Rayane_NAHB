const express = require('express');
const router = express.Router();
const endingController = require('../controllers/endingController');
const auth = require('../middleware/auth');

// POST /api/endings/unlock - Enregistrer une fin débloquée
router.post('/unlock', auth, endingController.unlockEnding);

// GET /api/endings/collection/all - Récupérer toutes les fins débloquées (must be before /:storyId)
router.get('/collection/all', auth, endingController.getAllUnlockedEndings);

// GET /api/endings/:storyId/stats - Récupérer les statistiques de fins (public) (must be before /:storyId)
router.get('/:storyId/stats', auth, endingController.getEndingStats);

// GET /api/endings/:storyId - Récupérer les fins débloquées pour une histoire
router.get('/:storyId', auth, endingController.getUnlockedEndings);

module.exports = router;
