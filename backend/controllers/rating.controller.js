import Rating from '../models/Rating.model.js';
import Story from '../models/Story.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';
import { paginate } from '../utils/query.utils.js';
import { addXP, updateStats } from './profile.controller.js';
import { checkAchievements } from './achievement.controller.js';

// @desc    Create or update rating
// @route   POST /api/ratings
// @access  Private
export const createOrUpdateRating = asyncHandler(async (req, res, next) => {
  const { storyId, rating, comment } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  const story = await Story.findById(storyId);
  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check if rating already exists
  let existingRating = await Rating.findOne({
    story: storyId,
    user: req.user._id
  });

  if (existingRating) {
    // Update existing rating
    const oldRating = existingRating.rating;
    existingRating.rating = rating;
    existingRating.comment = comment;
    await existingRating.save();

    // Update story average
    const totalScore = (story.averageRating * story.totalRatings) - oldRating + rating;
    story.averageRating = totalScore / story.totalRatings;
    await story.save();

    return res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: existingRating
    });
  }

  // Create new rating
  const newRating = await Rating.create({
    story: storyId,
    user: req.user._id,
    rating,
    comment
  });

  // Update story rating
  await story.updateRating(rating);
  
  // Add XP and update stats
  await addXP(req.user._id, 10, 'Rated a story');
  await updateStats(req.user._id, { ratingsGiven: 1 });
  await checkAchievements(req.user._id);

  res.status(201).json({
    success: true,
    data: newRating
  });
});

// @desc    Get ratings for a story
// @route   GET /api/ratings/story/:storyId
// @access  Public
export const getStoryRatings = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  const result = await paginate(Rating, { story: req.params.storyId }, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'user', select: 'username avatar' }]
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Get user's rating for a story
// @route   GET /api/ratings/story/:storyId/mine
// @access  Private
export const getMyRating = asyncHandler(async (req, res, next) => {
  const rating = await Rating.findOne({
    story: req.params.storyId,
    user: req.user._id
  });

  res.status(200).json({
    success: true,
    data: rating
  });
});

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
export const deleteRating = asyncHandler(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return next(new AppError('Rating not found', 404));
  }

  // Check ownership
  if (rating.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this rating', 403));
  }

  // Update story rating
  const story = await Story.findById(rating.story);
  if (story && story.totalRatings > 0) {
    const totalScore = (story.averageRating * story.totalRatings) - rating.rating;
    story.totalRatings -= 1;
    story.averageRating = story.totalRatings > 0 ? totalScore / story.totalRatings : 0;
    await story.save();
  }

  await rating.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Rating deleted successfully'
  });
});
