const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Routes publiques (accessibles à tous les utilisateurs connectés)
// GET /api/stories - Liste des histoires publiées
router.get('/', auth, storyController.getPublishedStories);

// GET /api/stories/:id - Détails d'une histoire
router.get('/:id', auth, storyController.getStoryById);

// Routes auteur (nécessite le rôle author)
// GET /api/stories/my/stories - Mes histoires
router.get('/my/stories', auth, roleCheck('author', 'admin'), storyController.getMyStories);

// POST /api/stories - Créer une histoire
router.post('/', auth, roleCheck('author', 'admin'), storyController.createStory);

// PUT /api/stories/:id - Mettre à jour une histoire
router.put('/:id', auth, roleCheck('author', 'admin'), storyController.updateStory);

// DELETE /api/stories/:id - Supprimer une histoire
router.delete('/:id', auth, roleCheck('author', 'admin'), storyController.deleteStory);

// POST /api/stories/:id/publish - Publier une histoire
router.post('/:id/publish', auth, roleCheck('author', 'admin'), storyController.publishStory);

module.exports = router;