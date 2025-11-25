const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/choices/page/:pageId - Choix d'une page
router.get('/page/:pageId', auth, choiceController.getChoicesByPage);

// POST /api/choices - Créer un choix
router.post('/', auth, roleCheck('author', 'admin'), choiceController.createChoice);

// PUT /api/choices/:id - Mettre à jour un choix
router.put('/:id', auth, roleCheck('author', 'admin'), choiceController.updateChoice);

// DELETE /api/choices/:id - Supprimer un choix
router.delete('/:id', auth, roleCheck('author', 'admin'), choiceController.deleteChoice);

module.exports = router;