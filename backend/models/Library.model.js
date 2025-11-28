import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Favorites
  favorites: [{
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // In Progress Stories
  inProgress: [{
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    currentPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page'
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastPlayedAt: {
      type: Date,
      default: Date.now
    },
    startedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Completed Stories
  completed: [{
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    endingReached: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    readingTime: {
      type: Number, // in minutes
      default: 0
    }
  }],
  
  // Reading Lists (custom collections)
  readingLists: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    stories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
  
}, {
  timestamps: true
});

// Method to add to favorites
librarySchema.methods.addFavorite = function(storyId) {
  const alreadyFavorite = this.favorites.some(
    f => f.story.toString() === storyId.toString()
  );
  
  if (!alreadyFavorite) {
    this.favorites.push({ story: storyId, addedAt: new Date() });
    return true;
  }
  
  return false;
};

// Method to remove from favorites
librarySchema.methods.removeFavorite = function(storyId) {
  this.favorites = this.favorites.filter(
    f => f.story.toString() !== storyId.toString()
  );
};

// Method to check if story is favorite
librarySchema.methods.isFavorite = function(storyId) {
  return this.favorites.some(
    f => f.story.toString() === storyId.toString()
  );
};

// Method to update progress
librarySchema.methods.updateProgress = function(storyId, gameId, currentPageId, progressPercent) {
  const existingProgress = this.inProgress.find(
    p => p.story.toString() === storyId.toString()
  );
  
  if (existingProgress) {
    existingProgress.currentPage = currentPageId;
    existingProgress.progressPercent = progressPercent;
    existingProgress.lastPlayedAt = new Date();
  } else {
    this.inProgress.push({
      story: storyId,
      game: gameId,
      currentPage: currentPageId,
      progressPercent: progressPercent,
      lastPlayedAt: new Date(),
      startedAt: new Date()
    });
  }
};

// Method to mark as completed
librarySchema.methods.markCompleted = function(storyId, gameId, endingReached, readingTime = 0, rating = null) {
  // Remove from in progress
  this.inProgress = this.inProgress.filter(
    p => p.story.toString() !== storyId.toString()
  );
  
  // Add to completed
  this.completed.push({
    story: storyId,
    game: gameId,
    completedAt: new Date(),
    endingReached,
    rating,
    readingTime
  });
};

export default mongoose.model('Library', librarySchema);
