const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/choices - Créer un choix
router.post('/', auth, roleCheck('author', 'admin'), pageController.createChoice);

// PUT /api/choices/:id - Mettre à jour un choix
router.put('/:id', auth, roleCheck('author', 'admin'), pageController.updateChoice);

// DELETE /api/choices/:id - Supprimer un choix
router.delete('/:id', auth, roleCheck('author', 'admin'), pageController.deleteChoice);

module.exports = router;