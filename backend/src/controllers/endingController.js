const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Enregistrer une fin débloquée
exports.unlockEnding = async (req, res) => {
  try {
    const { storyId, pageId } = req.body;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier que la page existe et est une fin
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    if (!page.isEnd) {
      return res.status(400).json({ 
        message: 'Cette page n\'est pas une fin' 
      });
    }

    if (page.storyId !== storyId) {
      return res.status(400).json({ 
        message: 'La page n\'appartient pas à cette histoire' 
      });
    }

    // Vérifier si la fin est déjà débloquée
    const existingUnlock = await prisma.unlockedEnding.findUnique({
      where: {
        userId_storyId_pageId: {
          userId: req.userId,
          storyId,
          pageId
        }
      }
    });

    if (existingUnlock) {
      return res.status(200).json({
        message: 'Cette fin était déjà débloquée',
        unlockedEnding: existingUnlock
      });
    }

    // Créer le déblocage
    const unlockedEnding = await prisma.unlockedEnding.create({
      data: {
        userId: req.userId,
        storyId,
        pageId
      }
    });

    res.status(201).json({
      message: 'Fin débloquée avec succès!',
      unlockedEnding
    });
  } catch (error) {
    console.error('Erreur unlockEnding:', error);
    res.status(500).json({ 
      message: 'Erreur lors du déblocage de la fin', 
      error: error.message 
    });
  }
};

// Récupérer les fins débloquées pour une histoire
exports.getUnlockedEndings = async (req, res) => {
  try {
    const { storyId } = req.params;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Récupérer les fins débloquées
    const unlockedEndings = await prisma.unlockedEnding.findMany({
      where: {
        userId: req.userId,
        storyId
      },
      include: {
        page: { select: { content: true, order: true } }
      },
      orderBy: { unlockedAt: 'desc' }
    });

    // Récupérer toutes les fins possibles
    const allEndings = await prisma.page.findMany({
      where: {
        storyId,
        isEnd: true
      },
      select: { id: true, content: true, order: true }
    });

    // Identifier les fins non débloquées
    const unlockedPageIds = unlockedEndings.map(e => e.pageId);
    const lockedEndings = allEndings.filter(e => !unlockedPageIds.includes(e.id));

    res.json({
      unlocked: unlockedEndings,
      locked: lockedEndings,
      totalEndings: allEndings.length,
      unlockedCount: unlockedEndings.length
    });
  } catch (error) {
    console.error('Erreur getUnlockedEndings:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des fins débloquées', 
      error: error.message 
    });
  }
};

// Récupérer toutes les fins débloquées par l'utilisateur (toutes histoires)
exports.getAllUnlockedEndings = async (req, res) => {
  try {
    const unlockedEndings = await prisma.unlockedEnding.findMany({
      where: { userId: req.userId },
      include: {
        story: { select: { id: true, title: true } },
        page: { select: { content: true } }
      },
      orderBy: { unlockedAt: 'desc' }
    });

    // Grouper par histoire
    const groupedByStory = {};
    unlockedEndings.forEach(ending => {
      const storyId = ending.story.id;
      if (!groupedByStory[storyId]) {
        groupedByStory[storyId] = {
          story: ending.story,
          endings: []
        };
      }
      groupedByStory[storyId].endings.push(ending);
    });

    res.json({
      total: unlockedEndings.length,
      byStory: Object.values(groupedByStory)
    });
  } catch (error) {
    console.error('Erreur getAllUnlockedEndings:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des fins', 
      error: error.message 
    });
  }
};

// Récupérer les statistiques de fins pour une histoire (vue publique)
exports.getEndingStats = async (req, res) => {
  try {
    const { storyId } = req.params;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Récupérer toutes les fins
    const endings = await prisma.page.findMany({
      where: {
        storyId,
        isEnd: true
      },
      select: { id: true, content: true, order: true }
    });

    // Compter les débloquages par fin
    const endingStats = await Promise.all(
      endings.map(async (ending) => {
        const count = await prisma.unlockedEnding.count({
          where: {
            storyId,
            pageId: ending.id
          }
        });
        return {
          ending,
          unlockedCount: count
        };
      })
    );

    // Calculer le total et les pourcentages
    const totalUnlocks = endingStats.reduce((sum, e) => sum + e.unlockedCount, 0);
    const statsWithPercentage = endingStats.map(e => ({
      ...e,
      percentage: totalUnlocks > 0 ? ((e.unlockedCount / totalUnlocks) * 100).toFixed(2) : 0
    }));

    res.json({
      storyId,
      totalEndings: endings.length,
      totalUnlocks,
      stats: statsWithPercentage
    });
  } catch (error) {
    console.error('Erreur getEndingStats:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};
