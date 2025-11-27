import Story from '../models/Story.model.js';
import Page from '../models/Page.model.js';
import Choice from '../models/Choice.model.js';
import Game from '../models/Game.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';
import { paginate, buildSearchQuery } from '../utils/query.utils.js';

// @desc    Get all published stories
// @route   GET /api/stories
// @access  Public
export const getStories = asyncHandler(async (req, res, next) => {
  const { search, theme, sort, page, limit } = req.query;

  // Build query
  let query = { status: 'published' };

  // Add search
  if (search) {
    const searchQuery = buildSearchQuery(search, ['title', 'description', 'tags']);
    query = { ...query, ...searchQuery };
  }

  // Add theme filter
  if (theme && theme !== 'all') {
    query.theme = theme;
  }

  // Sort options
  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { totalPlays: -1 };
  if (sort === 'rating') sortOption = { averageRating: -1 };

  // Paginate
  const result = await paginate(Story, query, {
    page,
    limit,
    sort: sortOption,
    populate: [{ path: 'author', select: 'username avatar' }]
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
export const getStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id)
    .populate('author', 'username avatar bio')
    .populate('startPage');

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Only show if published or user is author/admin
  if (story.status !== 'published' && 
      (!req.user || (story.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
    return next(new AppError('Story not found', 404));
  }

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Create story
// @route   POST /api/stories
// @access  Private (Author)
export const createStory = asyncHandler(async (req, res, next) => {
  const { title, description, theme, tags, difficulty, estimatedDuration } = req.body;

  const story = await Story.create({
    title,
    description,
    theme,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    difficulty,
    estimatedDuration,
    author: req.user._id,
    status: 'draft'
  });

  // Add to user's created stories
  req.user.createdStories.push(story._id);
  await req.user.save();

  res.status(201).json({
    success: true,
    data: story
  });
});

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private (Author/Admin)
export const updateStory = asyncHandler(async (req, res, next) => {
  let story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check ownership
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this story', 403));
  }

  const { title, description, theme, tags, status, difficulty, estimatedDuration, startPage } = req.body;

  // Update fields
  if (title) story.title = title;
  if (description) story.description = description;
  if (theme) story.theme = theme;
  if (tags) story.tags = tags.split(',').map(tag => tag.trim());
  if (difficulty) story.difficulty = difficulty;
  if (estimatedDuration) story.estimatedDuration = estimatedDuration;
  if (startPage) story.startPage = startPage;
  
  // Only allow status change if story has start page
  if (status && status === 'published') {
    if (!story.startPage) {
      return next(new AppError('Cannot publish story without a start page', 400));
    }
    story.status = status;
  } else if (status === 'draft') {
    story.status = status;
  }

  await story.save();

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private (Author/Admin)
export const deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check ownership
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this story', 403));
  }

  // Delete all pages and choices
  await Page.deleteMany({ story: story._id });
  await Choice.deleteMany({ page: { $in: story.pages } });

  // Delete story
  await story.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Story deleted successfully'
  });
});

// @desc    Get my stories
// @route   GET /api/stories/my/all
// @access  Private (Author)
export const getMyStories = asyncHandler(async (req, res, next) => {
  const { page, limit, status } = req.query;

  let query = { author: req.user._id };
  if (status) query.status = status;

  const result = await paginate(Story, query, {
    page,
    limit,
    sort: { updatedAt: -1 }
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Get story pages
// @route   GET /api/stories/:id/pages
// @access  Private (Author/Admin) or Public if published
export const getStoryPages = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check access
  if (story.status !== 'published' && 
      (!req.user || (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
    return next(new AppError('Not authorized to view story pages', 403));
  }

  const pages = await Page.find({ story: story._id })
    .populate('choices')
    .sort({ orderIndex: 1 });

  res.status(200).json({
    success: true,
    data: pages
  });
});

// @desc    Upload story cover
// @route   POST /api/stories/:id/cover
// @access  Private (Author/Admin)
export const uploadCover = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check ownership
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this story', 403));
  }

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  story.coverImage = `/uploads/${req.file.filename}`;
  await story.save();

  res.status(200).json({
    success: true,
    data: { coverImage: story.coverImage }
  });
});
