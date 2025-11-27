import User from '../models/User.model.js';
import Story from '../models/Story.model.js';
import Report from '../models/Report.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';
import { paginate } from '../utils/query.utils.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { role, isBanned, search, page, limit } = req.query;

  let query = {};
  if (role) query.role = role;
  if (isBanned !== undefined) query.isBanned = isBanned === 'true';
  if (search) {
    query.$or = [
      { username: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  const result = await paginate(User, query, {
    page,
    limit,
    sort: { createdAt: -1 }
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin)
export const banUser = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === 'admin') {
    return next(new AppError('Cannot ban admin users', 400));
  }

  if (user.isBanned) {
    return next(new AppError('User is already banned', 400));
  }

  user.isBanned = true;
  user.banReason = reason || 'Violation of terms of service';
  user.bannedAt = Date.now();

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User banned successfully',
    data: user
  });
});

// @desc    Unban user
// @route   PUT /api/admin/users/:id/unban
// @access  Private (Admin)
export const unbanUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!user.isBanned) {
    return next(new AppError('User is not banned', 400));
  }

  user.isBanned = false;
  user.banReason = null;
  user.bannedAt = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User unbanned successfully',
    data: user
  });
});

// @desc    Promote user to author
// @route   PUT /api/admin/users/:id/promote
// @access  Private (Admin)
export const promoteToAuthor = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === 'author' || user.role === 'admin') {
    return next(new AppError('User is already an author or admin', 400));
  }

  user.role = 'author';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User promoted to author',
    data: user
  });
});

// @desc    Get all stories (including drafts)
// @route   GET /api/admin/stories
// @access  Private (Admin)
export const getAllStories = asyncHandler(async (req, res, next) => {
  const { status, theme, page, limit } = req.query;

  let query = {};
  if (status) query.status = status;
  if (theme) query.theme = theme;

  const result = await paginate(Story, query, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'author', select: 'username email' }]
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Suspend story
// @route   PUT /api/admin/stories/:id/suspend
// @access  Private (Admin)
export const suspendStory = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  if (story.status === 'suspended') {
    return next(new AppError('Story is already suspended', 400));
  }

  story.status = 'suspended';
  story.suspendReason = reason || 'Violation of content policy';
  story.suspendedAt = Date.now();

  await story.save();

  res.status(200).json({
    success: true,
    message: 'Story suspended successfully',
    data: story
  });
});

// @desc    Unsuspend story
// @route   PUT /api/admin/stories/:id/unsuspend
// @access  Private (Admin)
export const unsuspendStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  if (story.status !== 'suspended') {
    return next(new AppError('Story is not suspended', 400));
  }

  story.status = 'draft';
  story.suspendReason = null;
  story.suspendedAt = null;

  await story.save();

  res.status(200).json({
    success: true,
    message: 'Story unsuspended successfully',
    data: story
  });
});

// @desc    Delete story (Admin)
// @route   DELETE /api/admin/stories/:id
// @access  Private (Admin)
export const deleteStoryAdmin = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Delete all associated data
  await Page.deleteMany({ story: story._id });
  await Choice.deleteMany({ page: { $in: story.pages } });
  await story.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Story deleted successfully'
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const bannedUsers = await User.countDocuments({ isBanned: true });
  const totalStories = await Story.countDocuments();
  const suspendedStories = await Story.countDocuments({ status: 'suspended' });
  const pendingReports = await Report.countDocuments({ status: 'pending' });

  // Recent users (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  // Recent stories (last 7 days)
  const recentStories = await Story.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        banned: bannedUsers,
        recent: recentUsers
      },
      stories: {
        total: totalStories,
        suspended: suspendedStories,
        recent: recentStories
      },
      reports: {
        pending: pendingReports
      }
    }
  });
});
