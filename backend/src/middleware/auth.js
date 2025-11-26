const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentification requise' 
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Vérifier si l'utilisateur est banni
    if (user.isBanned) {
      return res.status(403).json({ 
        message: 'Votre compte a été banni' 
      });
    }

    // Ajouter l'ID de l'utilisateur à la requête
    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(401).json({ 
      message: 'Token invalide' 
    });
  }
};

module.exports = auth;
