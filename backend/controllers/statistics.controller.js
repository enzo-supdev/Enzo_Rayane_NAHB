import Story from '../models/Story.model.js';
import Game from '../models/Game.model.js';
import Page from '../models/Page.model.js';
import Choice from '../models/Choice.model.js';
import User from '../models/User.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';

// @desc    Get story statistics
// @route   GET /api/statistics/story/:storyId
// @access  Private (Author/Admin)
export const getStoryStatistics = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.storyId);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check authorization
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view these statistics', 403));
  }

  // Get completion stats
  const games = await Game.find({
    story: story._id,
    isPreview: false
  });

  const completedGames = games.filter(g => g.status === 'completed');
  const inProgressGames = games.filter(g => g.status === 'in_progress');
  const abandonedGames = games.filter(g => g.status === 'abandoned');

  // Get ending distribution
  const endingDistribution = {};
  const endings = await Page.find({
    story: story._id,
    isEnding: true
  });

  for (const ending of endings) {
    const count = completedGames.filter(
      g => g.endingReached && g.endingReached.toString() === ending._id.toString()
    ).length;
    
    endingDistribution[ending.endingLabel || ending._id] = {
      label: ending.endingLabel,
      type: ending.endingType,
      count,
      percentage: completedGames.length > 0 ? (count / completedGames.length * 100).toFixed(2) : 0
    };
  }

  // Get most visited pages
  const pages = await Page.find({ story: story._id })
    .sort({ timesVisited: -1 })
    .limit(5)
    .select('title timesVisited');

  // Get most chosen choices
  const popularChoices = await Choice.find({
    page: { $in: story.pages }
  })
    .sort({ timesChosen: -1 })
    .limit(5)
    .populate('page', 'title')
    .select('text timesChosen');

  // Calculate average completion time
  const avgDuration = completedGames.length > 0
    ? completedGames.reduce((sum, g) => sum + g.duration, 0) / completedGames.length
    : 0;

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalPlays: story.totalPlays,
        totalCompletions: story.totalCompletions,
        completionRate: story.totalPlays > 0 ? ((story.totalCompletions / story.totalPlays) * 100).toFixed(2) : 0,
        averageRating: story.averageRating.toFixed(2),
        totalRatings: story.totalRatings,
        averageDuration: Math.round(avgDuration / 60) // in minutes
      },
      gameStatus: {
        completed: completedGames.length,
        inProgress: inProgressGames.length,
        abandoned: abandonedGames.length
      },
      endings: endingDistribution,
      popularPages: pages,
      popularChoices: popularChoices
    }
  });
});

// @desc    Get author statistics
// @route   GET /api/statistics/author/:authorId
// @access  Private (Author/Admin)
export const getAuthorStatistics = asyncHandler(async (req, res, next) => {
  const authorId = req.params.authorId;

  // Check authorization
  if (authorId !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view these statistics', 403));
  }

  const author = await User.findById(authorId);
  if (!author) {
    return next(new AppError('Author not found', 404));
  }

  // Get all stories by author
  const stories = await Story.find({ author: authorId });

  const totalStories = stories.length;
  const publishedStories = stories.filter(s => s.status === 'published').length;
  const draftStories = stories.filter(s => s.status === 'draft').length;

  // Aggregate stats
  const totalPlays = stories.reduce((sum, s) => sum + s.totalPlays, 0);
  const totalCompletions = stories.reduce((sum, s) => sum + s.totalCompletions, 0);
  const totalRatings = stories.reduce((sum, s) => sum + s.totalRatings, 0);
  const averageRating = totalRatings > 0
    ? stories.reduce((sum, s) => sum + (s.averageRating * s.totalRatings), 0) / totalRatings
    : 0;

  // Get most popular story
  const mostPopular = stories.sort((a, b) => b.totalPlays - a.totalPlays)[0];

  // Get best rated story
  const bestRated = stories
    .filter(s => s.totalRatings > 0)
    .sort((a, b) => b.averageRating - a.averageRating)[0];

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalStories,
        publishedStories,
        draftStories,
        totalPlays,
        totalCompletions,
        totalRatings,
        averageRating: averageRating.toFixed(2)
      },
      mostPopular: mostPopular ? {
        id: mostPopular._id,
        title: mostPopular.title,
        plays: mostPopular.totalPlays
      } : null,
      bestRated: bestRated ? {
        id: bestRated._id,
        title: bestRated.title,
        rating: bestRated.averageRating.toFixed(2),
        totalRatings: bestRated.totalRatings
      } : null
    }
  });
});

// @desc    Get global statistics (Admin only)
// @route   GET /api/statistics/global
// @access  Private (Admin)
export const getGlobalStatistics = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalAuthors = await User.countDocuments({ role: 'author' });
  const totalReaders = await User.countDocuments({ role: 'reader' });
  const bannedUsers = await User.countDocuments({ isBanned: true });

  const totalStories = await Story.countDocuments();
  const publishedStories = await Story.countDocuments({ status: 'published' });
  const draftStories = await Story.countDocuments({ status: 'draft' });
  const suspendedStories = await Story.countDocuments({ status: 'suspended' });

  const totalGames = await Game.countDocuments({ isPreview: false });
  const completedGames = await Game.countDocuments({ status: 'completed', isPreview: false });
  const inProgressGames = await Game.countDocuments({ status: 'in_progress', isPreview: false });

  // Get most popular stories
  const popularStories = await Story.find({ status: 'published' })
    .sort({ totalPlays: -1 })
    .limit(5)
    .populate('author', 'username')
    .select('title totalPlays averageRating');

  // Get most active authors
  const authors = await User.find({ role: 'author' });
  const authorStats = await Promise.all(
    authors.map(async (author) => {
      const storyCount = await Story.countDocuments({ author: author._id, status: 'published' });
      const stories = await Story.find({ author: author._id });
      const totalPlays = stories.reduce((sum, s) => sum + s.totalPlays, 0);
      
      return {
        id: author._id,
        username: author.username,
        storyCount,
        totalPlays
      };
    })
  );

  const topAuthors = authorStats
    .filter(a => a.storyCount > 0)
    .sort((a, b) => b.totalPlays - a.totalPlays)
    .slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        authors: totalAuthors,
        readers: totalReaders,
        banned: bannedUsers
      },
      stories: {
        total: totalStories,
        published: publishedStories,
        draft: draftStories,
        suspended: suspendedStories
      },
      games: {
        total: totalGames,
        completed: completedGames,
        inProgress: inProgressGames,
        completionRate: totalGames > 0 ? ((completedGames / totalGames) * 100).toFixed(2) : 0
      },
      popularStories,
      topAuthors
    }
  });
});

// @desc    Get page path statistics
// @route   GET /api/statistics/story/:storyId/paths
// @access  Private (Author/Admin)
export const getPathStatistics = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.storyId);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check authorization
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view these statistics', 403));
  }

  const games = await Game.find({
    story: story._id,
    status: 'completed',
    isPreview: false
  });

  // Build path frequency map
  const pathMap = new Map();

  for (const game of games) {
    const pathKey = game.path.map(step => step.page.toString()).join('->');
    pathMap.set(pathKey, (pathMap.get(pathKey) || 0) + 1);
  }

  // Convert to array and sort
  const pathFrequencies = Array.from(pathMap.entries())
    .map(([path, count]) => ({
      path: path.split('->'),
      count,
      percentage: games.length > 0 ? ((count / games.length) * 100).toFixed(2) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.status(200).json({
    success: true,
    data: {
      totalCompletedGames: games.length,
      commonPaths: pathFrequencies
    }
  });
});
