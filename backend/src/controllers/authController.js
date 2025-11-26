const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { pseudo, email, password, role } = req.body;

    // Validation basique
    if (!pseudo || !email || !password) {
      return res.status(400).json({
        message: 'pseudo, email et password sont requis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { pseudo }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Cet email ou pseudo est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        pseudo,
        email,
        password: hashedPassword,
        role: role?.toUpperCase() || 'READER'
      }
    });

    // Générer le token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'email et password sont requis'
      });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si banni
    if (user.isBanned) {
      return res.status(403).json({
        message: 'Votre compte a été banni'
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};