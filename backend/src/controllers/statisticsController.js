const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Statistiques publiques d'une histoire
exports.getStoryStats = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        _count: {
          select: {
            gameSessions: true,
            ratings: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    res.json({
      storyId: story.id,
      title: story.title,
      totalPlays: story._count.gameSessions,
      totalRatings: story._count.ratings
    });
  } catch (error) {
    console.error('Erreur getStoryStats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques d'un auteur
exports.getAuthorStats = async (req, res) => {
  try {
    const { authorId } = req.params;

    const stories = await prisma.story.findMany({
      where: { authorId },
      include: {
        _count: {
          select: {
            gameSessions: true,
            ratings: true
          }
        }
      }
    });

    const totalStories = stories.length;
    const totalPlays = stories.reduce((sum, s) => sum + s._count.gameSessions, 0);
    const totalRatings = stories.reduce((sum, s) => sum + s._count.ratings, 0);

    res.json({
      authorId,
      totalStories,
      totalPlays,
      totalRatings,
      stories: stories.map(s => ({
        id: s.id,
        title: s.title,
        plays: s._count.gameSessions,
        ratings: s._count.ratings
      }))
    });
  } catch (error) {
    console.error('Erreur getAuthorStats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques détaillées d'une histoire pour l'auteur
exports.getDetailedStoryStats = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: true,
        gameSessions: true,
        ratings: true,
        _count: {
          select: {
            gameSessions: true,
            ratings: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    // Vérifier permissions
    if (story.authorId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const avgRating = story.ratings.length > 0
      ? story.ratings.reduce((sum, r) => sum + r.rating, 0) / story.ratings.length
      : 0;

    res.json({
      storyId: story.id,
      title: story.title,
      totalPages: story.pages.length,
      totalPlays: story._count.gameSessions,
      totalRatings: story._count.ratings,
      averageRating: avgRating.toFixed(1)
    });
  } catch (error) {
    console.error('Erreur getDetailedStoryStats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques globales du site (admin)
exports.getGlobalStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStories = await prisma.story.count();
    const totalSessions = await prisma.gameSession.count();
    const totalRatings = await prisma.rating.count();

    res.json({
      totalUsers,
      totalStories,
      totalSessions,
      totalRatings
    });
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
