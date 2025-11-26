const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer ou mettre à jour une note
exports.rateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { score, comment } = req.body;

    // Vérifier que la note est valide (1-5)
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ 
        message: 'La note doit être entre 1 et 5' 
      });
    }

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    // Vérifier si une note existe déjà
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storyId: {
          userId: req.userId,
          storyId
        }
      }
    });

    let rating;
    if (existingRating) {
      // Mettre à jour la note existante
      rating = await prisma.rating.update({
        where: {
          userId_storyId: {
            userId: req.userId,
            storyId
          }
        },
        data: {
          score,
          comment: comment || null
        }
      });
    } else {
      // Créer une nouvelle note
      rating = await prisma.rating.create({
        data: {
          userId: req.userId,
          storyId,
          score,
          comment: comment || null
        }
      });
    }

    res.json({
      message: 'Note enregistrée avec succès',
      rating
    });
  } catch (error) {
    console.error('Erreur rateStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'enregistrement de la note', 
      error: error.message 
    });
  }
};

// Récupérer les notes d'une histoire
exports.getStoryRatings = async (req, res) => {
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

    // Récupérer toutes les notes
    const ratings = await prisma.rating.findMany({
      where: { storyId },
      include: {
        user: { select: { pseudo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer la moyenne
    const avgScore = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      averageScore: parseFloat(avgScore),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Erreur getStoryRatings:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des notes', 
      error: error.message 
    });
  }
};

// Récupérer la note de l'utilisateur pour une histoire
exports.getUserRating = async (req, res) => {
  try {
    const { storyId } = req.params;

    const rating = await prisma.rating.findUnique({
      where: {
        userId_storyId: {
          userId: req.userId,
          storyId
        }
      }
    });

    if (!rating) {
      return res.status(404).json({ 
        message: 'Aucune note trouvée' 
      });
    }

    res.json({ rating });
  } catch (error) {
    console.error('Erreur getUserRating:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la note', 
      error: error.message 
    });
  }
};

// Supprimer une note
exports.deleteRating = async (req, res) => {
  try {
    const { storyId } = req.params;

    const rating = await prisma.rating.findUnique({
      where: {
        userId_storyId: {
          userId: req.userId,
          storyId
        }
      }
    });

    if (!rating) {
      return res.status(404).json({ 
        message: 'Note non trouvée' 
      });
    }

    await prisma.rating.delete({
      where: {
        userId_storyId: {
          userId: req.userId,
          storyId
        }
      }
    });

    res.json({
      message: 'Note supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteRating:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la note', 
      error: error.message 
    });
  }
};
