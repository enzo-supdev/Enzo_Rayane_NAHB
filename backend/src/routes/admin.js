const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Toutes les routes admin nécessitent le rôle 'admin'

// Gestion des utilisateurs
// POST /api/admin/users/:id/ban - Bannir un utilisateur
router.post('/users/:id/ban', auth, roleCheck('admin'), adminController.banUser);

// POST /api/admin/users/:id/unban - Débannir un utilisateur
router.post('/users/:id/unban', auth, roleCheck('admin'), adminController.unbanUser);

// GET /api/admin/users - Récupérer tous les utilisateurs
router.get('/users', auth, roleCheck('admin'), adminController.getAllUsers);

// Gestion des histoires
// POST /api/admin/stories/:id/suspend - Suspendre une histoire
router.post('/stories/:id/suspend', auth, roleCheck('admin'), adminController.suspendStory);

// POST /api/admin/stories/:id/unsuspend - Réactiver une histoire
router.post('/stories/:id/unsuspend', auth, roleCheck('admin'), adminController.unsuspendStory);

// GET /api/admin/stories - Récupérer toutes les histoires
router.get('/stories', auth, roleCheck('admin'), adminController.getAllStories);

// Statistiques
// GET /api/admin/stats - Statistiques globales
router.get('/stats', auth, roleCheck('admin'), adminController.getGlobalStats);

module.exports = router;