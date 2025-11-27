import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one rating per user per story
ratingSchema.index({ story: 1, user: 1 }, { unique: true });

// Index for fetching story ratings
ratingSchema.index({ story: 1, createdAt: -1 });

export default mongoose.model('Rating', ratingSchema);
