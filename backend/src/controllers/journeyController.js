const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une journey (début de lecture)
exports.startJourney = async (req, res) => {
  try {
    const { storyId } = req.body;

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    const journey = await prisma.playerJourney.create({
      data: {
        userId: req.userId,
        storyId,
        status: 'in_progress'
      }
    });

    res.status(201).json({
      message: 'Lecture commencée',
      journey
    });
  } catch (error) {
    console.error('Erreur startJourney:', error);
    res.status(500).json({ 
      message: 'Erreur lors du démarrage de la lecture', 
      error: error.message 
    });
  }
};

// Ajouter une étape à la journey
exports.addJourneyStep = async (req, res) => {
  try {
    const { journeyId, pageId, choiceId } = req.body;

    const journey = await prisma.playerJourney.findUnique({
      where: { id: journeyId }
    });

    if (!journey) {
      return res.status(404).json({ 
        message: 'Journey non trouvée' 
      });
    }

    if (journey.userId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    // Récupérer l'ordre de la dernière étape
    const lastStep = await prisma.journeyStep.findFirst({
      where: { journeyId },
      orderBy: { stepOrder: 'desc' }
    });

    const stepOrder = lastStep ? lastStep.stepOrder + 1 : 0;

    const step = await prisma.journeyStep.create({
      data: {
        journeyId,
        pageId,
        choiceId: choiceId || null,
        stepOrder
      }
    });

    // Vérifier si c'est une fin
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (page.isEnd) {
      await prisma.playerJourney.update({
        where: { id: journeyId },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });
    }

    res.status(201).json({
      message: 'Étape ajoutée',
      step
    });
  } catch (error) {
    console.error('Erreur addJourneyStep:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'ajout de l\'étape', 
      error: error.message 
    });
  }
};

// Récupérer la journey avec tous ses détails
exports.getJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const journey = await prisma.playerJourney.findUnique({
      where: { id: journeyId },
      include: {
        steps: {
          include: {
            page: { select: { content: true, isEnd: true } },
            choice: { select: { text: true } }
          },
          orderBy: { stepOrder: 'asc' }
        },
        story: { select: { title: true } }
      }
    });

    if (!journey) {
      return res.status(404).json({ 
        message: 'Journey non trouvée' 
      });
    }

    if (journey.userId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    res.json({ journey });
  } catch (error) {
    console.error('Erreur getJourney:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la journey', 
      error: error.message 
    });
  }
};

// Récupérer toutes les journeys d'un utilisateur
exports.getUserJourneys = async (req, res) => {
  try {
    const journeys = await prisma.playerJourney.findMany({
      where: { userId: req.userId },
      include: {
        story: { select: { id: true, title: true } },
        steps: { select: { id: true } },
        _count: { select: { steps: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json({ journeys });
  } catch (error) {
    console.error('Erreur getUserJourneys:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des journeys', 
      error: error.message 
    });
  }
};

// Récupérer la journey en cours pour une histoire
exports.getActiveJourney = async (req, res) => {
  try {
    const { storyId } = req.params;

    const journey = await prisma.playerJourney.findFirst({
      where: {
        userId: req.userId,
        storyId,
        status: 'in_progress'
      },
      include: {
        steps: {
          include: {
            page: { select: { id: true, content: true, isEnd: true } }
          },
          orderBy: { stepOrder: 'desc' },
          take: 1
        }
      }
    });

    if (!journey) {
      return res.status(404).json({ 
        message: 'Pas de lecture en cours pour cette histoire' 
      });
    }

    res.json({ journey });
  } catch (error) {
    console.error('Erreur getActiveJourney:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la lecture active', 
      error: error.message 
    });
  }
};

// Abandonner une journey
exports.abandonJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const journey = await prisma.playerJourney.findUnique({
      where: { id: journeyId }
    });

    if (!journey) {
      return res.status(404).json({ 
        message: 'Journey non trouvée' 
      });
    }

    if (journey.userId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    const updated = await prisma.playerJourney.update({
      where: { id: journeyId },
      data: { status: 'abandoned' }
    });

    res.json({
      message: 'Lecture abandonnée',
      journey: updated
    });
  } catch (error) {
    console.error('Erreur abandonJourney:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'abandon de la lecture', 
      error: error.message 
    });
  }
};

// Enregistrer une étape du parcours (alias pour addJourneyStep)
exports.recordJourneyStep = exports.addJourneyStep;

// Récupérer le parcours d'une session de jeu
exports.getSessionJourney = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const journey = await prisma.playerJourney.findFirst({
      where: { gameSessionId: sessionId },
      include: {
        steps: {
          include: {
            page: { select: { content: true, isEnd: true } },
            choice: { select: { text: true } }
          },
          orderBy: { stepOrder: 'asc' }
        },
        story: { select: { title: true } }
      }
    });

    if (!journey) {
      return res.status(404).json({ 
        message: 'Parcours non trouvé pour cette session' 
      });
    }

    res.json({ journey });
  } catch (error) {
    console.error('Erreur getSessionJourney:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du parcours', 
      error: error.message 
    });
  }
};

// Récupérer tous les parcours d'un utilisateur pour une histoire
exports.getUserStoryJourneys = async (req, res) => {
  try {
    const { storyId, userId } = req.params;

    // Vérifier que l'utilisateur demande ses propres parcours ou est admin
    if (userId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    const journeys = await prisma.playerJourney.findMany({
      where: {
        userId,
        storyId
      },
      include: {
        steps: {
          select: { id: true, pageId: true, stepOrder: true }
        },
        _count: { select: { steps: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json({ journeys });
  } catch (error) {
    console.error('Erreur getUserStoryJourneys:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des parcours', 
      error: error.message 
    });
  }
};

// Récupérer un parcours par ID (alias pour getJourney)
exports.getJourneyById = exports.getJourney;
