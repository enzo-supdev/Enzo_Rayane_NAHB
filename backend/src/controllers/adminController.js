const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Bannir un utilisateur
 * POST /api/admin/users/:id/ban
 */
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ne pas se bannir soi-même
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous bannir vous-même'
      });
    }

    // Ne pas bannir un autre admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas bannir un administrateur'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status: 'banned'
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        status: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Utilisateur banni avec succès',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Erreur banUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du bannissement',
      error: error.message
    });
  }
};

/**
 * Débannir un utilisateur
 * POST /api/admin/users/:id/unban
 */
exports.unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status: 'active'
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        status: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Utilisateur débanni avec succès',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Erreur unbanUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du débannissement',
      error: error.message
    });
  }
};

/**
 * Suspendre une histoire
 * POST /api/admin/stories/:id/suspend
 */
exports.suspendStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        status: 'suspended'
      },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Histoire suspendue avec succès',
      data: { story: updatedStory }
    });

  } catch (error) {
    console.error('Erreur suspendStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suspension de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Réactiver une histoire suspendue
 * POST /api/admin/stories/:id/unsuspend
 */
exports.unsuspendStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        status: 'PUBLISHED' // Remettre en PUBLISHED
      },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Histoire réactivée avec succès',
      data: { story: updatedStory }
    });

  } catch (error) {
    console.error('Erreur unsuspendStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réactivation de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Récupérer les statistiques globales de l'application
 * GET /api/admin/stats
 */
exports.getGlobalStats = async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { status: 'active' }
    });
    const bannedUsers = await prisma.user.count({
      where: { status: 'banned' }
    });
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Statistiques des histoires
    const totalStories = await prisma.story.count();
    const publishedStories = await prisma.story.count({
      where: { status: 'PUBLISHED' }
    });
    const draftStories = await prisma.story.count({
      where: { status: 'DRAFT' }
    });
    const suspendedStories = await prisma.story.count({
      where: { status: 'suspended' }
    });

    // Statistiques des sessions de jeu
    const totalGameSessions = await prisma.gameSession.count();
    const completedSessions = await prisma.gameSession.count({
      where: { isCompleted: true }
    });
    const activeSessions = await prisma.gameSession.count({
      where: { isCompleted: false }
    });

    // Histoires les plus jouées
    const topStories = await prisma.story.findMany({
      include: {
        author: {
          select: {
            id: true,
            pseudo: true
          }
        },
        _count: {
          select: {
            gameSessions: true
          }
        }
      },
      orderBy: {
        gameSessions: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Statistiques des notations
    const totalRatings = await prisma.rating.count();
    const averageRatingResult = await prisma.rating.aggregate({
      _avg: {
        rating: true
      }
    });

    // Statistiques des signalements
    const totalReports = await prisma.report.count();
    const pendingReports = await prisma.report.count({
      where: { status: 'pending' }
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          byRole: usersByRole
        },
        stories: {
          total: totalStories,
          published: publishedStories,
          draft: draftStories,
          suspended: suspendedStories,
          topStories: topStories.map(story => ({
            id: story.id,
            title: story.title,
            author: story.author.pseudo,
            plays: story._count.gameSessions
          }))
        },
        gameSessions: {
          total: totalGameSessions,
          completed: completedSessions,
          active: activeSessions,
          completionRate: totalGameSessions > 0 
            ? Math.round((completedSessions / totalGameSessions) * 100)
            : 0
        },
        ratings: {
          total: totalRatings,
          averageRating: averageRatingResult._avg.rating 
            ? Math.round(averageRatingResult._avg.rating * 10) / 10
            : 0
        },
        reports: {
          total: totalReports,
          pending: pendingReports
        }
      }
    });

  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * Récupérer tous les utilisateurs
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { pseudo: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            stories: true,
            gameSessions: true,
            ratings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });

  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

/**
 * Récupérer toutes les histoires (y compris brouillons et suspendues)
 * GET /api/admin/stories
 */
exports.getAllStories = async (req, res) => {
  try {
    const { status, authorId } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
            email: true
          }
        },
        _count: {
          select: {
            pages: true,
            gameSessions: true,
            ratings: true,
            reports: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        stories,
        count: stories.length
      }
    });

  } catch (error) {
    console.error('Erreur getAllStories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des histoires',
      error: error.message
    });
  }
};