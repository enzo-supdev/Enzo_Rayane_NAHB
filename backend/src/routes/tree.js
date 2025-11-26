const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/tree/story/:storyId - Récupérer l'arbre d'une histoire
router.get('/story/:storyId', auth, treeController.getStoryTree);

// POST /api/tree/:storyId - Générer/construire l'arbre d'une histoire
router.post('/:storyId', auth, roleCheck('author', 'admin'), treeController.buildStoryTree);

// GET /api/tree/journey/:sessionId - Récupérer l'arbre du parcours d'une session
router.get('/journey/:sessionId', auth, treeController.getJourneyTree);

// GET /api/tree/:treeId - Récupérer les détails d'un arbre
router.get('/:treeId', auth, treeController.getTreeById);

module.exports = router;
