const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/reports - Signaler une histoire
router.post('/', auth, reportController.createReport);

// GET /api/reports - Récupérer les signalements (admin only)
router.get('/', auth, roleCheck('admin'), reportController.getAllReports);

// GET /api/reports/:storyId - Récupérer les signalements d'une histoire
router.get('/:storyId', auth, roleCheck('admin'), reportController.getStoryReports);

// PUT /api/reports/:reportId - Mettre à jour le statut d'un signalement
router.put('/:reportId', auth, roleCheck('admin'), reportController.updateReportStatus);

// DELETE /api/reports/:reportId - Supprimer un signalement
router.delete('/:reportId', auth, roleCheck('admin'), reportController.deleteReport);

module.exports = router;
