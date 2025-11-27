const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentification requise' 
      });
    }

    // Normaliser les rôles en majuscules pour comparaison
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
    
    if (!normalizedAllowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès non autorisé' 
      });
    }

    next();
  };
};

module.exports = roleCheck;
