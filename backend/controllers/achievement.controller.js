import Achievement from '../models/Achievement.model.js';
import UserProfile from '../models/UserProfile.model.js';

// Seed default achievements (à appeler au démarrage ou via route admin)
export const seedAchievements = async (req, res) => {
  try {
    const defaultAchievements = [
      // Reader Achievements
      {
        key: 'first_story',
        name: 'Premier Pas',
        description: 'Terminer votre première histoire',
        icon: '📖',
        category: 'reader',
        rarity: 'common',
        xpReward: 50,
        condition: { type: 'stories_completed', target: 1 }
      },
      {
        key: 'story_enthusiast',
        name: 'Lecteur Passionné',
        description: 'Terminer 5 histoires',
        icon: '📚',
        category: 'reader',
        rarity: 'rare',
        xpReward: 100,
        condition: { type: 'stories_completed', target: 5 }
      },
      {
        key: 'story_master',
        name: 'Maître des Histoires',
        description: 'Terminer 20 histoires',
        icon: '🎓',
        category: 'reader',
        rarity: 'epic',
        xpReward: 250,
        condition: { type: 'stories_completed', target: 20 }
      },
      {
        key: 'story_legend',
        name: 'Légende Vivante',
        description: 'Terminer 50 histoires',
        icon: '👑',
        category: 'reader',
        rarity: 'legendary',
        xpReward: 500,
        condition: { type: 'stories_completed', target: 50 }
      },
      
      // Completionist Achievements
      {
        key: 'ending_collector',
        name: 'Collectionneur de Fins',
        description: 'Découvrir 10 fins différentes',
        icon: '🎯',
        category: 'completionist',
        rarity: 'rare',
        xpReward: 150,
        condition: { type: 'endings_found', target: 10 }
      },
      {
        key: 'ending_master',
        name: 'Maître des Dénouements',
        description: 'Découvrir 25 fins différentes',
        icon: '🏅',
        category: 'completionist',
        rarity: 'epic',
        xpReward: 300,
        condition: { type: 'endings_found', target: 25 }
      },
      {
        key: 'all_paths',
        name: 'Tous les Chemins',
        description: 'Découvrir 50 fins différentes',
        icon: '🌟',
        category: 'completionist',
        rarity: 'legendary',
        xpReward: 600,
        condition: { type: 'endings_found', target: 50 }
      },
      
      // Explorer Achievements
      {
        key: 'explorer',
        name: 'Explorateur',
        description: 'Faire 100 choix',
        icon: '🧭',
        category: 'explorer',
        rarity: 'common',
        xpReward: 75,
        condition: { type: 'custom', target: 100 }
      },
      
      // Social Achievements
      {
        key: 'first_comment',
        name: 'Première Critique',
        description: 'Poster votre premier commentaire',
        icon: '💬',
        category: 'social',
        rarity: 'common',
        xpReward: 25,
        condition: { type: 'comments_made', target: 1 }
      },
      {
        key: 'critic',
        name: 'Critique Littéraire',
        description: 'Poster 10 commentaires',
        icon: '📝',
        category: 'social',
        rarity: 'rare',
        xpReward: 100,
        condition: { type: 'comments_made', target: 10 }
      },
      {
        key: 'reviewer',
        name: 'Évaluateur Actif',
        description: 'Noter 10 histoires',
        icon: '⭐',
        category: 'social',
        rarity: 'rare',
        xpReward: 100,
        condition: { type: 'ratings_given', target: 10 }
      },
      
      // Author Achievements
      {
        key: 'first_creation',
        name: 'Auteur en Herbe',
        description: 'Publier votre première histoire',
        icon: '✍️',
        category: 'author',
        rarity: 'rare',
        xpReward: 200,
        condition: { type: 'stories_created', target: 1 }
      },
      {
        key: 'prolific_author',
        name: 'Auteur Prolifique',
        description: 'Publier 5 histoires',
        icon: '📜',
        category: 'author',
        rarity: 'epic',
        xpReward: 400,
        condition: { type: 'stories_created', target: 5 }
      },
      
      // Special Achievements
      {
        key: 'dedicated',
        name: 'Dévouement',
        description: 'Se connecter 7 jours consécutifs',
        icon: '🔥',
        category: 'special',
        rarity: 'epic',
        xpReward: 300,
        condition: { type: 'days_active', target: 7 }
      },
      {
        key: 'veteran',
        name: 'Vétéran',
        description: 'Se connecter 30 jours consécutifs',
        icon: '💎',
        category: 'special',
        rarity: 'legendary',
        xpReward: 1000,
        condition: { type: 'days_active', target: 30 }
      }
    ];

    // Upsert achievements (update if exists, create if not)
    for (const achievement of defaultAchievements) {
      await Achievement.findOneAndUpdate(
        { key: achievement.key },
        achievement,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: `${defaultAchievements.length} achievements seeded successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding achievements',
      error: error.message
    });
  }
};

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true })
      .sort({ rarity: 1, category: 1 });

    res.status(200).json({
      success: true,
      count: achievements.length,
      achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
};

// Get user's achievements
export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await UserProfile.findOne({ user: userId })
      .populate('achievements.achievement');

    if (!profile) {
      // Create profile if doesn't exist
      profile = await UserProfile.create({ user: userId });
      await profile.populate('achievements.achievement');
    }

    const allAchievements = await Achievement.find({ isActive: true });
    
    // Calculate progress for each achievement
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = profile.achievements.find(
        a => a.achievement && a.achievement._id.toString() === achievement._id.toString()
      );

      let progress = 0;
      let currentValue = 0;

      if (userAchievement) {
        progress = 100;
        currentValue = achievement.condition.target;
      } else {
        // Calculate progress based on achievement type
        switch (achievement.condition.type) {
          case 'stories_completed':
            currentValue = profile.stats.storiesCompleted;
            break;
          case 'stories_created':
            currentValue = profile.stats.storiesCreated;
            break;
          case 'endings_found':
            currentValue = profile.stats.endingsFound;
            break;
          case 'comments_made':
            currentValue = profile.stats.commentsMade;
            break;
          case 'ratings_given':
            currentValue = profile.stats.ratingsGiven;
            break;
          case 'days_active':
            currentValue = profile.stats.daysActive;
            break;
          default:
            currentValue = 0;
        }
        
        progress = Math.min((currentValue / achievement.condition.target) * 100, 100);
      }

      return {
        ...achievement.toObject(),
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt || null,
        progress: Math.round(progress),
        currentValue,
        targetValue: achievement.condition.target
      };
    });

    res.status(200).json({
      success: true,
      achievements: achievementsWithProgress,
      unlockedCount: profile.achievements.length,
      totalCount: allAchievements.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user achievements',
      error: error.message
    });
  }
};

// Check and unlock achievements for user
export const checkAchievements = async (userId) => {
  try {
    let profile = await UserProfile.findOne({ user: userId });
    
    if (!profile) {
      profile = await UserProfile.create({ user: userId });
    }

    const allAchievements = await Achievement.find({ isActive: true });
    const unlockedAchievements = [];

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      const alreadyUnlocked = profile.achievements.some(
        a => a.achievement.toString() === achievement._id.toString()
      );

      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      // Check if achievement should be unlocked
      switch (achievement.condition.type) {
        case 'stories_completed':
          shouldUnlock = profile.stats.storiesCompleted >= achievement.condition.target;
          break;
        case 'stories_created':
          shouldUnlock = profile.stats.storiesCreated >= achievement.condition.target;
          break;
        case 'endings_found':
          shouldUnlock = profile.stats.endingsFound >= achievement.condition.target;
          break;
        case 'comments_made':
          shouldUnlock = profile.stats.commentsMade >= achievement.condition.target;
          break;
        case 'ratings_given':
          shouldUnlock = profile.stats.ratingsGiven >= achievement.condition.target;
          break;
        case 'days_active':
          shouldUnlock = profile.stats.daysActive >= achievement.condition.target;
          break;
      }

      if (shouldUnlock) {
        profile.unlockAchievement(achievement._id);
        profile.addXP(achievement.xpReward);
        unlockedAchievements.push(achievement);
      }
    }

    if (unlockedAchievements.length > 0) {
      await profile.save();
    }

    return unlockedAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

export default {
  seedAchievements,
  getAllAchievements,
  getUserAchievements,
  checkAchievements
};
