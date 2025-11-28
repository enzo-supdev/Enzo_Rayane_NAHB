import UserProfile from '../models/UserProfile.model.js';
import { checkAchievements } from './achievement.controller.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    let profile = await UserProfile.findOne({ user: userId })
      .populate('user', 'username email avatar bio role createdAt')
      .populate('achievements.achievement');

    if (!profile) {
      // Create profile if doesn't exist
      profile = await UserProfile.create({ user: userId });
      await profile.populate('user', 'username email avatar bio role createdAt');
      await profile.populate('achievements.achievement');
    }

    // Check privacy settings
    if (userId.toString() !== req.user._id.toString() && !profile.preferences.publicProfile) {
      return res.status(403).json({
        success: false,
        message: 'This profile is private'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update profile customization
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      avatarStyle,
      avatarColor,
      avatarFrame,
      profileTheme,
      title,
      preferences
    } = req.body;

    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      profile = await UserProfile.create({ user: userId });
    }

    // Update customization fields
    if (avatarStyle) profile.avatarStyle = avatarStyle;
    if (avatarColor) profile.avatarColor = avatarColor;
    if (avatarFrame) profile.avatarFrame = avatarFrame;
    if (profileTheme) profile.profileTheme = profileTheme;
    
    // Update title (check if unlocked)
    if (title) {
      if (profile.unlockedTitles.includes(title) || title === 'Novice Reader') {
        profile.title = title;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Title not unlocked'
        });
      }
    }

    // Update preferences
    if (preferences) {
      profile.preferences = { ...profile.preferences, ...preferences };
    }

    await profile.save();
    await profile.populate('user', 'username email avatar bio role createdAt');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Add XP to user
export const addXP = async (userId, amount, reason = 'action') => {
  try {
    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      profile = await UserProfile.create({ user: userId });
    }

    const result = profile.addXP(amount);
    await profile.save();

    // Check for new titles based on level
    await updateTitles(profile);

    return {
      ...result,
      reason,
      totalXP: profile.xp,
      currentLevel: profile.level
    };
  } catch (error) {
    console.error('Error adding XP:', error);
    return null;
  }
};

// Update titles based on stats
const updateTitles = async (profile) => {
  const titlesByLevel = {
    1: 'Novice Reader',
    5: 'Apprentice Reader',
    10: 'Skilled Reader',
    15: 'Expert Reader',
    20: 'Master Reader',
    30: 'Legendary Reader',
    50: 'Mythic Reader'
  };

  const titlesByStats = {
    'Story Enthusiast': () => profile.stats.storiesCompleted >= 10,
    'Completionist': () => profile.stats.endingsFound >= 20,
    'Social Butterfly': () => profile.stats.commentsMade >= 20,
    'Veteran': () => profile.stats.daysActive >= 30,
    'Author': () => profile.stats.storiesCreated >= 1,
    'Prolific Author': () => profile.stats.storiesCreated >= 5
  };

  // Add level-based titles
  for (const [level, title] of Object.entries(titlesByLevel)) {
    if (profile.level >= parseInt(level) && !profile.unlockedTitles.includes(title)) {
      profile.unlockedTitles.push(title);
    }
  }

  // Add stat-based titles
  for (const [title, condition] of Object.entries(titlesByStats)) {
    if (condition() && !profile.unlockedTitles.includes(title)) {
      profile.unlockedTitles.push(title);
    }
  }

  await profile.save();
};

// Update user stats
export const updateStats = async (userId, statsUpdate) => {
  try {
    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      profile = await UserProfile.create({ user: userId });
    }

    // Update stats
    for (const [key, value] of Object.entries(statsUpdate)) {
      if (profile.stats[key] !== undefined) {
        profile.stats[key] += value;
      }
    }

    // Update last active date and days active
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(profile.stats.lastActiveDate).setHours(0, 0, 0, 0);
    
    if (today !== lastActive) {
      profile.stats.daysActive += 1;
      profile.stats.lastActiveDate = new Date();
    }

    await profile.save();

    // Check for new achievements
    const newAchievements = await checkAchievements(userId);

    return {
      success: true,
      stats: profile.stats,
      newAchievements
    };
  } catch (error) {
    console.error('Error updating stats:', error);
    return { success: false, error: error.message };
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { type = 'level', limit = 10 } = req.query;

    let sortField = {};
    
    switch (type) {
      case 'level':
        sortField = { level: -1, xp: -1 };
        break;
      case 'stories':
        sortField = { 'stats.storiesCompleted': -1 };
        break;
      case 'endings':
        sortField = { 'stats.endingsFound': -1 };
        break;
      case 'achievements':
        sortField = { 'achievements': -1 };
        break;
      default:
        sortField = { level: -1 };
    }

    const leaderboard = await UserProfile.find()
      .populate('user', 'username avatar')
      .sort(sortField)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

export default {
  getUserProfile,
  updateProfile,
  addXP,
  updateStats,
  getLeaderboard
};
