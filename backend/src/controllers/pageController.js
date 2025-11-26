const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une page
exports.createPage = async (req, res) => {
  try {
    const { storyId, content, isEnd, order } = req.body;

    // Vérifier que l'histoire existe et appartient à l'auteur
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à ajouter des pages à cette histoire' 
      });
    }

    const page = await prisma.page.create({
      data: {
        storyId,
        content,
        isEnd: isEnd || false,
        order: order || 0
      }
    });

    res.status(201).json({
      message: 'Page créée avec succès',
      page
    });
  } catch (error) {
    console.error('Erreur createPage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la page', 
      error: error.message 
    });
  }
};

// Récupérer toutes les pages d'une histoire
exports.getPagesByStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const pages = await prisma.page.findMany({
      where: { storyId },
      orderBy: { order: 'asc' }
    });

    res.json({ pages });
  } catch (error) {
    console.error('Erreur getPagesByStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des pages', 
      error: error.message 
    });
  }
};

// Récupérer une page par ID avec ses choix
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Récupérer les choix de la page
    const choices = await prisma.choice.findMany({
      where: { pageId: id },
      orderBy: { order: 'asc' }
    });

    res.json({ 
      page,
      choices
    });
  } catch (error) {
    console.error('Erreur getPageById:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la page', 
      error: error.message 
    });
  }
};

// Mettre à jour une page
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isEnd, order } = req.body;

    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });
    
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cette page' 
      });
    }

    // Mettre à jour les champs
    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (isEnd !== undefined) updateData.isEnd = isEnd;
    if (order !== undefined) updateData.order = order;

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Page mise à jour avec succès',
      page: updatedPage
    });
  } catch (error) {
    console.error('Erreur updatePage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la page', 
      error: error.message 
    });
  }
};

// Supprimer une page
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });
    
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cette page' 
      });
    }

    // Supprimer tous les choix liés à cette page (en cascade via Prisma)
    await prisma.page.delete({
      where: { id }
    });

    res.json({
      message: 'Page supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deletePage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la page', 
      error: error.message 
    });
  }
};