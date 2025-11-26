const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/statistics/story/:storyId - Statistiques publiques d'une histoire
router.get('/story/:storyId', auth, statisticsController.getStoryStats);

// GET /api/statistics/author/:authorId - Statistiques d'un auteur (ses histoires)
router.get('/author/:authorId', auth, statisticsController.getAuthorStats);

// GET /api/statistics/author/:authorId/:storyId - Statistiques détaillées d'une histoire pour l'auteur
router.get('/author/:authorId/:storyId', auth, roleCheck('author', 'admin'), statisticsController.getDetailedStoryStats);

// GET /api/statistics/admin - Statistiques globales du site (admin only)
router.get('/admin/all', auth, roleCheck('admin'), statisticsController.getGlobalStats);

module.exports = router;
