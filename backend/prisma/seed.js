const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed (Niveau 16/20 - Full Content)...');

  // Nettoyer la base
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.journeyStep.deleteMany();
  await prisma.playerJourney.deleteMany();
  await prisma.diceRoll.deleteMany();
  await prisma.diceChoice.deleteMany();
  await prisma.interactiveZone.deleteMany();
  await prisma.unlockedEnding.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.report.deleteMany();
  await prisma.statistics.deleteMany();
  await prisma.storyStatistics.deleteMany();
  await prisma.pathAnalysis.deleteMany();
  await prisma.treeVisualization.deleteMany();
  await prisma.treeNode.deleteMany();
  await prisma.storyTree.deleteMany();
  await prisma.previewSession.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.page.deleteMany();
  await prisma.story.deleteMany();
  await prisma.authorProfile.deleteMany();
  await prisma.image.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base nettoyée');

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============================================
  // NIVEAU 10/20 - UTILISATEURS DE BASE
  // ============================================
  console.log('\n📝 Création des utilisateurs...');

  const admin = await prisma.user.create({
    data: {
      pseudo: 'Admin',
      email: 'admin@nahb.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const author = await prisma.user.create({
    data: {
      pseudo: 'Auteur1',
      email: 'auteur@nahb.com',
      password: hashedPassword,
      role: 'AUTHOR',
    },
  });

  const author2 = await prisma.user.create({
    data: {
      pseudo: 'Auteur2',
      email: 'auteur2@nahb.com',
      password: hashedPassword,
      role: 'AUTHOR',
    },
  });

  const reader = await prisma.user.create({
    data: {
      pseudo: 'Lecteur1',
      email: 'lecteur@nahb.com',
      password: hashedPassword,
      role: 'READER',
    },
  });

  const reader2 = await prisma.user.create({
    data: {
      pseudo: 'Lecteur2',
      email: 'lecteur2@nahb.com',
      password: hashedPassword,
      role: 'READER',
    },
  });

  console.log('✅ Utilisateurs créés');

  // ============================================
  // NIVEAU 16/20 - PROFILS AUTEUR
  // ============================================
  console.log('\n👤 Création des profils auteur...');

  await prisma.authorProfile.create({
    data: {
      userId: author.id,
      bio: 'Auteur passionné par les histoires fantastiques et les aventures épiques.',
    },
  });

  await prisma.authorProfile.create({
    data: {
      userId: author2.id,
      bio: 'Créateur de mystères et de suspense.',
    },
  });

  console.log('✅ Profils auteur créés');

  // ============================================
  // HISTOIRE PRINCIPALE - AVEC TOUS LES NIVEAUX
  // ============================================
  console.log('\n📖 Création de l\'histoire principale...');

  const story1 = await prisma.story.create({
    data: {
      title: 'L\'Aventure Fantastique',
      description: 'Une histoire interactive avec plusieurs fins possibles et des mécaniques avancées.',
      tags: JSON.stringify(['fantastique', 'aventure', 'mystère', 'magie']),
      status: 'PUBLISHED',
      authorId: author.id,
    },
  });

  console.log('✅ Histoire créée');

  // ============================================
  // PAGES DE L'HISTOIRE
  // ============================================
  console.log('\n📄 Création des pages...');

  const page1 = await prisma.page.create({
    data: {
      content: 'Vous vous réveillez dans une forêt sombre et mystérieuse. Le vent souffle entre les arbres anciens. Deux chemins s\'offrent à vous : un sentier éclairé à gauche, et un chemin sombre à droite.',
      storyId: story1.id,
      isEnd: false,
      order: 1,
    },
  });

  const page2 = await prisma.page.create({
    data: {
      content: 'Vous avez pris le chemin de gauche. Après une longue marche, vous découvrez un magnifique trésor caché ! 🏆 Vous l\'ouvrez et trouvez des richesses inestimables. Félicitations, vous avez atteint la FIN HÉROÏQUE !',
      storyId: story1.id,
      isEnd: true,
      order: 2,
    },
  });

  const page3 = await prisma.page.create({
    data: {
      content: 'Vous avez pris le chemin de droite. Malheureusement, vous tombez dans un piège tendu par des bandits. 💀 C\'est la fin de votre aventure... FIN TRAGIQUE.',
      storyId: story1.id,
      isEnd: true,
      order: 3,
    },
  });

  const page4 = await prisma.page.create({
    data: {
      content: 'Une créature magique apparaît devant vous ! Elle vous propose un marché : vos richesses contre votre vie. Allez-vous accepter ?',
      storyId: story1.id,
      isEnd: false,
      order: 4,
    },
  });

  const page5 = await prisma.page.create({
    data: {
      content: 'Vous avez décliné l\'offre de la créature. Elle s\'envole dans le ciel, légèrement déçue. Vous continuez votre chemin et finissez par trouver un village. FIN NORMALE.',
      storyId: story1.id,
      isEnd: true,
      order: 5,
    },
  });

  console.log('✅ Pages créées');

  // Définir la page de départ
  await prisma.story.update({
    where: { id: story1.id },
    data: { startPageId: page1.id },
  });

  console.log('✅ Page de départ définie');

  // ============================================
  // CHOIX DE L'HISTOIRE
  // ============================================
  console.log('\n🔀 Création des choix...');

  const choice1 = await prisma.choice.create({
    data: {
      text: 'Prendre le sentier éclairé (gauche)',
      pageId: page1.id,
      targetPageId: page2.id,
      order: 1,
    },
  });

  const choice2 = await prisma.choice.create({
    data: {
      text: 'Prendre le chemin sombre (droite)',
      pageId: page1.id,
      targetPageId: page3.id,
      order: 2,
    },
  });

  const choice3 = await prisma.choice.create({
    data: {
      text: 'Accepter le marché de la créature',
      pageId: page4.id,
      targetPageId: page2.id,
      order: 1,
    },
  });

  const choice4 = await prisma.choice.create({
    data: {
      text: 'Refuser le marché',
      pageId: page4.id,
      targetPageId: page5.id,
      order: 2,
    },
  });

  console.log('✅ Choix créés');

  // ============================================
  // NIVEAU 13/20 - FINS NOMMÉES ET DÉVERROUILLAGE
  // ============================================
  console.log('\n🎯 Création des fins déverrouillées...');

  await prisma.unlockedEnding.create({
    data: {
      userId: reader.id,
      storyId: story1.id,
      pageId: page2.id,
    },
  });

  await prisma.unlockedEnding.create({
    data: {
      userId: reader2.id,
      storyId: story1.id,
      pageId: page5.id,
    },
  });

  console.log('✅ Fins déverrouillées créées');

  // ============================================
  // NIVEAU 13/20 - NOTATIONS ET COMMENTAIRES
  // ============================================
  console.log('\n⭐ Création des notations...');

  await prisma.rating.create({
    data: {
      userId: reader.id,
      storyId: story1.id,
      score: 5,
      comment: 'Excellente histoire ! Vraiment captivante.',
    },
  });

  await prisma.rating.create({
    data: {
      userId: reader2.id,
      storyId: story1.id,
      score: 4,
      comment: 'Bien écrit, mais j\'aurais aimé plus de détails.',
    },
  });

  console.log('✅ Notations créées');

  // ============================================
  // SESSIONS DE JEU
  // ============================================
  console.log('\n🎮 Création des sessions de jeu...');

  const session1 = await prisma.gameSession.create({
    data: {
      userId: reader.id,
      storyId: story1.id,
      endPageId: page2.id,
    },
  });

  const session2 = await prisma.gameSession.create({
    data: {
      userId: reader2.id,
      storyId: story1.id,
      endPageId: page5.id,
    },
  });

  console.log('✅ Sessions de jeu créées');

  // ============================================
  // NIVEAU 16/20 - PARCOURS JOUEUR
  // ============================================
  console.log('\n📍 Création des parcours joueur...');

  const journey1 = await prisma.playerJourney.create({
    data: {
      userId: reader.id,
      storyId: story1.id,
      status: 'completed',
      completedAt: new Date(),
    },
  });

  await prisma.journeyStep.create({
    data: {
      journeyId: journey1.id,
      pageId: page1.id,
      choiceId: choice1.id,
      stepOrder: 1,
    },
  });

  await prisma.journeyStep.create({
    data: {
      journeyId: journey1.id,
      pageId: page2.id,
      stepOrder: 2,
    },
  });

  console.log('✅ Parcours joueur créés');

  // ============================================
  // STATISTIQUES
  // ============================================
  console.log('\n📊 Création des statistiques...');

  await prisma.statistics.create({
    data: {
      storyId: story1.id,
      totalPlays: 2,
      completedPlays: 2,
      abandonedPlays: 0,
      averageRating: 4.5,
      totalRatings: 2,
    },
  });

  await prisma.storyStatistics.create({
    data: {
      storyId: story1.id,
      pageId: page1.id,
      viewCount: 2,
      chosenCount: 1,
    },
  });

  await prisma.storyStatistics.create({
    data: {
      storyId: story1.id,
      pageId: page2.id,
      viewCount: 1,
    },
  });

  await prisma.pathAnalysis.create({
    data: {
      storyId: story1.id,
      pageId: page1.id,
      percentage: 100,
      totalVisits: 2,
    },
  });

  console.log('✅ Statistiques créées');

  // ============================================
  // DEUXIÈME HISTOIRE - COURTE
  // ============================================
  console.log('\n📖 Création de la deuxième histoire...');

  const story2 = await prisma.story.create({
    data: {
      title: 'Le Mystère de la Caverne',
      description: 'Une courte aventure dans une caverne mystérieuse.',
      tags: JSON.stringify(['mystère', 'exploration', 'courte']),
      status: 'PUBLISHED',
      authorId: author2.id,
    },
  });

  const pageA1 = await prisma.page.create({
    data: {
      content: 'Vous entrez dans une caverne sombre. Une source de lumière bleue émane d\'une pierre au fond.',
      storyId: story2.id,
      isEnd: false,
      order: 1,
    },
  });

  const pageA2 = await prisma.page.create({
    data: {
      content: 'Vous touchez la pierre et elle s\'illumine. Vous êtes maintenant connecté à une ancienne magie. FIN MYSTIQUE.',
      storyId: story2.id,
      isEnd: true,
      order: 2,
    },
  });

  await prisma.story.update({
    where: { id: story2.id },
    data: { startPageId: pageA1.id },
  });

  await prisma.choice.create({
    data: {
      text: 'Toucher la pierre mystérieuse',
      pageId: pageA1.id,
      targetPageId: pageA2.id,
      order: 1,
    },
  });

  console.log('✅ Deuxième histoire créée');

  // ============================================
  // HISTOIRE EN BROUILLON
  // ============================================
  console.log('\n✏️ Création d\'une histoire en brouillon...');

  const draftStory = await prisma.story.create({
    data: {
      title: 'Histoire en cours de rédaction',
      description: 'Je suis encore en train de travailler sur cette histoire...',
      tags: JSON.stringify(['brouillon', 'en cours']),
      status: 'DRAFT',
      authorId: author.id,
    },
  });

  const draftPage = await prisma.page.create({
    data: {
      content: 'Page de départ... À compléter',
      storyId: draftStory.id,
      isEnd: false,
      order: 1,
    },
  });

  await prisma.story.update({
    where: { id: draftStory.id },
    data: { startPageId: draftPage.id },
  });

  console.log('✅ Histoire en brouillon créée');

  // ============================================
  // SIGNALEMENTS
  // ============================================
  console.log('\n🚩 Création des signalements...');

  await prisma.report.create({
    data: {
      storyId: story2.id,
      userId: reader.id,
      reason: 'Contenu offensant',
      status: 'pending',
      details: 'Cette histoire contient du contenu que je trouve offensant.',
    },
  });

  console.log('✅ Signalements créés');

  console.log('\n' + '='.repeat(60));
  console.log('📝 COMPTES DE TEST CRÉÉS :');
  console.log('='.repeat(60));
  console.log('👑 Admin:        admin@nahb.com / password123');
  console.log('✍️  Auteur 1:     auteur@nahb.com / password123');
  console.log('✍️  Auteur 2:     auteur2@nahb.com / password123');
  console.log('📖 Lecteur 1:    lecteur@nahb.com / password123');
  console.log('📖 Lecteur 2:    lecteur2@nahb.com / password123');

  console.log('\n' + '='.repeat(60));
  console.log('📚 HISTOIRES CRÉÉES :');
  console.log('='.repeat(60));
  console.log('1. "L\'Aventure Fantastique" (publiée) - 5 pages, 3 fins, 2 joueurs');
  console.log('2. "Le Mystère de la Caverne" (publiée) - 2 pages');
  console.log('3. "Histoire en cours de rédaction" (brouillon) - 1 page');

  console.log('\n' + '='.repeat(60));
  console.log('✨ CONTENU STATISTIQUE GÉNÉRÉ :');
  console.log('='.repeat(60));
  console.log('📊 Notations: 2 (moyenne 4.5/5)');
  console.log('🎯 Fins déverrouillées: 2');
  console.log('📍 Parcours joueur: 1 (avec étapes détaillées)');
  console.log('🚩 Signalements: 1');

  console.log('\n' + '='.repeat(60));
  console.log('🌱 Seed niveau 16/20 terminé avec succès !');
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });