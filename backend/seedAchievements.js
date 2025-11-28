import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from './models/Achievement.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nahb';

const achievements = [
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

const seedAchievements = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('🗑️  Cleared existing achievements');

    // Insert new achievements
    await Achievement.insertMany(achievements);
    console.log(`✅ Seeded ${achievements.length} achievements`);

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    process.exit(1);
  }
};

seedAchievements();
