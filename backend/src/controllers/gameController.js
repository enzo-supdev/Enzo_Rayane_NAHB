const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Démarrer une nouvelle session de jeu
 * POST /api/game/start
 */
exports.startGame = async (req, res) => {
  try {
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'histoire requis'
      });
    }

    // Vérifier que l'histoire existe et est publiée
    const story = await prisma.story.findUnique({
      where: { id: storyId },
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

    if (story.status !== 'PUBLISHED') {
      return res.status(403).json({
        success: false,
        message: 'Cette histoire n\'est pas encore publiée'
      });
    }

    if (!story.startPageId) {
      return res.status(400).json({
        success: false,
        message: 'Cette histoire n\'a pas de page de départ définie'
      });
    }

    // Créer un PlayerJourney pour tracker la progression
    const journey = await prisma.playerJourney.create({
      data: {
        userId: req.user.userId,
        storyId,
        status: 'in_progress'
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    // Créer le premier step avec la page de départ
    const firstStep = await prisma.journeyStep.create({
      data: {
        journeyId: journey.id,
        pageId: story.startPageId,
        choiceText: null
      }
    });

    // Récupérer la page de départ avec ses choix
    const startPage = await prisma.page.findUnique({
      where: { id: story.startPageId },
      include: {
        choices: {
          include: {
            targetPage: {
              select: {
                id: true,
                title: true,
                isEnd: true
              }
            }
          },
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Session de jeu démarrée',
      data: { 
        journey,
        currentPage: startPage,
        choices: startPage.choices
      }
    });

  } catch (error) {
    console.error('Erreur startGame:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la session',
      error: error.message
    });
  }
};

/**
 * Faire un choix et avancer dans l'histoire
 * POST /api/game/choice
 */
exports.makeChoice = async (req, res) => {
  try {
    const { journeyId, choiceId } = req.body;

    if (!journeyId || !choiceId) {
      return res.status(400).json({
        success: false,
        message: 'ID de journey et ID de choix requis'
      });
    }

    // Vérifier que le journey existe et appartient à l'utilisateur
    const journey = await prisma.playerJourney.findUnique({
      where: { id: journeyId },
      include: {
        steps: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey non trouvé'
      });
    }

    if (journey.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Ce journey ne vous appartient pas'
      });
    }

    if (journey.status === 'completed' || journey.status === 'abandoned') {
      return res.status(400).json({
        success: false,
        message: 'Ce journey est déjà terminé'
      });
    }

    const currentPageId = journey.steps[0]?.pageId;

    // Vérifier que le choix existe et part de la page actuelle
    const choice = await prisma.choice.findUnique({
      where: { id: choiceId },
      include: {
        targetPage: {
          include: {
            choices: {
              include: {
                targetPage: {
                  select: {
                    id: true,
                    title: true,
                    isEnd: true
                  }
                }
              },
              orderBy: {
                orderIndex: 'asc'
              }
            }
          }
        }
      }
    });

    if (!choice) {
      return res.status(404).json({
        success: false,
        message: 'Choix non trouvé'
      });
    }

    if (choice.fromPageId !== currentPageId) {
      return res.status(400).json({
        success: false,
        message: 'Ce choix ne correspond pas à votre page actuelle'
      });
    }

    // Créer un nouveau step pour ce choix
    await prisma.journeyStep.create({
      data: {
        journeyId,
        pageId: choice.toPageId,
        choiceText: choice.text
      }
    });

    // Vérifier si c'est une page de fin
    const isEndReached = choice.targetPage.isEnd;
    
    // Mettre à jour le journey si fin atteinte
    if (isEndReached) {
      await prisma.playerJourney.update({
        where: { id: journeyId },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      // Créer une GameSession pour l'historique
      await prisma.gameSession.create({
        data: {
          userId: req.user.userId,
          storyId: journey.storyId,
          endPageId: choice.toPageId
        }
      });

      // Enregistrer la fin déverrouillée
      await prisma.unlockedEnding.create({
        data: {
          userId: req.user.userId,
          storyId: journey.storyId,
          endPageId: choice.toPageId
        }
      }).catch(() => {
        // Ignore si déjà déverrouillée (unique constraint)
      });
    }

    res.status(200).json({
      success: true,
      message: isEndReached ? 'Fin atteinte !' : 'Choix effectué',
      data: { 
        currentPage: choice.targetPage,
        choices: choice.targetPage.choices,
        isEndReached
      }
    });

  } catch (error) {
    console.error('Erreur makeChoice:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du choix',
      error: error.message
    });
  }
};

/**
 * Récupérer les sessions de jeu de l'utilisateur
 * GET /api/game/sessions
 */
exports.getMySessions = async (req, res) => {
  try {
    const { storyId } = req.query;

    const where = {
      userId: req.user.userId
    };

    if (storyId) {
      where.storyId = storyId;
    }

    const sessions = await prisma.gameSession.findMany({
      where,
      include: {
        story: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        currentPage: {
          select: {
            id: true,
            title: true,
            content: true
          }
        },
        endPage: {
          select: {
            id: true,
            title: true,
            endLabel: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        sessions,
        count: sessions.length
      }
    });

  } catch (error) {
    console.error('Erreur getMySessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions',
      error: error.message
    });
  }
};

/**
 * Récupérer une session de jeu par ID
 * GET /api/game/sessions/:id
 */
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        currentPage: {
          include: {
            choices: {
              include: {
                targetPage: {
                  select: {
                    id: true,
                    title: true,
                    isEnd: true
                  }
                }
              },
              orderBy: {
                orderIndex: 'asc'
              }
            }
          }
        },
        endPage: {
          select: {
            id: true,
            title: true,
            content: true,
            endLabel: true
          }
        },
        pathsTaken: {
          include: {
            page: {
              select: {
                id: true,
                title: true
              }
            },
            choice: {
              select: {
                id: true,
                text: true
              }
            }
          },
          orderBy: {
            takenAt: 'asc'
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée'
      });
    }

    if (session.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette session'
      });
    }

    res.status(200).json({
      success: true,
      data: { session }
    });

  } catch (error) {
    console.error('Erreur getSessionById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la session',
      error: error.message
    });
  }
};

/**
 * Récupérer les fins déverrouillées de l'utilisateur pour une histoire
 * GET /api/game/unlocked-endings/:storyId
 */
exports.getUnlockedEndings = async (req, res) => {
  try {
    const { storyId } = req.params;

    const unlockedEndings = await prisma.unlockedEnding.findMany({
      where: {
        userId: req.user.userId,
        storyId
      },
      include: {
        endPage: {
          select: {
            id: true,
            title: true,
            endLabel: true,
            content: true
          }
        }
      },
      orderBy: {
        unlockedAt: 'desc'
      }
    });

    // Récupérer toutes les fins possibles de l'histoire
    const allEndings = await prisma.page.findMany({
      where: {
        storyId,
        isEnd: true
      },
      select: {
        id: true,
        title: true,
        endLabel: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        unlockedEndings,
        totalEndings: allEndings.length,
        unlockedCount: unlockedEndings.length,
        progress: allEndings.length > 0 
          ? Math.round((unlockedEndings.length / allEndings.length) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Erreur getUnlockedEndings:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fins déverrouillées',
      error: error.message
    });
  }
};