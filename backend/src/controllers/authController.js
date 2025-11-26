const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { pseudo, email, password, role } = req.body;

    // Validation basique
    if (!pseudo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Pseudo, email et mot de passe requis'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { pseudo: pseudo }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? 'Cet email est déjà utilisé' 
          : 'Ce pseudo est déjà pris'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        pseudo,
        email,
        password: hashedPassword,
        role: role ? role.toUpperCase() : 'READER', // Par défaut: READER
        status: 'active'
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

/**
 * Connexion d'un utilisateur
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'utilisateur est banni
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été banni. Contactez l\'administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourner les infos sans le password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user est ajouté par le middleware auth
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        status: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            stories: true,
            gameSessions: true,
            ratings: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

/**
 * Mettre à jour le profil
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { pseudo, bio, avatarUrl } = req.body;
    
    // Si pseudo changé, vérifier qu'il n'existe pas déjà
    if (pseudo) {
      const existingUser = await prisma.user.findFirst({
        where: {
          pseudo,
          NOT: {
            id: req.user.userId
          }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Ce pseudo est déjà pris'
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(pseudo && { pseudo }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl })
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};