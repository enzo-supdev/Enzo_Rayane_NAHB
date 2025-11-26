const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed (Niveau 10/20)...');

  // Nettoyer la base
  await prisma.gameSession.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.page.deleteMany();
  await prisma.story.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('🧹 Base nettoyée');

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Créer des utilisateurs
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

  const reader = await prisma.user.create({
    data: {
      pseudo: 'Lecteur1',
      email: 'lecteur@nahb.com',
      password: hashedPassword,
      role: 'READER',
    },
  });

  console.log('✅ Utilisateurs créés');

  // Créer une histoire (sans startPageId pour l'instant)
  const story = await prisma.story.create({
    data: {
      title: 'L\'Aventure Fantastique',
      description: 'Une histoire interactive avec plusieurs fins possibles',
      tags: JSON.stringify(['fantastique', 'aventure', 'mystère']),
      status: 'PUBLISHED',
      authorId: author.id,
    },
  });

  console.log('✅ Histoire créée');

  // Créer les pages
  const page1 = await prisma.page.create({
    data: {
      content: 'Vous vous réveillez dans une forêt sombre. Deux chemins s\'offrent à vous : un sentier éclairé à gauche, et un chemin sombre à droite.',
      storyId: story.id,
      isEnd: false,
      order: 1,
    },
  });

  const page2 = await prisma.page.create({
    data: {
      content: 'Vous avez pris le chemin de gauche. Après une longue marche, vous découvrez un magnifique trésor caché ! 🏆 Félicitations, vous avez gagné !',
      storyId: story.id,
      isEnd: true,
      order: 2,
    },
  });

  const page3 = await prisma.page.create({
    data: {
      content: 'Vous avez pris le chemin de droite. Malheureusement, vous tombez dans un piège tendu par des bandits. 💀 C\'est la fin de votre aventure...',
      storyId: story.id,
      isEnd: true,
      order: 3,
    },
  });

  console.log('✅ Pages créées');

  // Définir la page de départ
  await prisma.story.update({
    where: { id: story.id },
    data: { startPageId: page1.id },
  });

  console.log('✅ Page de départ définie');

  // Créer les choix
  await prisma.choice.create({
    data: {
      text: 'Prendre le sentier éclairé (gauche)',
      pageId: page1.id,
      targetPageId: page2.id,
      order: 1,
    },
  });

  await prisma.choice.create({
    data: {
      text: 'Prendre le chemin sombre (droite)',
      pageId: page1.id,
      targetPageId: page3.id,
      order: 2,
    },
  });

  console.log('✅ Choix créés');

  // Créer une session de jeu de test
  await prisma.gameSession.create({
    data: {
      userId: reader.id,
      storyId: story.id,
      endPageId: page2.id,
    },
  });

  console.log('✅ Session de jeu créée');

  console.log('\n📝 Comptes de test créés :');
  console.log('   👑 Admin:   admin@nahb.com / password123');
  console.log('   ✍️  Auteur:  auteur@nahb.com / password123');
  console.log('   📖 Lecteur: lecteur@nahb.com / password123');
  console.log('\n🎮 Histoire de test : "L\'Aventure Fantastique"');
  console.log('   📄 3 pages : 1 départ + 2 fins');
  console.log('   🔀 2 choix disponibles');
  console.log('\n🌱 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });