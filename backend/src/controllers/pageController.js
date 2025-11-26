const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Récupérer toutes les pages d'une histoire
 * GET /api/pages/story/:storyId
 */
exports.getPagesByStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Histoire non trouvée'
      });
    }

    // Vérifier les permissions (pour les histoires en brouillon)
    if (story.status === 'DRAFT' && story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette histoire'
      });
    }

    const pages = await prisma.page.findMany({
      where: {
        storyId
      },
      include: {
        choices: {
          include: {
            targetPage: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            orderIndex: 'asc'
          }
        },
        _count: {
          select: {
            choices: true,
            targetedByChoices: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        pages,
        count: pages.length
      }
    });

  } catch (error) {
    console.error('Erreur getPagesByStory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pages',
      error: error.message
    });
  }
};

/**
 * Récupérer une page par ID avec tous ses détails
 * GET /api/pages/:id
 */
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            authorId: true,
            status: true
          }
        },
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
        },
        interactiveZones: true
      }
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page non trouvée'
      });
    }

    // Vérifier les permissions
    if (page.story.status === 'DRAFT' && page.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette page'
      });
    }

    res.status(200).json({
      success: true,
      data: { page }
    });

  } catch (error) {
    console.error('Erreur getPageById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la page',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle page
 * POST /api/pages
 */
exports.createPage = async (req, res) => {
  try {
    const { storyId, title, content, isEnd, endLabel, imageUrl } = req.body;

    // Validation
    if (!storyId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Histoire et contenu requis'
      });
    }

    // Vérifier que l'histoire existe et appartient à l'utilisateur
    const story = await prisma.story.findUnique({
      where: { id: storyId }
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
        message: 'Vous n\'avez pas la permission de créer une page dans cette histoire'
      });
    }

    const page = await prisma.page.create({
      data: {
        storyId,
        title: title || null,
        content,
        isEnd: isEnd || false,
        endLabel: endLabel || null,
        imageUrl: imageUrl || null
      },
      include: {
        story: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Page créée avec succès',
      data: { page }
    });

  } catch (error) {
    console.error('Erreur createPage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la page',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une page
 * PUT /api/pages/:id
 */
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isEnd, endLabel, imageUrl } = req.body;

    // Vérifier que la page existe
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        story: true
      }
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page non trouvée'
      });
    }

    // Vérifier les permissions
    if (page.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de modifier cette page'
      });
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content && { content }),
        ...(isEnd !== undefined && { isEnd }),
        ...(endLabel !== undefined && { endLabel }),
        ...(imageUrl !== undefined && { imageUrl })
      },
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
    });

    res.status(200).json({
      success: true,
      message: 'Page mise à jour',
      data: { page: updatedPage }
    });

  } catch (error) {
    console.error('Erreur updatePage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la page',
      error: error.message
    });
  }
};

/**
 * Supprimer une page
 * DELETE /api/pages/:id
 */
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la page existe
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        story: true
      }
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page non trouvée'
      });
    }

    // Vérifier les permissions
    if (page.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de supprimer cette page'
      });
    }

    // Vérifier si c'est la page de départ
    if (page.story.startPageId === id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer la page de départ. Changez d\'abord la page de départ de l\'histoire.'
      });
    }

    // Supprimer la page (cascade delete sur choices grâce à Prisma)
    await prisma.page.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Page supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deletePage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la page',
      error: error.message
    });
  }
};

/**
 * Créer un choix
 * POST /api/choices
 */
exports.createChoice = async (req, res) => {
  try {
    const { fromPageId, toPageId, text, orderIndex } = req.body;

    // Validation
    if (!fromPageId || !toPageId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Page source, page cible et texte requis'
      });
    }

    // Vérifier que les pages existent et appartiennent à la même histoire
    const [fromPage, toPage] = await Promise.all([
      prisma.page.findUnique({
        where: { id: fromPageId },
        include: { story: true }
      }),
      prisma.page.findUnique({
        where: { id: toPageId }
      })
    ]);

    if (!fromPage || !toPage) {
      return res.status(404).json({
        success: false,
        message: 'Une ou plusieurs pages non trouvées'
      });
    }

    if (fromPage.storyId !== toPage.storyId) {
      return res.status(400).json({
        success: false,
        message: 'Les pages doivent appartenir à la même histoire'
      });
    }

    // Vérifier les permissions
    if (fromPage.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de créer un choix dans cette histoire'
      });
    }

    const choice = await prisma.choice.create({
      data: {
        fromPageId,
        toPageId,
        text,
        orderIndex: orderIndex || 0
      },
      include: {
        fromPage: {
          select: {
            id: true,
            title: true
          }
        },
        targetPage: {
          select: {
            id: true,
            title: true,
            isEnd: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Choix créé avec succès',
      data: { choice }
    });

  } catch (error) {
    console.error('Erreur createChoice:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du choix',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un choix
 * PUT /api/choices/:id
 */
exports.updateChoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, toPageId, orderIndex } = req.body;

    // Vérifier que le choix existe
    const choice = await prisma.choice.findUnique({
      where: { id },
      include: {
        fromPage: {
          include: {
            story: true
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

    // Vérifier les permissions
    if (choice.fromPage.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de modifier ce choix'
      });
    }

    const updatedChoice = await prisma.choice.update({
      where: { id },
      data: {
        ...(text && { text }),
        ...(toPageId && { toPageId }),
        ...(orderIndex !== undefined && { orderIndex })
      },
      include: {
        targetPage: {
          select: {
            id: true,
            title: true,
            isEnd: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Choix mis à jour',
      data: { choice: updatedChoice }
    });

  } catch (error) {
    console.error('Erreur updateChoice:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du choix',
      error: error.message
    });
  }
};

/**
 * Supprimer un choix
 * DELETE /api/choices/:id
 */
exports.deleteChoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le choix existe
    const choice = await prisma.choice.findUnique({
      where: { id },
      include: {
        fromPage: {
          include: {
            story: true
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

    // Vérifier les permissions
    if (choice.fromPage.story.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de supprimer ce choix'
      });
    }

    await prisma.choice.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Choix supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteChoice:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du choix',
      error: error.message
    });
  }
};