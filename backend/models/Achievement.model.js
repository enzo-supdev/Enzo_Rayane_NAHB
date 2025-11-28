import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['reader', 'author', 'social', 'explorer', 'completionist', 'special'],
    default: 'reader'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  xpReward: {
    type: Number,
    default: 10
  },
  condition: {
    type: {
      type: String,
      enum: ['stories_completed', 'stories_created', 'endings_found', 'comments_made', 'ratings_given', 'days_active', 'custom'],
      required: true
    },
    target: {
      type: Number,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Achievement', achievementSchema);
