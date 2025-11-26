const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un choix
exports.createChoice = async (req, res) => {
  try {
    const { pageId, text, targetPageId, order } = req.body;

    // Vérifier que la page source existe
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    });
    if (!page) {
      return res.status(404).json({ 
        message: 'Page source non trouvée' 
      });
    }

    // Vérifier que la page cible existe
    const targetPage = await prisma.page.findUnique({
      where: { id: targetPageId }
    });
    if (!targetPage) {
      return res.status(404).json({ 
        message: 'Page cible non trouvée' 
      });
    }

    // Vérifier que les deux pages appartiennent à la même histoire
    if (page.storyId !== targetPage.storyId) {
      return res.status(400).json({ 
        message: 'Les pages doivent appartenir à la même histoire' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à ajouter des choix à cette histoire' 
      });
    }

    // Vérifier que la page source n'est pas une fin
    if (page.isEnd) {
      return res.status(400).json({ 
        message: 'Impossible d\'ajouter des choix à une page finale' 
      });
    }

    const choice = await prisma.choice.create({
      data: {
        pageId,
        text,
        targetPageId,
        order: order || 0
      }
    });

    res.status(201).json({
      message: 'Choix créé avec succès',
      choice
    });
  } catch (error) {
    console.error('Erreur createChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du choix', 
      error: error.message 
    });
  }
};

// Récupérer tous les choix d'une page
exports.getChoicesByPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const choices = await prisma.choice.findMany({
      where: { pageId },
      include: { targetPage: { select: { content: true, isEnd: true } } },
      orderBy: { order: 'asc' }
    });

    res.json({ choices });
  } catch (error) {
    console.error('Erreur getChoicesByPage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des choix', 
      error: error.message 
    });
  }
};

// Mettre à jour un choix
exports.updateChoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, targetPageId, order } = req.body;

    const choice = await prisma.choice.findUnique({
      where: { id }
    });

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const page = await prisma.page.findUnique({
      where: { id: choice.pageId }
    });
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });
    
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier ce choix' 
      });
    }

    // Mettre à jour les champs
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (targetPageId !== undefined) {
      // Vérifier que la nouvelle page cible existe et appartient à la même histoire
      const newTargetPage = await prisma.page.findUnique({
        where: { id: targetPageId }
      });
      if (!newTargetPage) {
        return res.status(404).json({ 
          message: 'Page cible non trouvée' 
        });
      }
      if (newTargetPage.storyId !== page.storyId) {
        return res.status(400).json({ 
          message: 'La page cible doit appartenir à la même histoire' 
        });
      }
      updateData.targetPageId = targetPageId;
    }
    if (order !== undefined) updateData.order = order;

    const updatedChoice = await prisma.choice.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Choix mis à jour avec succès',
      choice: updatedChoice
    });
  } catch (error) {
    console.error('Erreur updateChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du choix', 
      error: error.message 
    });
  }
};

// Supprimer un choix
exports.deleteChoice = async (req, res) => {
  try {
    const { id } = req.params;

    const choice = await prisma.choice.findUnique({
      where: { id }
    });

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const page = await prisma.page.findUnique({
      where: { id: choice.pageId }
    });
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });
    
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer ce choix' 
      });
    }

    await prisma.choice.delete({
      where: { id }
    });

    res.json({
      message: 'Choix supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du choix', 
      error: error.message 
    });
  }
};