const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/author/dashboard - Mon dashboard
router.get('/dashboard', auth, roleCheck('author', 'admin'), authorController.getAuthorDashboard);

// GET /api/author/stories/:storyId/stats - Stats d'une histoire
router.get('/stories/:storyId/stats', auth, roleCheck('author', 'admin'), authorController.getStoryStatistics);

// GET /api/author/profile - Mon profil auteur
router.get('/profile', auth, roleCheck('author', 'admin'), authorController.getAuthorProfile);

// PUT /api/author/profile - Mettre à jour mon profil
router.put('/profile', auth, roleCheck('author', 'admin'), authorController.updateAuthorProfile);

module.exports = router;
