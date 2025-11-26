const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register - Inscription
router.post('/register', authController.register);

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

// GET /api/auth/profile - Profil (protégé)
router.get('/profile', auth, authController.getProfile);

// PUT /api/auth/profile - Mettre à jour le profil
router.put('/profile', auth, authController.updateProfile);

module.exports = router;