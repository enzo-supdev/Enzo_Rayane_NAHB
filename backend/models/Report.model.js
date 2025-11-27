import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: [
      'inappropriate_content',
      'spam',
      'copyright',
      'offensive',
      'misleading',
      'broken',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    maxlength: [500, 'Admin note cannot exceed 500 characters']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ story: 1, status: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
