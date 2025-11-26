const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Signaler une histoire
exports.createReport = async (req, res) => {
  try {
    const { storyId, reason } = req.body;

    if (!storyId || !reason) {
      return res.status(400).json({ message: 'storyId et reason sont requis' });
    }

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    // Créer le signalement
    const report = await prisma.report.create({
      data: {
        storyId,
        reporterId: req.userId,
        reason,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      message: 'Signalement enregistré',
      report
    });
  } catch (error) {
    console.error('Erreur createReport:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les signalements (admin)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        story: { select: { title: true } },
        reporter: { select: { pseudo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reports });
  } catch (error) {
    console.error('Erreur getAllReports:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les signalements d'une histoire (admin)
exports.getStoryReports = async (req, res) => {
  try {
    const { storyId } = req.params;

    const reports = await prisma.report.findMany({
      where: { storyId },
      include: {
        reporter: { select: { pseudo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reports });
  } catch (error) {
    console.error('Erreur getStoryReports:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'un signalement (admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'RESOLVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status }
    });

    res.json({
      message: 'Statut mis à jour',
      report
    });
  } catch (error) {
    console.error('Erreur updateReportStatus:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un signalement (admin)
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    await prisma.report.delete({
      where: { id: reportId }
    });

    res.json({ message: 'Signalement supprimé' });
  } catch (error) {
    console.error('Erreur deleteReport:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
