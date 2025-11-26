const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Upload une image (mock - dans une vraie app, utiliser multer + cloud storage)
exports.uploadImage = async (req, res) => {
  try {
    const { url, alt } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL de l\'image requise' });
    }

    const image = await prisma.image.create({
      data: {
        url,
        alt: alt || '',
        uploadedBy: req.userId
      }
    });

    res.status(201).json({
      message: 'Image enregistrée',
      image
    });
  } catch (error) {
    console.error('Erreur uploadImage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Attacher une image à une page
exports.attachImageToPage = async (req, res) => {
  try {
    const { imageId, pageId } = req.body;

    // Vérifier que l'image et la page existent
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    const page = await prisma.page.findUnique({ 
      where: { id: pageId },
      include: { story: true }
    });

    if (!image || !page) {
      return res.status(404).json({ message: 'Image ou page non trouvée' });
    }

    // Vérifier permissions
    if (page.story.authorId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Mettre à jour l'image avec le pageId
    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { pageId }
    });

    res.json({
      message: 'Image attachée à la page',
      image: updatedImage
    });
  } catch (error) {
    console.error('Erreur attachImageToPage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les images d'une page
exports.getPageImages = async (req, res) => {
  try {
    const { pageId } = req.params;

    const images = await prisma.image.findMany({
      where: { pageId }
    });

    res.json({ images });
  } catch (error) {
    console.error('Erreur getPageImages:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une image par ID
exports.getImageById = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        page: {
          select: { id: true, content: true }
        }
      }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    res.json({ image });
  } catch (error) {
    console.error('Erreur getImageById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une image
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.image.findUnique({ where: { id: imageId } });

    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    // Vérifier permissions
    if (image.uploadedBy !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await prisma.image.delete({ where: { id: imageId } });

    res.json({ message: 'Image supprimée' });
  } catch (error) {
    console.error('Erreur deleteImage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
