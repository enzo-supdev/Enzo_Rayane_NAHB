const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journeyController');
const auth = require('../middleware/auth');

// POST /api/journey - Enregistrer une étape du parcours
router.post('/', auth, journeyController.recordJourneyStep);

// GET /api/journey/session/:sessionId - Récupérer le parcours d'une session
router.get('/session/:sessionId', auth, journeyController.getSessionJourney);

// GET /api/journey/story/:storyId/user/:userId - Récupérer tous les parcours d'un utilisateur pour une histoire
router.get('/story/:storyId/user/:userId', auth, journeyController.getUserStoryJourneys);

// GET /api/journey/:journeyId - Récupérer les détails d'un parcours
router.get('/:journeyId', auth, journeyController.getJourneyById);

module.exports = router;
