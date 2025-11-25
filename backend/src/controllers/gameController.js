const GameSession = require('../models/GameSession');
const Story = require('../models/Story');
const Page = require('../models/Page');
const Choice = require('../models/Choice');

// Démarrer une nouvelle partie
exports.startGame = async (req, res) => {
  try {
    const { storyId } = req.body;

    // Vérifier que l'histoire existe et est publiée
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    if (story.status !== 'published') {
      return res.status(400).json({ 
        message: 'Cette histoire n\'est pas encore publiée' 
      });
    }

    // Vérifier qu'il y a une page de départ
    if (!story.startPageId) {
      return res.status(400).json({ 
        message: 'Cette histoire n\'a pas de page de départ définie' 
      });
    }

    // Récupérer la page de départ avec ses choix
    const startPage = await Page.findById(story.startPageId);
    const choices = await Choice.find({ pageId: story.startPageId }).sort({ order: 1 });

    res.json({
      message: 'Partie démarrée',
      story: {
        id: story._id,
        title: story.title,
        description: story.description
      },
      currentPage: startPage,
      choices
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du démarrage de la partie', 
      error: error.message 
    });
  }
};

// Faire un choix et passer à la page suivante
exports.makeChoice = async (req, res) => {
  try {
    const { choiceId } = req.body;

    // Trouver le choix
    const choice = await Choice.findById(choiceId);

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Récupérer la page cible
    const nextPage = await Page.findById(choice.targetPageId);
    
    if (!nextPage) {
      return res.status(404).json({ 
        message: 'Page suivante non trouvée' 
      });
    }

    // Si c'est une page finale, enregistrer la session
    if (nextPage.isEnd) {
      const gameSession = new GameSession({
        userId: req.user._id,
        storyId: nextPage.storyId,
        endPageId: nextPage._id
      });

      await gameSession.save();

      return res.json({
        message: 'Fin de l\'histoire atteinte',
        currentPage: nextPage,
        choices: [],
        isEnd: true
      });
    }

    // Récupérer les choix de la page suivante
    const choices = await Choice.find({ pageId: nextPage._id }).sort({ order: 1 });

    res.json({
      message: 'Choix effectué',
      currentPage: nextPage,
      choices,
      isEnd: false
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du choix', 
      error: error.message 
    });
  }
};

// Récupérer les statistiques d'une histoire
exports.getStoryStats = async (req, res) => {
  try {
    const { storyId } = req.params;

    // Vérifier que l'histoire existe
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Compter le nombre total de parties jouées
    const totalPlays = await GameSession.countDocuments({ storyId });

    // Compter les parties par fin
    const endStats = await GameSession.aggregate([
      { $match: { storyId: story._id } },
      { $group: { 
        _id: '$endPageId', 
        count: { $sum: 1 } 
      }},
      { $lookup: {
        from: 'pages',
        localField: '_id',
        foreignField: '_id',
        as: 'page'
      }},
      { $unwind: '$page' },
      { $project: {
        pageId: '$_id',
        content: '$page.content',
        count: 1,
        percentage: { 
          $multiply: [
            { $divide: ['$count', totalPlays] }, 
            100
          ] 
        }
      }}
    ]);

    res.json({
      storyId,
      totalPlays,
      endStats
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};

// Récupérer l'historique de jeu d'un utilisateur
exports.getUserGameHistory = async (req, res) => {
  try {
    const history = await GameSession.find({ userId: req.user._id })
      .populate('storyId', 'title')
      .populate('endPageId', 'content')
      .sort({ playedAt: -1 })
      .limit(50);

    res.json({ history });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'historique', 
      error: error.message 
    });
  }
};