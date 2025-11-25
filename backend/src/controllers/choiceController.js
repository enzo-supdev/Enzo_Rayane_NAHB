const Choice = require('../models/Choice');
const Page = require('../models/Page');
const Story = require('../models/Story');

// Créer un choix
exports.createChoice = async (req, res) => {
  try {
    const { pageId, text, targetPageId, order } = req.body;

    // Vérifier que la page source existe
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ 
        message: 'Page source non trouvée' 
      });
    }

    // Vérifier que la page cible existe
    const targetPage = await Page.findById(targetPageId);
    if (!targetPage) {
      return res.status(404).json({ 
        message: 'Page cible non trouvée' 
      });
    }

    // Vérifier que les deux pages appartiennent à la même histoire
    if (page.storyId.toString() !== targetPage.storyId.toString()) {
      return res.status(400).json({ 
        message: 'Les pages doivent appartenir à la même histoire' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'histoire
    const story = await Story.findById(page.storyId);
    if (story.authorId.toString() !== req.user._id.toString()) {
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

    const choice = new Choice({
      pageId,
      text,
      targetPageId,
      order: order || 0
    });

    await choice.save();

    res.status(201).json({
      message: 'Choix créé avec succès',
      choice
    });
  } catch (error) {
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

    const choices = await Choice.find({ pageId })
      .populate('targetPageId', 'content isEnd')
      .sort({ order: 1 });

    res.json({ choices });
  } catch (error) {
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

    const choice = await Choice.findById(id);

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const page = await Page.findById(choice.pageId);
    const story = await Story.findById(page.storyId);
    
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier ce choix' 
      });
    }

    // Mettre à jour les champs
    if (text !== undefined) choice.text = text;
    if (targetPageId !== undefined) {
      // Vérifier que la nouvelle page cible existe et appartient à la même histoire
      const newTargetPage = await Page.findById(targetPageId);
      if (!newTargetPage) {
        return res.status(404).json({ 
          message: 'Page cible non trouvée' 
        });
      }
      if (newTargetPage.storyId.toString() !== page.storyId.toString()) {
        return res.status(400).json({ 
          message: 'La page cible doit appartenir à la même histoire' 
        });
      }
      choice.targetPageId = targetPageId;
    }
    if (order !== undefined) choice.order = order;

    await choice.save();

    res.json({
      message: 'Choix mis à jour avec succès',
      choice
    });
  } catch (error) {
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

    const choice = await Choice.findById(id);

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const page = await Page.findById(choice.pageId);
    const story = await Story.findById(page.storyId);
    
    if (story.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer ce choix' 
      });
    }

    await Choice.findByIdAndDelete(id);

    res.json({
      message: 'Choix supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du choix', 
      error: error.message 
    });
  }
};