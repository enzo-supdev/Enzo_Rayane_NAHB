const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/pages/story/:storyId - Pages d'une histoire
router.get('/story/:storyId', auth, pageController.getPagesByStory);

// GET /api/pages/:id - Détails d'une page avec ses choix
router.get('/:id', auth, pageController.getPageById);

// POST /api/pages - Créer une page
router.post('/', auth, roleCheck('author', 'admin'), pageController.createPage);

// PUT /api/pages/:id - Mettre à jour une page
router.put('/:id', auth, roleCheck('author', 'admin'), pageController.updatePage);

// DELETE /api/pages/:id - Supprimer une page
router.delete('/:id', auth, roleCheck('author', 'admin'), pageController.deletePage);

module.exports = router;