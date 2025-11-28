import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // XP and Level System
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Avatar Customization
  avatarStyle: {
    type: String,
    enum: ['default', 'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8'],
    default: 'default'
  },
  avatarColor: {
    type: String,
    default: '#3b82f6' // blue-500
  },
  avatarFrame: {
    type: String,
    enum: ['none', 'bronze', 'silver', 'gold', 'diamond', 'legendary'],
    default: 'none'
  },
  profileTheme: {
    type: String,
    enum: ['light', 'dark', 'fantasy', 'scifi', 'horror', 'mystery'],
    default: 'light'
  },
  
  // Titles
  title: {
    type: String,
    default: 'Novice Reader'
  },
  unlockedTitles: [{
    type: String
  }],
  
  // Achievements
  achievements: [{
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  
  // Statistics
  stats: {
    storiesCompleted: {
      type: Number,
      default: 0
    },
    storiesCreated: {
      type: Number,
      default: 0
    },
    endingsFound: {
      type: Number,
      default: 0
    },
    choicesMade: {
      type: Number,
      default: 0
    },
    commentsMade: {
      type: Number,
      default: 0
    },
    ratingsGiven: {
      type: Number,
      default: 0
    },
    totalReadingTime: {
      type: Number,
      default: 0 // in minutes
    },
    daysActive: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Preferences
  preferences: {
    showAchievementPopups: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: true
    },
    showStats: {
      type: Boolean,
      default: true
    }
  }
  
}, {
  timestamps: true
});

// Method to add XP and check for level up
userProfileSchema.methods.addXP = function(amount) {
  this.xp += amount;
  const xpForNextLevel = this.level * 100; // Simple formula: level * 100
  
  if (this.xp >= xpForNextLevel) {
    this.level += 1;
    this.xp = this.xp - xpForNextLevel;
    return { leveledUp: true, newLevel: this.level };
  }
  
  return { leveledUp: false, currentXP: this.xp, xpForNextLevel };
};

// Method to unlock achievement
userProfileSchema.methods.unlockAchievement = function(achievementId) {
  const alreadyUnlocked = this.achievements.some(
    a => a.achievement.toString() === achievementId.toString()
  );
  
  if (!alreadyUnlocked) {
    this.achievements.push({
      achievement: achievementId,
      unlockedAt: new Date(),
      progress: 100
    });
    return true;
  }
  
  return false;
};

// Method to update achievement progress
userProfileSchema.methods.updateAchievementProgress = function(achievementId, progress) {
  const achievement = this.achievements.find(
    a => a.achievement.toString() === achievementId.toString()
  );
  
  if (achievement) {
    achievement.progress = progress;
  }
};

export default mongoose.model('UserProfile', userProfileSchema);
