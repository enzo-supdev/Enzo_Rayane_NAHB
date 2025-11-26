const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/images/upload - Uploader une image
router.post('/upload', auth, roleCheck('author', 'admin'), imageController.uploadImage);

// GET /api/images/:imageId - Récupérer une image
router.get('/:imageId', auth, imageController.getImageById);

// DELETE /api/images/:imageId - Supprimer une image
router.delete('/:imageId', auth, roleCheck('author', 'admin'), imageController.deleteImage);

// POST /api/images/attach - Attacher une image à une page
router.post('/attach', auth, roleCheck('author', 'admin'), imageController.attachImageToPage);

module.exports = router;
