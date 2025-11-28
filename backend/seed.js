import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Story from './models/Story.model.js';
import Page from './models/Page.model.js';
import Choice from './models/Choice.model.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nahb');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Story.deleteMany({});
    await Page.deleteMany({});
    await Choice.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@nahb.com',
      password: 'admin123',
      role: 'admin'
    });

    const author1 = await User.create({
      username: 'author_fantasy',
      email: 'fantasy@nahb.com',
      password: 'password123',
      role: 'author',
      bio: 'Auteur passionné de fantasy et d\'aventures épiques'
    });

    const author2 = await User.create({
      username: 'author_scifi',
      email: 'scifi@nahb.com',
      password: 'password123',
      role: 'author',
      bio: 'Expert en science-fiction et mondes futuristes'
    });

    const reader = await User.create({
      username: 'reader_test',
      email: 'reader@nahb.com',
      password: 'password123',
      role: 'reader'
    });

    console.log('👥 Created users');

    // Create Story 1 - Fantasy Adventure with Character Stats and Inventory
    const story1 = await Story.create({
      title: 'La Quête du Dragon Éternel',
      description: 'Vous êtes un jeune aventurier qui se lance dans une quête épique pour retrouver le Dragon Éternel et sauver le royaume. Gérez votre santé et collectez des objets !',
      author: author1._id,
      status: 'published',
      theme: 'fantasy',
      tags: ['dragon', 'aventure', 'magie', 'combat', 'RPG'],
      difficulty: 'medium',
      estimatedDuration: 25,
      averageRating: 4.5,
      totalRatings: 12,
      totalPlays: 45,
      hasInventory: true,
      hasCharacterStats: true,
      initialStats: {
        health: 100,
        attack: 15,
        defense: 10,
        magic: 5
      }
    });

    // Pages for Story 1
    const s1p1 = await Page.create({
      story: story1._id,
      title: 'Le Début de l\'Aventure',
      content: 'Vous vous réveillez dans votre village paisible. Le soleil se lève à peine et vous entendez des cris au loin. Le village est en danger !',
      isEnding: false,
      orderIndex: 1
    });

    const s1p2 = await Page.create({
      story: story1._id,
      title: 'La Forêt Mystérieuse',
      content: 'Vous vous enfoncez dans la forêt sombre. Des bruits étranges vous entourent. Vous apercevez deux chemins : l\'un vers le nord semble plus sûr, l\'autre vers l\'est est jonché de traces de combat.',
      isEnding: false,
      orderIndex: 2
    });

    const s1p3 = await Page.create({
      story: story1._id,
      title: 'La Grotte du Dragon',
      content: 'Vous arrivez devant une immense grotte. Une chaleur intense s\'en dégage. Vous entendez des ronflements puissants qui font trembler le sol.',
      isEnding: false,
      orderIndex: 3
    });

    const s1p4 = await Page.create({
      story: story1._id,
      title: 'Fin Héroïque',
      content: 'Vous parvenez à calmer le dragon grâce à votre courage et votre sagesse. Le royaume est sauvé et vous devenez une légende !',
      isEnding: true,
      endingLabel: 'Le Héros du Royaume',
      endingType: 'heroic',
      orderIndex: 4
    });

    const s1p5 = await Page.create({
      story: story1._id,
      title: 'Fin Tragique',
      content: 'Votre témérité vous a perdu. Le dragon vous a vaincu. Votre aventure se termine ici...',
      isEnding: true,
      endingLabel: 'La Fin du Téméraire',
      endingType: 'tragic',
      orderIndex: 5
    });

    const s1p6 = await Page.create({
      story: story1._id,
      title: 'La Clairière Enchantée',
      content: 'Vous découvrez une clairière magique baignée de lumière. Une fée apparaît et vous offre son aide.',
      isEnding: false,
      orderIndex: 6
    });

    // Choices for Story 1
    const s1c1 = await Choice.create({
      page: s1p1._id,
      text: 'Partir immédiatement vers la forêt',
      targetPage: s1p2._id,
      orderIndex: 1,
      statsModifier: {
        health: -5,
        attack: 0,
        defense: 0,
        magic: 0
      }
    });

    const s1c2 = await Choice.create({
      page: s1p1._id,
      text: 'Rassembler les villageois d\'abord',
      targetPage: s1p6._id,
      orderIndex: 2,
      itemGiven: 'Potion de soin',
      statsModifier: {
        health: 0,
        attack: 2,
        defense: 0,
        magic: 0
      }
    });

    const s1c3 = await Choice.create({
      page: s1p2._id,
      text: 'Prendre le chemin du nord (plus sûr)',
      targetPage: s1p6._id,
      orderIndex: 1,
      itemGiven: 'Carte ancienne'
    });

    const s1c4 = await Choice.create({
      page: s1p2._id,
      text: 'Suivre les traces vers l\'est',
      targetPage: s1p3._id,
      orderIndex: 2,
      timeLimit: 15,
      statsModifier: {
        health: -10,
        attack: 0,
        defense: 0,
        magic: 0
      }
    });

    const s1c5 = await Choice.create({
      page: s1p3._id,
      text: 'Entrer dans la grotte prudemment',
      targetPage: s1p4._id,
      requiresDice: true,
      diceCondition: {
        minValue: 10,
        maxValue: 20,
        diceType: 'd20'
      },
      description: 'Nécessite un jet de prudence (10+ sur d20)',
      orderIndex: 1,
      statsModifier: {
        health: 10,
        attack: 0,
        defense: 5,
        magic: 2
      }
    });

    const s1c6 = await Choice.create({
      page: s1p3._id,
      text: 'Crier un défi au dragon',
      targetPage: s1p5._id,
      orderIndex: 2,
      statsModifier: {
        health: -50,
        attack: 0,
        defense: 0,
        magic: 0
      }
    });

    const s1c7 = await Choice.create({
      page: s1p6._id,
      text: 'Accepter l\'aide de la fée et utiliser votre potion',
      targetPage: s1p4._id,
      orderIndex: 1,
      itemRequired: 'Potion de soin',
      itemGiven: 'Amulette magique',
      statsModifier: {
        health: 20,
        attack: 0,
        defense: 0,
        magic: 10
      }
    });

    const s1c8 = await Choice.create({
      page: s1p6._id,
      text: 'Refuser poliment et continuer seul',
      targetPage: s1p3._id,
      orderIndex: 2,
      statsModifier: {
        health: 0,
        attack: 5,
        defense: 5,
        magic: 0
      }
    });

    // Update story with pages and choices
    story1.pages = [s1p1._id, s1p2._id, s1p3._id, s1p4._id, s1p5._id, s1p6._id];
    story1.startPage = s1p1._id;
    await story1.save();

    s1p1.choices = [s1c1._id, s1c2._id];
    s1p2.choices = [s1c3._id, s1c4._id];
    s1p3.choices = [s1c5._id, s1c6._id];
    s1p6.choices = [s1c7._id, s1c8._id];
    
    await Promise.all([s1p1.save(), s1p2.save(), s1p3.save(), s1p6.save()]);

    console.log('📖 Created Story 1: Fantasy Adventure');

    // Create Story 2 - Sci-Fi with Timer and Stats
    const story2 = await Story.create({
      title: 'Station Orbitale Alpha',
      description: 'Vous êtes ingénieur sur une station spatiale quand une alerte retentit. Un astéroïde se dirige droit vers la Terre ! Prenez des décisions rapides sous pression !',
      author: author2._id,
      status: 'published',
      theme: 'sci-fi',
      tags: ['espace', 'science', 'survie', 'choix moraux', 'action'],
      difficulty: 'hard',
      estimatedDuration: 30,
      averageRating: 4.2,
      totalRatings: 8,
      totalPlays: 23,
      hasInventory: true,
      hasCharacterStats: true,
      initialStats: {
        health: 80,
        attack: 8,
        defense: 12,
        magic: 15
      }
    });

    const s2p1 = await Page.create({
      story: story2._id,
      title: 'Alerte Rouge',
      content: 'Les sirènes hurlent dans toute la station. Vous avez 30 minutes pour prendre une décision qui pourrait sauver des millions de vies. Le stress monte, votre cœur bat la chamade.',
      isEnding: false,
      orderIndex: 1
    });

    const s2p2 = await Page.create({
      story: story2._id,
      title: 'Fin du Héros',
      content: 'Vous avez réussi à dévier l\'astéroïde. La Terre est sauvée mais la station est gravement endommagée. Vous êtes un héros !',
      isEnding: true,
      endingLabel: 'Le Sauveur de la Terre',
      endingType: 'heroic',
      orderIndex: 2
    });

    const s2p3 = await Page.create({
      story: story2._id,
      title: 'Fin Mystérieuse',
      content: 'Vous découvrez que l\'astéroïde n\'était pas naturel. Quelqu\'un l\'a dirigé vers la Terre. L\'enquête ne fait que commencer...',
      isEnding: true,
      endingLabel: 'Le Complot',
      endingType: 'mysterious',
      orderIndex: 3
    });

    const s2p4 = await Page.create({
      story: story2._id,
      title: 'Salle de Contrôle',
      content: 'Vous atteignez la salle de contrôle. Les écrans montrent l\'astéroïde qui se rapproche. Vous devez agir maintenant !',
      isEnding: false,
      orderIndex: 4
    });

    const s2c1 = await Choice.create({
      page: s2p1._id,
      text: 'Aller chercher le kit de réparation d\'urgence',
      targetPage: s2p4._id,
      orderIndex: 1,
      timeLimit: 20,
      itemGiven: 'Kit de réparation',
      statsModifier: {
        health: -15,
        attack: 0,
        defense: 0,
        magic: 0
      }
    });

    const s2c2 = await Choice.create({
      page: s2p1._id,
      text: 'Analyser l\'astéroïde en détail',
      targetPage: s2p3._id,
      orderIndex: 2,
      timeLimit: 20
    });

    const s2c3 = await Choice.create({
      page: s2p4._id,
      text: 'Activer les propulseurs de la station (nécessite kit)',
      targetPage: s2p2._id,
      requiresDice: true,
      diceCondition: {
        minValue: 15,
        maxValue: 20,
        diceType: 'd20'
      },
      itemRequired: 'Kit de réparation',
      orderIndex: 1
    });

    const s2c4 = await Choice.create({
      page: s2p4._id,
      text: 'Tenter une manœuvre d\'urgence sans équipement',
      targetPage: s2p2._id,
      requiresDice: true,
      diceCondition: {
        minValue: 18,
        maxValue: 20,
        diceType: 'd20'
      },
      orderIndex: 2,
      statsModifier: {
        health: -30,
        attack: 0,
        defense: 0,
        magic: 0
      }
    });

    story2.pages = [s2p1._id, s2p2._id, s2p3._id, s2p4._id];
    story2.startPage = s2p1._id;
    await story2.save();

    s2p1.choices = [s2c1._id, s2c2._id];
    s2p4.choices = [s2c3._id, s2c4._id];
    await Promise.all([s2p1.save(), s2p4.save()]);

    console.log('📖 Created Story 2: Sci-Fi Adventure');

    // Create Story 3 - Mystery with Interactive Zones
    const story3 = await Story.create({
      title: 'Le Mystère du Manoir Abandonné',
      description: 'Une nuit d\'orage, vous vous réfugiez dans un vieux manoir. Explorez les pièces en cliquant sur les zones interactives pour découvrir ses secrets.',
      author: author1._id,
      status: 'published',
      theme: 'mystery',
      tags: ['mystère', 'exploration', 'énigme', 'interactif'],
      difficulty: 'easy',
      estimatedDuration: 20,
      hasInventory: true,
      hasCharacterStats: false
    });

    const s3p1 = await Page.create({
      story: story3._id,
      title: 'Le Hall d\'Entrée',
      content: 'Vous entrez dans le hall sombre du manoir. L\'orage gronde dehors. Des éclairs illuminent brièvement la pièce, révélant de vieux meubles couverts de poussière.',
      isEnding: false,
      orderIndex: 1,
      interactiveZones: [
        {
          x: 10,
          y: 30,
          width: 20,
          height: 30,
          shape: 'rectangle',
          description: 'Un vieux coffre poussiéreux'
        },
        {
          x: 70,
          y: 20,
          width: 25,
          height: 35,
          shape: 'rectangle',
          description: 'Un grand tableau ancien'
        }
      ]
    });

    const s3p2 = await Page.create({
      story: story3._id,
      title: 'Le Coffre Mystérieux',
      content: 'Vous ouvrez le coffre et trouvez une vieille clé rouillée. Elle pourrait ouvrir quelque chose dans le manoir...',
      isEnding: false,
      orderIndex: 2
    });

    const s3p3 = await Page.create({
      story: story3._id,
      title: 'Le Secret du Manoir',
      content: 'La clé ouvre une porte cachée derrière le tableau ! Vous découvrez un trésor ancestral. Le mystère est résolu !',
      isEnding: true,
      endingLabel: 'Le Chasseur de Trésor',
      endingType: 'happy',
      orderIndex: 3
    });

    const s3c1 = await Choice.create({
      page: s3p1._id,
      text: 'Examiner le coffre',
      targetPage: s3p2._id,
      orderIndex: 1,
      itemGiven: 'Clé rouillée'
    });

    const s3c2 = await Choice.create({
      page: s3p2._id,
      text: 'Utiliser la clé sur le tableau',
      targetPage: s3p3._id,
      orderIndex: 1,
      itemRequired: 'Clé rouillée'
    });

    const s3c3 = await Choice.create({
      page: s3p2._id,
      text: 'Explorer d\'autres pièces',
      targetPage: s3p1._id,
      orderIndex: 2
    });

    story3.pages = [s3p1._id, s3p2._id, s3p3._id];
    story3.startPage = s3p1._id;
    await story3.save();

    s3p1.choices = [s3c1._id];
    s3p2.choices = [s3c2._id, s3c3._id];
    await Promise.all([s3p1.save(), s3p2.save()]);

    console.log('📖 Created Story 3: Mystery Adventure');

    // Create Story 4 - Draft (not published)
    const story4 = await Story.create({
      title: 'L\'Île aux Pirates',
      description: 'Une aventure de pirates en cours de développement...',
      author: author2._id,
      status: 'draft',
      theme: 'adventure',
      tags: ['pirates', 'trésor', 'mer']
    });

    console.log('📖 Created Story 4: Draft Story');

    // Update users with their stories
    author1.createdStories = [story1._id, story3._id];
    author2.createdStories = [story2._id, story4._id];
    await Promise.all([author1.save(), author2.save()]);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   📚 Stories: ${await Story.countDocuments()}`);
    console.log(`   📄 Pages: ${await Page.countDocuments()}`);
    console.log(`   🔀 Choices: ${await Choice.countDocuments()}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@nahb.com / admin123');
    console.log('   Author 1: fantasy@nahb.com / password123');
    console.log('   Author 2: scifi@nahb.com / password123');
    console.log('   Reader: reader@nahb.com / password123');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
