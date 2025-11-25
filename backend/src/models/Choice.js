const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Le texte du choix est requis'],
    trim: true
  },
  targetPageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

// Index pour améliorer les performances
choiceSchema.index({ pageId: 1 });

module.exports = mongoose.model('Choice', choiceSchema);
