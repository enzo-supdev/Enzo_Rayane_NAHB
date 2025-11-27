import mongoose from 'mongoose';

const pathStepSchema = new mongoose.Schema({
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  choice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Choice'
  },
  diceRoll: {
    type: Number,
    min: 1,
    max: 20
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  currentPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  },
  path: [pathStepSchema],
  endingReached: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
gameSchema.index({ story: 1, player: 1 });
gameSchema.index({ player: 1, status: 1 });
gameSchema.index({ story: 1, status: 1 });
gameSchema.index({ endingReached: 1 });

// Method to add a step to the path
gameSchema.methods.addStep = function(pageId, choiceId = null, diceRoll = null) {
  this.path.push({
    page: pageId,
    choice: choiceId,
    diceRoll: diceRoll,
    timestamp: new Date()
  });
  this.currentPage = pageId;
};

// Method to complete the game
gameSchema.methods.complete = function(endingPageId) {
  this.status = 'completed';
  this.endingReached = endingPageId;
  this.completedAt = new Date();
  this.duration = Math.floor((this.completedAt - this.startedAt) / 1000);
};

// Method to calculate path similarity percentage
gameSchema.methods.calculatePathSimilarity = async function() {
  const Game = mongoose.model('Game');
  
  // Get all completed games for this story
  const completedGames = await Game.find({
    story: this.story,
    status: 'completed',
    isPreview: false,
    _id: { $ne: this._id }
  });

  if (completedGames.length === 0) return 100;

  // Calculate similarity based on common pages
  let totalSimilarity = 0;
  const currentPath = this.path.map(step => step.page.toString());

  for (const game of completedGames) {
    const gamePath = game.path.map(step => step.page.toString());
    const commonPages = currentPath.filter(pageId => gamePath.includes(pageId));
    const similarity = (commonPages.length / Math.max(currentPath.length, gamePath.length)) * 100;
    totalSimilarity += similarity;
  }

  return Math.round(totalSimilarity / completedGames.length);
};

// Virtual for pages visited count
gameSchema.virtual('pagesVisited').get(function() {
  return this.path.length;
});

export default mongoose.model('Game', gameSchema);
