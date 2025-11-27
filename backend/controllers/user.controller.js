import User from '../models/User.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate({
      path: 'createdStories',
      match: { status: 'published' },
      select: 'title description coverImage averageRating totalPlays'
    });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { username, bio } = req.body;

  const user = await User.findById(req.user._id);

  if (username && username !== user.username) {
    // Check if username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new AppError('Username already taken', 400));
    }
    user.username = username;
  }

  if (bio !== undefined) user.bio = bio;

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  const user = await User.findById(req.user._id);
  user.avatar = `/uploads/${req.file.filename}`;
  await user.save();

  res.status(200).json({
    success: true,
    data: { avatar: user.avatar }
  });
});
