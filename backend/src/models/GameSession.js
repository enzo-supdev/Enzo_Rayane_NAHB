const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  endPageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les statistiques
gameSessionSchema.index({ storyId: 1, endPageId: 1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);
