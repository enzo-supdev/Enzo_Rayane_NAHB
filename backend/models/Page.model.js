import mongoose from 'mongoose';

const interactiveZoneSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  shape: {
    type: String,
    enum: ['rectangle', 'circle', 'polygon'],
    default: 'rectangle'
  },
  targetPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  },
  description: String
});

const diceConditionSchema = new mongoose.Schema({
  minValue: {
    type: Number,
    required: true,
    min: 1
  },
  maxValue: {
    type: Number,
    required: true,
    max: 20
  },
  diceType: {
    type: String,
    enum: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
    default: 'd6'
  }
});

const pageSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  isEnding: {
    type: Boolean,
    default: false
  },
  endingLabel: {
    type: String,
    trim: true,
    maxlength: [50, 'Ending label cannot exceed 50 characters']
  },
  endingType: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'heroic', 'tragic', 'mysterious'],
    default: null
  },
  image: {
    type: String,
    default: null
  },
  interactiveZones: [interactiveZoneSchema],
  choices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Choice'
  }],
  orderIndex: {
    type: Number,
    default: 0
  },
  timesVisited: {
    type: Number,
    default: 0
  },
  timesCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
pageSchema.index({ story: 1, orderIndex: 1 });
pageSchema.index({ story: 1, isEnding: 1 });

// Method to check if page has choices or interactive zones
pageSchema.methods.hasNavigation = function() {
  return (this.choices && this.choices.length > 0) || 
         (this.interactiveZones && this.interactiveZones.length > 0);
};

// Method to validate ending
pageSchema.methods.validateEnding = function() {
  if (this.isEnding && (!this.endingLabel || !this.endingType)) {
    throw new Error('Ending pages must have both label and type');
  }
  if (this.isEnding && this.hasNavigation()) {
    throw new Error('Ending pages cannot have choices or interactive zones');
  }
};

// Pre-save validation
pageSchema.pre('save', function(next) {
  try {
    if (this.isEnding) {
      this.validateEnding();
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Page', pageSchema);
