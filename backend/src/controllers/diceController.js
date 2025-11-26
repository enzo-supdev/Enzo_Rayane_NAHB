const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ajouter un choix avec dé
exports.createDiceChoice = async (req, res) => {
  try {
    const { choiceId, diceType, requiredValue, condition, successPageId, failPageId } = req.body;

    // Vérifier que le choix existe
    const choice = await prisma.choice.findUnique({
      where: { id: choiceId },
      include: { page: true }
    });

    if (!choice) {
      return res.status(404).json({ 
        message: 'Choix non trouvé' 
      });
    }

    // Vérifier que les pages existent et appartiennent à la même histoire
    const successPage = await prisma.page.findUnique({
      where: { id: successPageId }
    });
    const failPage = await prisma.page.findUnique({
      where: { id: failPageId }
    });

    if (!successPage || !failPage) {
      return res.status(404).json({ 
        message: 'Une des pages cible n\'existe pas' 
      });
    }

    if (successPage.storyId !== failPage.storyId || successPage.storyId !== choice.page.storyId) {
      return res.status(400).json({ 
        message: 'Les pages doivent appartenir à la même histoire' 
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    const story = await prisma.story.findUnique({
      where: { id: choice.page.storyId }
    });

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    // Créer le choix avec dé
    const diceChoice = await prisma.diceChoice.create({
      data: {
        choiceId,
        diceType,
        requiredValue,
        condition,
        successPageId,
        failPageId
      }
    });

    res.status(201).json({
      message: 'Choix avec dé créé',
      diceChoice
    });
  } catch (error) {
    console.error('Erreur createDiceChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du choix avec dé', 
      error: error.message 
    });
  }
};

// Lancer un dé
exports.rollDice = async (req, res) => {
  try {
    const { diceChoiceId } = req.body;

    const diceChoice = await prisma.diceChoice.findUnique({
      where: { id: diceChoiceId }
    });

    if (!diceChoice) {
      return res.status(404).json({ 
        message: 'Choix avec dé non trouvé' 
      });
    }

    // Simuler le jet de dé
    let maxValue = 6;
    if (diceChoice.diceType === 'D20') maxValue = 20;
    if (diceChoice.diceType === 'D100') maxValue = 100;

    const result = Math.floor(Math.random() * maxValue) + 1;

    // Évaluer le résultat
    let success = false;
    switch (diceChoice.condition) {
      case 'EQUAL':
        success = result === diceChoice.requiredValue;
        break;
      case 'GREATER_EQUAL':
        success = result >= diceChoice.requiredValue;
        break;
      case 'LESS_EQUAL':
        success = result <= diceChoice.requiredValue;
        break;
      case 'GREATER':
        success = result > diceChoice.requiredValue;
        break;
      case 'LESS':
        success = result < diceChoice.requiredValue;
        break;
    }

    // Enregistrer le jet
    const roll = await prisma.diceRoll.create({
      data: {
        diceChoiceId,
        result,
        success
      }
    });

    // Déterminer la page cible
    const targetPageId = success ? diceChoice.successPageId : diceChoice.failPageId;

    res.json({
      roll,
      success,
      targetPageId,
      message: success ? 'Succès!' : 'Échec!'
    });
  } catch (error) {
    console.error('Erreur rollDice:', error);
    res.status(500).json({ 
      message: 'Erreur lors du lancement du dé', 
      error: error.message 
    });
  }
};

// Récupérer les informations d'un choix avec dé
exports.getDiceChoice = async (req, res) => {
  try {
    const { diceChoiceId } = req.params;

    const diceChoice = await prisma.diceChoice.findUnique({
      where: { id: diceChoiceId },
      include: {
        choice: true,
        successPage: { select: { content: true } },
        failPage: { select: { content: true } }
      }
    });

    if (!diceChoice) {
      return res.status(404).json({ 
        message: 'Choix avec dé non trouvé' 
      });
    }

    res.json({ diceChoice });
  } catch (error) {
    console.error('Erreur getDiceChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du choix', 
      error: error.message 
    });
  }
};

// Supprimer un choix avec dé
exports.deleteDiceChoice = async (req, res) => {
  try {
    const { diceChoiceId } = req.params;

    const diceChoice = await prisma.diceChoice.findUnique({
      where: { id: diceChoiceId },
      include: { choice: { include: { page: true } } }
    });

    if (!diceChoice) {
      return res.status(404).json({ 
        message: 'Choix avec dé non trouvé' 
      });
    }

    // Vérifier l'autorisation
    const story = await prisma.story.findUnique({
      where: { id: diceChoice.choice.page.storyId }
    });

    if (story.authorId !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    await prisma.diceChoice.delete({
      where: { id: diceChoiceId }
    });

    res.json({
      message: 'Choix avec dé supprimé'
    });
  } catch (error) {
    console.error('Erreur deleteDiceChoice:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du choix', 
      error: error.message 
    });
  }
};
