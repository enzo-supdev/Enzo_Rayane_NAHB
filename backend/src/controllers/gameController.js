const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Démarrer une nouvelle partie
exports.startGame = async (req, res) => {
  try {
    const { storyId } = req.body;

    // Vérifier que l'histoire existe et est publiée
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    if (story.status !== 'PUBLISHED') {
      return res.status(400).json({ 
        message: 'Cette histoire n\'est pas encore publiée' 
      });
    }

    // Vérifier qu'il y a une page de départ
    if (!story.startPageId) {
      return res.status(400).json({ 
        message: 'Cette histoire n\'a pas de page de départ définie' 
      });
    }

    // Récupérer la page de départ avec ses choix
    const startPage = await prisma.page.findUnique({
      where: { id: story.startPageId }
    });

    const choices = await prisma.choice.findMany({
      where: { pageId: story.startPageId },
      orderBy: { order: 'asc' }
    });

    res.json({
      message: 'Partie démarrée',
      story: {
        id: story.id,
        title: story.title,
        description: story.description
      },
      currentPage: startPage,
      choices
    });
  } catch (error) {
    console.error('Erreur startGame:', error);
    res.status(500).json({ 
      message: 'Erreur lors du démarrage de la partie', 
      error: error.message 
    });
  }
};

// Faire un choix et passer à la page suivante
exports.makeChoice = async (req, res) => {
  try {
    const { choiceId } = req.body;

    // Trouver le choix
    const choice = await prisma.choice.findUnique({
      where: { id: choiceId }
    });

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Récupérer la page cible
    const nextPage = await prisma.page.findUnique({
      where: { id: choice.targetPageId }
    });
    
    if (!nextPage) {
      return res.status(404).json({ 
        message: 'Page suivante non trouvée' 
      });
    }

    // Si c'est une page finale, enregistrer la session
    if (nextPage.isEnd) {
      const gameSession = await prisma.gameSession.create({
        data: {
          userId: req.userId,
          storyId: nextPage.storyId,
          endPageId: nextPage.id
        }
      });

      return res.json({
        message: 'Fin de l\'histoire atteinte',
        currentPage: nextPage,
        choices: [],
        isEnd: true
      });
    }

    // Récupérer les choix de la page suivante
    const choices = await prisma.choice.findMany({
      where: { pageId: nextPage.id },
      orderBy: { order: 'asc' }
    });

    res.json({
      message: 'Choix effectué',
      currentPage: nextPage,
      choices,
      isEnd: false
    });
  } catch (error) {
    console.error('Erreur makeChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors du choix', 
      error: error.message 
    });
  }
};

// Récupérer les statistiques d'une histoire
exports.getStoryStats = async (req, res) => {
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

    // Compter le nombre total de parties jouées
    const totalPlays = await prisma.gameSession.count({
      where: { storyId }
    });

    // Compter les parties par fin
    const endSessions = await prisma.gameSession.findMany({
      where: { storyId },
      include: { endPage: true }
    });

    // Grouper par fin
    const endStatsMap = {};
    endSessions.forEach(session => {
      const pageId = session.endPageId;
      if (!endStatsMap[pageId]) {
        endStatsMap[pageId] = {
          pageId,
          content: session.endPage.content,
          count: 0,
          percentage: 0
        };
      }
      endStatsMap[pageId].count++;
    });

    // Calculer les pourcentages
    const endStats = Object.values(endStatsMap).map(stat => ({
      ...stat,
      percentage: totalPlays > 0 ? (stat.count / totalPlays * 100).toFixed(2) : 0
    }));

    res.json({
      storyId,
      totalPlays,
      endStats
    });
  } catch (error) {
    console.error('Erreur getStoryStats:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};

// Récupérer l'historique de jeu d'un utilisateur
exports.getUserGameHistory = async (req, res) => {
  try {
    const history = await prisma.gameSession.findMany({
      where: { userId: req.userId },
      include: {
        story: { select: { title: true } },
        endPage: { select: { content: true } }
      },
      orderBy: { playedAt: 'desc' },
      take: 50
    });

    res.json({ history });
  } catch (error) {
    console.error('Erreur getUserGameHistory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'historique', 
      error: error.message 
    });
  }
};