const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Toutes les routes nécessitent le rôle admin
router.use(auth);
router.use(roleCheck('admin'));

// POST /api/admin/users/:userId/ban - Bannir un utilisateur
router.post('/users/:userId/ban', adminController.banUser);

// POST /api/admin/users/:userId/unban - Débannir un utilisateur
router.post('/users/:userId/unban', adminController.unbanUser);

// POST /api/admin/stories/:storyId/suspend - Suspendre une histoire
router.post('/stories/:storyId/suspend', adminController.suspendStory);

// GET /api/admin/stats - Statistiques globales
router.get('/stats', adminController.getGlobalStats);

module.exports = router;