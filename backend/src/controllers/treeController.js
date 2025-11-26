const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Générer l'arbre d'une histoire
exports.getStoryTree = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          include: {
            choices: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    // Construire l'arbre
    const tree = buildTree(story.pages, story.startPageId);

    res.json({ tree });
  } catch (error) {
    console.error('Erreur getStoryTree:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction helper pour construire l'arbre
function buildTree(pages, startPageId) {
  const pageMap = {};
  pages.forEach(page => {
    pageMap[page.id] = {
      id: page.id,
      content: page.content.substring(0, 50) + '...',
      isEnd: page.isEnd,
      choices: page.choices.map(c => ({
        id: c.id,
        text: c.text,
        targetPageId: c.targetPageId
      }))
    };
  });

  return {
    startPageId,
    pages: pageMap
  };
}

// Sauvegarder une visualisation d'arbre
exports.saveTreeVisualization = async (req, res) => {
  try {
    const { storyId, treeData } = req.body;

    const visualization = await prisma.storyTree.create({
      data: {
        storyId,
        treeData: JSON.stringify(treeData)
      }
    });

    res.status(201).json({
      message: 'Visualisation sauvegardée',
      visualization
    });
  } catch (error) {
    console.error('Erreur saveTreeVisualization:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer la visualisation d'un arbre
exports.getTreeVisualization = async (req, res) => {
  try {
    const { storyId } = req.params;

    const visualization = await prisma.storyTree.findFirst({
      where: { storyId }
    });

    if (!visualization) {
      return res.status(404).json({ message: 'Visualisation non trouvée' });
    }

    res.json({
      visualization: {
        ...visualization,
        treeData: JSON.parse(visualization.treeData)
      }
    });
  } catch (error) {
    console.error('Erreur getTreeVisualization:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une visualisation
exports.deleteTreeVisualization = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.storyTree.delete({
      where: { id }
    });

    res.json({ message: 'Visualisation supprimée' });
  } catch (error) {
    console.error('Erreur deleteTreeVisualization:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Construire/générer l'arbre d'une histoire
exports.buildStoryTree = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          include: {
            choices: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (story.authorId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Construire et sauvegarder l'arbre
    const tree = buildTree(story.pages, story.startPageId);

    const savedTree = await prisma.storyTree.create({
      data: {
        storyId,
        treeData: JSON.stringify(tree)
      }
    });

    res.status(201).json({
      message: 'Arbre généré avec succès',
      tree: {
        ...savedTree,
        treeData: tree
      }
    });
  } catch (error) {
    console.error('Erreur buildStoryTree:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer l'arbre du parcours d'une session
exports.getJourneyTree = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const journey = await prisma.playerJourney.findUnique({
      where: { gameSessionId: sessionId },
      include: {
        steps: {
          include: {
            page: {
              include: {
                choices: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        gameSession: {
          include: {
            story: true
          }
        }
      }
    });

    if (!journey) {
      return res.status(404).json({ message: 'Parcours non trouvé' });
    }

    // Construire l'arbre du parcours
    const journeyTree = {
      sessionId,
      storyTitle: journey.gameSession.story.title,
      steps: journey.steps.map(step => ({
        pageId: step.page.id,
        content: step.page.content.substring(0, 100) + '...',
        isEnd: step.page.isEnd,
        visitedAt: step.createdAt
      }))
    };

    res.json({ journeyTree });
  } catch (error) {
    console.error('Erreur getJourneyTree:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un arbre par son ID
exports.getTreeById = async (req, res) => {
  try {
    const { treeId } = req.params;

    const tree = await prisma.storyTree.findUnique({
      where: { id: treeId },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            authorId: true
          }
        }
      }
    });

    if (!tree) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }

    res.json({
      tree: {
        ...tree,
        treeData: JSON.parse(tree.treeData)
      }
    });
  } catch (error) {
    console.error('Erreur getTreeById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
