const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une zone interactive
exports.createInteractiveZone = async (req, res) => {
  try {
    const { pageId, shapeType, coordinates, targetPageId, tooltip, order } = req.body;

    // Vérifier que la page existe
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!page) {
      return res.status(404).json({ 
        message: 'Page non trouvée' 
      });
    }

    // Vérifier que la page cible existe et appartient à la même histoire
    const targetPage = await prisma.page.findUnique({
      where: { id: targetPageId }
    });

    if (!targetPage) {
      return res.status(404).json({ 
        message: 'Page cible non trouvée' 
      });
    }

    if (targetPage.storyId !== page.storyId) {
      return res.status(400).json({ 
        message: 'La page cible doit appartenir à la même histoire' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const story = await prisma.story.findUnique({
      where: { id: page.storyId }
    });

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    const zone = await prisma.interactiveZone.create({
      data: {
        pageId,
        shapeType,
        coordinates: JSON.stringify(coordinates),
        targetPageId,
        tooltip: tooltip || null,
        order: order || 0
      }
    });

    res.status(201).json({
      message: 'Zone interactive créée',
      zone
    });
  } catch (error) {
    console.error('Erreur createInteractiveZone:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la zone', 
      error: error.message 
    });
  }
};

// Récupérer les zones interactives d'une page
exports.getPageInteractiveZones = async (req, res) => {
  try {
    const { pageId } = req.params;

    const zones = await prisma.interactiveZone.findMany({
      where: { pageId },
      include: {
        targetPage: { select: { content: true } }
      },
      orderBy: { order: 'asc' }
    });

    // Parser les coordonnées JSON
    const parsedZones = zones.map(zone => ({
      ...zone,
      coordinates: JSON.parse(zone.coordinates)
    }));

    res.json({ zones: parsedZones });
  } catch (error) {
    console.error('Erreur getPageInteractiveZones:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des zones', 
      error: error.message 
    });
  }
};

// Mettre à jour une zone interactive
exports.updateInteractiveZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { shapeType, coordinates, targetPageId, tooltip, order } = req.body;

    const zone = await prisma.interactiveZone.findUnique({
      where: { id: zoneId },
      include: { page: true }
    });

    if (!zone) {
      return res.status(404).json({ 
        message: 'Zone non trouvée' 
      });
    }

    // Vérifier l'autorisation
    const story = await prisma.story.findUnique({
      where: { id: zone.page.storyId }
    });

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    const updateData = {};
    if (shapeType) updateData.shapeType = shapeType;
    if (coordinates) updateData.coordinates = JSON.stringify(coordinates);
    if (targetPageId) {
      const targetPage = await prisma.page.findUnique({
        where: { id: targetPageId }
      });
      if (targetPage.storyId !== zone.page.storyId) {
        return res.status(400).json({ 
          message: 'La page cible doit appartenir à la même histoire' 
        });
      }
      updateData.targetPageId = targetPageId;
    }
    if (tooltip !== undefined) updateData.tooltip = tooltip || null;
    if (order !== undefined) updateData.order = order;

    const updated = await prisma.interactiveZone.update({
      where: { id: zoneId },
      data: updateData
    });

    res.json({
      message: 'Zone mise à jour',
      zone: {
        ...updated,
        coordinates: JSON.parse(updated.coordinates)
      }
    });
  } catch (error) {
    console.error('Erreur updateInteractiveZone:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la zone', 
      error: error.message 
    });
  }
};

// Supprimer une zone interactive
exports.deleteInteractiveZone = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const zone = await prisma.interactiveZone.findUnique({
      where: { id: zoneId },
      include: { page: true }
    });

    if (!zone) {
      return res.status(404).json({ 
        message: 'Zone non trouvée' 
      });
    }

    // Vérifier l'autorisation
    const story = await prisma.story.findUnique({
      where: { id: zone.page.storyId }
    });

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    await prisma.interactiveZone.delete({
      where: { id: zoneId }
    });

    res.json({
      message: 'Zone supprimée'
    });
  } catch (error) {
    console.error('Erreur deleteInteractiveZone:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la zone', 
      error: error.message 
    });
  }
};
