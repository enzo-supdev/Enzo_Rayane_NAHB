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

    if (story.status !== 'published') {
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

    // Créer la session de jeu
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: req.user.userId,
        storyId,
        currentPageId: story.startPageId,
        isCompleted: false
      },
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
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Session de jeu démarrée',
      data: { gameSession }
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
    const { sessionId, choiceId } = req.body;

    if (!sessionId || !choiceId) {
      return res.status(400).json({
        success: false,
        message: 'ID de session et ID de choix requis'
      });
    }

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        currentPage: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session de jeu non trouvée'
      });
    }

    if (session.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Cette session ne vous appartient pas'
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Cette session est déjà terminée'
      });
    }

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

    if (choice.fromPageId !== session.currentPageId) {
      return res.status(400).json({
        success: false,
        message: 'Ce choix ne correspond pas à votre page actuelle'
      });
    }

    // Enregistrer le chemin pris
    await prisma.pathTaken.create({
      data: {
        sessionId,
        pageId: session.currentPageId,
        choiceId
      }
    });

    // Mettre à jour la session
    const isEndReached = choice.targetPage.isEnd;
    
    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        currentPageId: choice.toPageId,
        isCompleted: isEndReached,
        endPageId: isEndReached ? choice.toPageId : null,
        completedAt: isEndReached ? new Date() : null
      },
      include: {
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
        endPage: true
      }
    });

    // Si fin atteinte, créer l'enregistrement de fin déverrouillée
    if (isEndReached) {
      await prisma.unlockedEnding.create({
        data: {
          userId: req.user.userId,
          storyId: session.storyId,
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
        gameSession: updatedSession,
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