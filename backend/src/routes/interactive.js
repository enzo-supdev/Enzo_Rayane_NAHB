const express = require('express');
const router = express.Router();
const interactiveController = require('../controllers/interactiveController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/interactive - Créer une zone interactive
router.post('/', auth, roleCheck('author', 'admin'), interactiveController.createInteractiveZone);

// GET /api/interactive/page/:pageId - Récupérer les zones interactives d'une page
router.get('/page/:pageId', auth, interactiveController.getInteractiveZonesByPage);

// GET /api/interactive/:zoneId - Récupérer une zone interactive
router.get('/:zoneId', auth, interactiveController.getInteractiveZoneById);

// PUT /api/interactive/:zoneId - Mettre à jour une zone interactive
router.put('/:zoneId', auth, roleCheck('author', 'admin'), interactiveController.updateInteractiveZone);

// DELETE /api/interactive/:zoneId - Supprimer une zone interactive
router.delete('/:zoneId', auth, roleCheck('author', 'admin'), interactiveController.deleteInteractiveZone);

module.exports = router;
