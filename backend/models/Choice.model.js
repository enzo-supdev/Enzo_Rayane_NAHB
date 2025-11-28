import mongoose from 'mongoose';

const choiceSchema = new mongoose.Schema({
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Choice text is required'],
    trim: true,
    maxlength: [200, 'Choice text cannot exceed 200 characters']
  },
  targetPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  requiresDice: {
    type: Boolean,
    default: false
  },
  diceCondition: {
    minValue: {
      type: Number,
      min: 1,
      default: 1
    },
    maxValue: {
      type: Number,
      max: 20,
      default: 20
    },
    diceType: {
      type: String,
      enum: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
      default: 'd6'
    }
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  timesChosen: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  timeLimit: {
    type: Number, // in seconds
    default: null
  },
  itemRequired: {
    type: String,
    default: null
  },
  itemGiven: {
    type: String,
    default: null
  },
  statsModifier: {
    health: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    magic: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
choiceSchema.index({ page: 1, orderIndex: 1 });

// Method to check if dice roll succeeds
choiceSchema.methods.checkDiceRoll = function(rollValue) {
  if (!this.requiresDice) return true;
  return rollValue >= this.diceCondition.minValue && rollValue <= this.diceCondition.maxValue;
};

// Method to get max dice value
choiceSchema.methods.getMaxDiceValue = function() {
  if (!this.requiresDice) return null;
  const diceMap = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
    'd20': 20
  };
  return diceMap[this.diceCondition.diceType] || 6;
};

export default mongoose.model('Choice', choiceSchema);
