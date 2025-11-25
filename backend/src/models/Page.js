const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Le contenu de la page est requis']
  },
  isEnd: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances de recherche
pageSchema.index({ storyId: 1 });

module.exports = mongoose.model('Page', pageSchema);
