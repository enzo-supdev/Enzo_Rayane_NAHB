const express = require('express');
const router = express.Router();
const diceController = require('../controllers/diceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/dice - Créer un choix avec dé
router.post('/', auth, roleCheck('author', 'admin'), diceController.createDiceChoice);

// POST /api/dice/roll - Lancer un dé
router.post('/roll', auth, diceController.rollDice);

// GET /api/dice/:diceChoiceId - Récupérer les infos d'un choix avec dé
router.get('/:diceChoiceId', auth, diceController.getDiceChoice);

// DELETE /api/dice/:diceChoiceId - Supprimer un choix avec dé
router.delete('/:diceChoiceId', auth, roleCheck('author', 'admin'), diceController.deleteDiceChoice);

module.exports = router;
