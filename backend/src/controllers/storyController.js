const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une histoire
exports.createStory = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const story = await prisma.story.create({
      data: {
        title,
        description,
        tags: tags ? JSON.stringify(tags) : null,
        authorId: req.userId,
        status: 'DRAFT'
      }
    });

    res.status(201).json({
      message: 'Histoire créée avec succès',
      story
    });
  } catch (error) {
    console.error('Erreur createStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'histoire', 
      error: error.message 
    });
  }
};

// Récupérer toutes les histoires publiées (pour lecteurs)
exports.getPublishedStories = async (req, res) => {
  try {
    const { search } = req.query;
    
    const where = { status: 'PUBLISHED' };
    
    // Recherche par titre
    if (search) {
      where.title = { contains: search };
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        author: { select: { pseudo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ stories });
  } catch (error) {
    console.error('Erreur getPublishedStories:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des histoires', 
      error: error.message 
    });
  }
};

// Récupérer les histoires de l'auteur connecté
exports.getMyStories = async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: { authorId: req.userId },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ stories });
  } catch (error) {
    console.error('Erreur getMyStories:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de vos histoires', 
      error: error.message 
    });
  }
};

// Récupérer une histoire par ID
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { pseudo: true, email: true } }
      }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier les permissions
    if (story.status === 'DRAFT' && story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    res.json({ story });
  } catch (error) {
    console.error('Erreur getStoryById:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'histoire', 
      error: error.message 
    });
  }
};

// Mettre à jour une histoire
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, status, startPageId } = req.body;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cette histoire' 
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (tags) updateData.tags = JSON.stringify(tags);
    if (status) updateData.status = status.toUpperCase();
    if (startPageId) updateData.startPageId = startPageId;

    const updatedStory = await prisma.story.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Histoire mise à jour avec succès',
      story: updatedStory
    });
  } catch (error) {
    console.error('Erreur updateStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'histoire', 
      error: error.message 
    });
  }
};

// Supprimer une histoire
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cette histoire' 
      });
    }

    // Suppression en cascade via Prisma (configure dans schema.prisma)
    await prisma.story.delete({
      where: { id }
    });

    res.json({
      message: 'Histoire supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'histoire', 
      error: error.message 
    });
  }
};

// Publier une histoire (passer de DRAFT à PUBLISHED)
exports.publishStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à publier cette histoire' 
      });
    }

    // Vérifier qu'il y a une page de départ
    if (!story.startPageId) {
      return res.status(400).json({ 
        message: 'Veuillez définir une page de départ avant de publier' 
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });

    res.json({
      message: 'Histoire publiée avec succès',
      story: updatedStory
    });
  } catch (error) {
    console.error('Erreur publishStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la publication de l\'histoire', 
      error: error.message 
    });
  }
};