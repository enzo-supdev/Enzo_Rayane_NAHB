const Story = require('../models/Story');
const Page = require('../models/Page');
const Choice = require('../models/Choice');

// Créer une histoire
exports.createStory = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const story = new Story({
      title,
      description,
      tags: tags || [],
      authorId: req.user._id,
      status: 'draft'
    });

    await story.save();

    res.status(201).json({
      message: 'Histoire créée avec succès',
      story
    });
  } catch (error) {
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
    
    let query = { status: 'published' };
    
    // Recherche par titre
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const stories = await Story.find(query)
      .populate('authorId', 'pseudo')
      .sort({ createdAt: -1 });

    res.json({ stories });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des histoires', 
      error: error.message 
    });
  }
};

// Récupérer les histoires de l'auteur connecté
exports.getMyStories = async (req, res) => {
  try {
    const stories = await Story.find({ authorId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({ stories });
  } catch (error) {
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

    const story = await Story.findById(id)
      .populate('authorId', 'pseudo email');

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier les permissions
    if (story.status === 'draft' && story.authorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    res.json({ story });
  } catch (error) {
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

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cette histoire' 
      });
    }

    // Mettre à jour les champs
    if (title) story.title = title;
    if (description) story.description = description;
    if (tags) story.tags = tags;
    if (status) story.status = status;
    if (startPageId) story.startPageId = startPageId;

    await story.save();

    res.json({
      message: 'Histoire mise à jour avec succès',
      story
    });
  } catch (error) {
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

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cette histoire' 
      });
    }

    // Supprimer toutes les pages de l'histoire
    const pages = await Page.find({ storyId: id });
    const pageIds = pages.map(p => p._id);

    // Supprimer tous les choix liés aux pages
    await Choice.deleteMany({ pageId: { $in: pageIds } });

    // Supprimer toutes les pages
    await Page.deleteMany({ storyId: id });

    // Supprimer l'histoire
    await Story.findByIdAndDelete(id);

    res.json({
      message: 'Histoire supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'histoire', 
      error: error.message 
    });
  }
};

// Publier une histoire (passer de draft à published)
exports.publishStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est bien l'auteur
    if (story.authorId.toString() !== req.user._id.toString()) {
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

    story.status = 'published';
    await story.save();

    res.json({
      message: 'Histoire publiée avec succès',
      story
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la publication de l\'histoire', 
      error: error.message 
    });
  }
};