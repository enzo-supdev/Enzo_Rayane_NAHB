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

    // Create Story 1 - Fantasy Adventure
    const story1 = await Story.create({
      title: 'La Quête du Dragon Éternel',
      description: 'Vous êtes un jeune aventurier qui se lance dans une quête épique pour retrouver le Dragon Éternel et sauver le royaume.',
      author: author1._id,
      status: 'published',
      theme: 'fantasy',
      tags: ['dragon', 'aventure', 'magie', 'combat'],
      difficulty: 'medium',
      estimatedDuration: 25,
      averageRating: 4.5,
      totalRatings: 12,
      totalPlays: 45
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
      orderIndex: 1
    });

    const s1c2 = await Choice.create({
      page: s1p1._id,
      text: 'Rassembler les villageois d\'abord',
      targetPage: s1p6._id,
      orderIndex: 2
    });

    const s1c3 = await Choice.create({
      page: s1p2._id,
      text: 'Prendre le chemin du nord (plus sûr)',
      targetPage: s1p6._id,
      orderIndex: 1
    });

    const s1c4 = await Choice.create({
      page: s1p2._id,
      text: 'Suivre les traces vers l\'est',
      targetPage: s1p3._id,
      orderIndex: 2
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
      orderIndex: 1
    });

    const s1c6 = await Choice.create({
      page: s1p3._id,
      text: 'Crier un défi au dragon',
      targetPage: s1p5._id,
      orderIndex: 2
    });

    const s1c7 = await Choice.create({
      page: s1p6._id,
      text: 'Accepter l\'aide de la fée',
      targetPage: s1p4._id,
      orderIndex: 1
    });

    // Update story with pages and choices
    story1.pages = [s1p1._id, s1p2._id, s1p3._id, s1p4._id, s1p5._id, s1p6._id];
    story1.startPage = s1p1._id;
    await story1.save();

    s1p1.choices = [s1c1._id, s1c2._id];
    s1p2.choices = [s1c3._id, s1c4._id];
    s1p3.choices = [s1c5._id, s1c6._id];
    s1p6.choices = [s1c7._id];
    
    await Promise.all([s1p1.save(), s1p2.save(), s1p3.save(), s1p6.save()]);

    console.log('📖 Created Story 1: Fantasy Adventure');

    // Create Story 2 - Sci-Fi
    const story2 = await Story.create({
      title: 'Station Orbitale Alpha',
      description: 'Vous êtes ingénieur sur une station spatiale quand une alerte retentit. Un astéroïde se dirige droit vers la Terre !',
      author: author2._id,
      status: 'published',
      theme: 'sci-fi',
      tags: ['espace', 'science', 'survie', 'choix moraux'],
      difficulty: 'hard',
      estimatedDuration: 30,
      averageRating: 4.2,
      totalRatings: 8,
      totalPlays: 23
    });

    const s2p1 = await Page.create({
      story: story2._id,
      title: 'Alerte Rouge',
      content: 'Les sirènes hurlent dans toute la station. Vous avez 30 minutes pour prendre une décision qui pourrait sauver des millions de vies.',
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

    const s2c1 = await Choice.create({
      page: s2p1._id,
      text: 'Activer les propulseurs de la station',
      targetPage: s2p2._id,
      requiresDice: true,
      diceCondition: {
        minValue: 15,
        maxValue: 20,
        diceType: 'd20'
      },
      orderIndex: 1
    });

    const s2c2 = await Choice.create({
      page: s2p1._id,
      text: 'Analyser l\'astéroïde en détail',
      targetPage: s2p3._id,
      orderIndex: 2
    });

    story2.pages = [s2p1._id, s2p2._id, s2p3._id];
    story2.startPage = s2p1._id;
    await story2.save();

    s2p1.choices = [s2c1._id, s2c2._id];
    await s2p1.save();

    console.log('📖 Created Story 2: Sci-Fi Adventure');

    // Create Story 3 - Draft (not published)
    const story3 = await Story.create({
      title: 'Le Mystère du Manoir Hanté',
      description: 'Une enquête dans un vieux manoir abandonné. Travail en cours...',
      author: author1._id,
      status: 'draft',
      theme: 'horror',
      tags: ['mystère', 'horreur', 'enquête']
    });

    console.log('📖 Created Story 3: Draft Story');

    // Update users with their stories
    author1.createdStories = [story1._id, story3._id];
    author2.createdStories = [story2._id];
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
