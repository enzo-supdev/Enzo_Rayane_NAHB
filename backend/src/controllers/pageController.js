const Page = require('../models/Page');
const Story = require('../models/Story');
const Choice = require('../models/Choice');

// Créer une page
exports.createPage = async (req, res) => {
  try {
    const { storyId, content, isEnd, order } = req.body;

    // Vérifier que l'histoire existe et appartient à l'auteur
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à ajouter des pages à cette histoire' 
      });
    }

    const page = new Page({
      storyId,
      content,
      isEnd: isEnd || false,
      order: order || 0
    });

    await page.save();

    res.status(201).json({
      message: 'Page créée avec succès',
      page
    });
  } catch (error) {
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

    const pages = await Page.find({ storyId }).sort({ order: 1 });

    res.json({ pages });
  } catch (error) {
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

    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Récupérer les choix de la page
    const choices = await Choice.find({ pageId: id }).sort({ order: 1 });

    res.json({ 
      page,
      choices
    });
  } catch (error) {
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

    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await Story.findById(page.storyId);
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cette page' 
      });
    }

    // Mettre à jour les champs
    if (content !== undefined) page.content = content;
    if (isEnd !== undefined) page.isEnd = isEnd;
    if (order !== undefined) page.order = order;

    await page.save();

    res.json({
      message: 'Page mise à jour avec succès',
      page
    });
  } catch (error) {
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

    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await Story.findById(page.storyId);
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cette page' 
      });
    }

    // Supprimer tous les choix qui pointent vers cette page
    await Choice.deleteMany({ targetPageId: id });

    // Supprimer tous les choix de cette page
    await Choice.deleteMany({ pageId: id });

    // Supprimer la page
    await Page.findByIdAndDelete(id);

    res.json({
      message: 'Page supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la page', 
      error: error.message 
    });
  }
};