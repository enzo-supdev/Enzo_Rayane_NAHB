const User = require('../models/User');
const Story = require('../models/Story');
const GameSession = require('../models/GameSession');

// Bannir un auteur
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    user.isBanned = true;
    await user.save();

    res.json({
      message: 'Utilisateur banni avec succès',
      user: {
        id: user._id,
        pseudo: user.pseudo,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du bannissement', 
      error: error.message 
    });
  }
};

// Débannir un utilisateur
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    user.isBanned = false;
    await user.save();

    res.json({
      message: 'Utilisateur débanni avec succès',
      user: {
        id: user._id,
        pseudo: user.pseudo,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du débannissement', 
      error: error.message 
    });
  }
};

// Suspendre une histoire
exports.suspendStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    story.status = 'suspended';
    await story.save();

    res.json({
      message: 'Histoire suspendue avec succès',
      story
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suspension', 
      error: error.message 
    });
  }
};

// Statistiques globales
exports.getGlobalStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStories = await Story.countDocuments();
    const publishedStories = await Story.countDocuments({ status: 'published' });
    const totalPlays = await GameSession.countDocuments();

    // Top 10 histoires les plus jouées
    const topStories = await GameSession.aggregate([
      { $group: { 
        _id: '$storyId', 
        playCount: { $sum: 1 } 
      }},
      { $sort: { playCount: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'stories',
        localField: '_id',
        foreignField: '_id',
        as: 'story'
      }},
      { $unwind: '$story' },
      { $project: {
        title: '$story.title',
        playCount: 1
      }}
    ]);

    res.json({
      totalUsers,
      totalStories,
      publishedStories,
      totalPlays,
      topStories
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};