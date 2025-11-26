const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer le dashboard auteur (mes histoires + stats)
exports.getAuthorDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Récupérer toutes les histoires de l'auteur
    const stories = await prisma.story.findMany({
      where: { authorId: userId },
      include: {
        pages: { select: { id: true } },
        gameSessions: { select: { id: true } },
        ratings: { select: { score: true } },
        _count: {
          select: {
            gameSessions: true,
            ratings: true,
            pages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Enrichir avec les statistiques
    const enrichedStories = await Promise.all(
      stories.map(async (story) => {
        const avgRating = await prisma.rating.aggregate({
          where: { storyId: story.id },
          _avg: { score: true }
        });

        const completedSessions = await prisma.gameSession.count({
          where: { storyId: story.id }
        });

        return {
          ...story,
          stats: {
            totalViews: story._count.gameSessions,
            completedSessions,
            totalRatings: story._count.ratings,
            averageRating: avgRating._avg.score ? avgRating._avg.score.toFixed(2) : 0,
            totalPages: story._count.pages
          }
        };
      })
    );

    res.json({
      stories: enrichedStories,
      totalStories: enrichedStories.length,
      totalViews: enrichedStories.reduce((sum, s) => sum + s.stats.totalViews, 0)
    });
  } catch (error) {
    console.error('Erreur getAuthorDashboard:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du dashboard', 
      error: error.message 
    });
  }
};

// Récupérer les statistiques détaillées d'une histoire
exports.getStoryStatistics = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que c'est l'auteur
    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    // Statistiques de sessions
    const totalSessions = await prisma.gameSession.count({
      where: { storyId }
    });

    const sessionsByEndPage = await prisma.gameSession.groupBy({
      by: ['endPageId'],
      where: { storyId },
      _count: { id: true }
    });

    const endPageStats = await Promise.all(
      sessionsByEndPage.map(async (stat) => {
        const page = await prisma.page.findUnique({
          where: { id: stat.endPageId },
          select: { content: true, order: true }
        });
        return {
          pageId: stat.endPageId,
          pageContent: page?.content || 'Unknown',
          count: stat._count.id,
          percentage: totalSessions > 0 ? ((stat._count.id / totalSessions) * 100).toFixed(2) : 0
        };
      })
    );

    // Statistiques de notes
    const avgRating = await prisma.rating.aggregate({
      where: { storyId },
      _avg: { score: true },
      _count: { id: true }
    });

    // Fins débloquées
    const unlockedEndings = await prisma.unlockedEnding.groupBy({
      by: ['pageId'],
      where: { storyId },
      _count: { id: true }
    });

    const unlockedEndingStats = await Promise.all(
      unlockedEndings.map(async (stat) => {
        const page = await prisma.page.findUnique({
          where: { id: stat.pageId },
          select: { content: true }
        });
        const totalUnlocked = unlockedEndings.reduce((sum, s) => sum + s._count.id, 0);
        return {
          pageId: stat.pageId,
          pageContent: page?.content || 'Unknown',
          unlockedCount: stat._count.id,
          percentage: totalUnlocked > 0 ? ((stat._count.id / totalUnlocked) * 100).toFixed(2) : 0
        };
      })
    );

    res.json({
      storyId,
      totalSessions,
      endingStats: endPageStats,
      ratings: {
        average: avgRating._avg.score ? avgRating._avg.score.toFixed(2) : 0,
        total: avgRating._count.id
      },
      unlockedEndings: unlockedEndingStats
    });
  } catch (error) {
    console.error('Erreur getStoryStatistics:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};

// Récupérer le profil auteur
exports.getAuthorProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const profile = await prisma.authorProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { pseudo: true, email: true } }
      }
    });

    if (!profile) {
      // Créer un profil par défaut
      const newProfile = await prisma.authorProfile.create({
        data: {
          userId,
          bio: '',
          profileImage: null
        },
        include: {
          user: { select: { pseudo: true, email: true } }
        }
      });
      return res.status(201).json({ profile: newProfile });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Erreur getAuthorProfile:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil', 
      error: error.message 
    });
  }
};

// Mettre à jour le profil auteur
exports.updateAuthorProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, profileImage } = req.body;

    const profile = await prisma.authorProfile.update({
      where: { userId },
      data: {
        bio: bio || null,
        profileImage: profileImage || null
      },
      include: {
        user: { select: { pseudo: true, email: true } }
      }
    });

    res.json({
      message: 'Profil mis à jour',
      profile
    });
  } catch (error) {
    console.error('Erreur updateAuthorProfile:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil', 
      error: error.message 
    });
  }
};
