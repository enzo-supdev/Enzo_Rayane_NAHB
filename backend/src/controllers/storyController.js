const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Récupérer toutes les histoires publiées
 * GET /api/stories
 */
exports.getPublishedStories = async (req, res) => {
  try {
    const { search, theme, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Construction de la clause where
    const where = {
      status: 'PUBLISHED'
    };

    // Recherche par titre ou description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtrer par thème
    if (theme) {
      where.theme = theme;
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            pseudo: true
          }
        },
        _count: {
          select: {
            pages: true,
            gameSessions: true,
            ratings: true
          }
        }
      },
      orderBy: {
        [sortBy]: order
      }
    });

    // Calculer la note moyenne pour chaque histoire
    const storiesWithRatings = await Promise.all(
      stories.map(async (story) => {
        const ratings = await prisma.rating.findMany({
          where: { storyId: story.id },
          select: { score: true }
        });

        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
          : 0;

        // Parser les tags depuis JSON
        let parsedTags = [];
        if (story.tags) {
          try {
            parsedTags = typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags;
          } catch (e) {
            parsedTags = [];
          }
        }

        return {
          ...story,
          tags: parsedTags,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: ratings.length
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        stories: storiesWithRatings,
        count: storiesWithRatings.length
      }
    });

  } catch (error) {
    console.error('Erreur getPublishedStories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des histoires',
      error: error.message
    });
  }
};

/**
 * Récupérer une histoire par ID
 * GET /api/stories/:id
 */
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true
          }
        },
        pages: {
          include: {
            choices: {
              include: {
                targetPage: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            gameSessions: true,
            ratings: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    // Vérifier les permissions (seulement si l'utilisateur est connecté)
    if (story.status === 'DRAFT') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'Cette histoire n\'est pas encore publiée'
        });
      }
      if (story.authorId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'avez pas accès à cette histoire'
        });
      }
    }

    // Calculer la note moyenne
    const ratings = await prisma.rating.findMany({
      where: { storyId: story.id },
      select: { score: true }
    });

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

    // Parser les tags depuis JSON
    let parsedTags = [];
    if (story.tags) {
      try {
        parsedTags = typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        story: {
          ...story,
          tags: parsedTags,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: ratings.length
        }
      }
    });

  } catch (error) {
    console.error('Erreur getStoryById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Récupérer les histoires de l'auteur connecté
 * GET /api/stories/my/stories
 */
exports.getMyStories = async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: {
        authorId: req.user.userId
      },
      include: {
        _count: {
          select: {
            pages: true,
            gameSessions: true,
            ratings: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Ajouter les statistiques
    const storiesWithStats = await Promise.all(
      stories.map(async (story) => {
        const ratings = await prisma.rating.findMany({
          where: { storyId: story.id },
          select: { score: true }
        });

        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
          : 0;

        // Parser les tags depuis JSON
        let parsedTags = [];
        if (story.tags) {
          try {
            parsedTags = typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags;
          } catch (e) {
            parsedTags = [];
          }
        }

        return {
          ...story,
          tags: parsedTags,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: ratings.length
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        stories: storiesWithStats,
        count: storiesWithStats.length
      }
    });

  } catch (error) {
    console.error('Erreur getMyStories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos histoires',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle histoire
 * POST /api/stories
 */
exports.createStory = async (req, res) => {
  try {
    const { title, description, tags, theme } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Titre et description requis'
      });
    }

    const story = await prisma.story.create({
      data: {
        title,
        description,
        tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
        theme: theme || null,
        status: 'DRAFT', // Par défaut en brouillon
        authorId: req.user.userId
      },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Histoire créée avec succès',
      data: { story }
    });

  } catch (error) {
    console.error('Erreur createStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une histoire
 * PUT /api/stories/:id
 */
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, theme, startPageId } = req.body;

    // Vérifier que l'histoire existe et appartient à l'utilisateur
    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    if (story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de modifier cette histoire'
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? JSON.stringify(tags) : tags }),
        ...(theme !== undefined && { theme }),
        ...(startPageId && { startPageId })
      },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Histoire mise à jour',
      data: { story: updatedStory }
    });

  } catch (error) {
    console.error('Erreur updateStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Supprimer une histoire
 * DELETE /api/stories/:id
 */
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'histoire existe et appartient à l'utilisateur
    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    if (story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de supprimer cette histoire'
      });
    }

    // Supprimer l'histoire (cascade delete sur pages/choices grâce à Prisma)
    await prisma.story.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Histoire supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'histoire',
      error: error.message
    });
  }
};

/**
 * Publier une histoire (passer de draft à published)
 * POST /api/stories/:id/publish
 */
exports.publishStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier l'histoire
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        pages: true
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    if (story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de publier cette histoire'
      });
    }

    // Vérifier qu'il y a au moins une page
    if (story.pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez créer au moins une page avant de publier'
      });
    }

    // Vérifier qu'une page de départ est définie
    if (!story.startPageId) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez définir une page de départ avant de publier'
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Histoire publiée avec succès',
      data: { story: updatedStory }
    });

  } catch (error) {
    console.error('Erreur publishStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la publication de l\'histoire',
      error: error.message
    });
  }
};