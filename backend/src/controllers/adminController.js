const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Bannir un auteur
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true }
    });

    res.json({
      message: 'Utilisateur banni avec succès',
      user: {
        id: updatedUser.id,
        pseudo: updatedUser.pseudo,
        isBanned: updatedUser.isBanned
      }
    });
  } catch (error) {
    console.error('Erreur banUser:', error);
    res.status(500).json({ 
      message: 'Erreur lors du bannissement', 
      error: error.message 
    });
  }
};

// Débannir un utilisateur
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false }
    });

    res.json({
      message: 'Utilisateur débanni avec succès',
      user: {
        id: updatedUser.id,
        pseudo: updatedUser.pseudo,
        isBanned: updatedUser.isBanned
      }
    });
  } catch (error) {
    console.error('Erreur unbanUser:', error);
    res.status(500).json({ 
      message: 'Erreur lors du débannissement', 
      error: error.message 
    });
  }
};

// Suspendre une histoire
exports.suspendStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ 
        message: 'Histoire non trouvée' 
      });
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: { status: 'SUSPENDED' }
    });

    res.json({
      message: 'Histoire suspendue avec succès',
      story: updatedStory
    });
  } catch (error) {
    console.error('Erreur suspendStory:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suspension', 
      error: error.message 
    });
  }
};

// Statistiques globales
exports.getGlobalStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStories = await prisma.story.count();
    const publishedStories = await prisma.story.count({
      where: { status: 'PUBLISHED' }
    });
    const totalPlays = await prisma.gameSession.count();

    // Top 10 histoires les plus jouées
    const topStoriesData = await prisma.gameSession.groupBy({
      by: ['storyId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    const topStories = await Promise.all(
      topStoriesData.map(async (item) => {
        const story = await prisma.story.findUnique({
          where: { id: item.storyId },
          select: { id: true, title: true }
        });
        return {
          storyId: item.storyId,
          title: story?.title || 'Unknown',
          playCount: item._count.id
        };
      })
    );

    res.json({
      totalUsers,
      totalStories,
      publishedStories,
      totalPlays,
      topStories
    });
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};