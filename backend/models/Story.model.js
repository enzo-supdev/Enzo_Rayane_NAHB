import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'suspended'],
    default: 'draft'
  },
  suspendReason: {
    type: String,
    default: null
  },
  suspendedAt: {
    type: Date,
    default: null
  },
  theme: {
    type: String,
    enum: ['fantasy', 'sci-fi', 'horror', 'mystery', 'romance', 'adventure', 'historical', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  coverImage: {
    type: String,
    default: null
  },
  startPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalPlays: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 15
  },
  hasInventory: {
    type: Boolean,
    default: false
  },
  hasCharacterStats: {
    type: Boolean,
    default: false
  },
  initialStats: {
    health: { type: Number, default: 100 },
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    magic: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for performance
storySchema.index({ author: 1, status: 1 });
storySchema.index({ status: 1, theme: 1 });
storySchema.index({ averageRating: -1 });
storySchema.index({ totalPlays: -1 });
storySchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for ratings
storySchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'story'
});

// Virtual for games
storySchema.virtual('games', {
  ref: 'Game',
  localField: '_id',
  foreignField: 'story'
});

// Method to check if story is playable
storySchema.methods.isPlayable = function() {
  return this.status === 'published' && this.startPage !== null;
};

// Method to update rating
storySchema.methods.updateRating = async function(newRating) {
  const totalScore = (this.averageRating * this.totalRatings) + newRating;
  this.totalRatings += 1;
  this.averageRating = totalScore / this.totalRatings;
  await this.save();
};

export default mongoose.model('Story', storySchema);
