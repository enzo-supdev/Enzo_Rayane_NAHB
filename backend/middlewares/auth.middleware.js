import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { AppError } from './error.middleware.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new AppError('User not found', 404));
      }

      // Check if user is banned
      if (req.user.isBanned) {
        return next(new AppError('Your account has been banned', 403));
      }

      next();
    } catch (error) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Alias for restrictTo (single role check)
export const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Check if user is author (can create stories)
export const isAuthor = (req, res, next) => {
  if (!req.user.canCreateStories()) {
    return next(new AppError('You must be an author to perform this action', 403));
  }
  next();
};

// Check if user owns the resource
export const checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id || req.params.storyId;
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return next(new AppError('Resource not found', 404));
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      const ownerId = resource.author || resource.user || resource.player;
      if (ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to access this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        // Check if user is banned
        if (req.user && req.user.isBanned) {
          req.user = null; // Clear user if banned
        }
      } catch (error) {
        // Token invalid, but we don't fail - just continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
