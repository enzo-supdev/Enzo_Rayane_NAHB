const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

// GET /api/ratings/:storyId/my-rating - Récupérer sa propre note (must be before /:storyId)
router.get('/:storyId/my-rating', auth, ratingController.getUserRating);

// POST /api/ratings/:storyId - Noter une histoire
router.post('/:storyId', auth, ratingController.rateStory);

// GET /api/ratings/:storyId - Récupérer les notes d'une histoire
router.get('/:storyId', auth, ratingController.getStoryRatings);

// DELETE /api/ratings/:storyId - Supprimer sa note
router.delete('/:storyId', auth, ratingController.deleteRating);

module.exports = router;
