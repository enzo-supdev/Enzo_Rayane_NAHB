import Page from '../models/Page.model.js';
import Story from '../models/Story.model.js';
import Choice from '../models/Choice.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';

// @desc    Get page by ID
// @route   GET /api/pages/:id
// @access  Private/Public (depends on story status)
export const getPage = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id)
    .populate('choices')
    .populate('story', 'title status author');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check access
  const story = page.story;
  if (story.status !== 'published' && 
      (!req.user || (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
    return next(new AppError('Not authorized to view this page', 403));
  }

  res.status(200).json({
    success: true,
    data: page
  });
});

// @desc    Create page
// @route   POST /api/pages
// @access  Private (Author/Admin)
export const createPage = asyncHandler(async (req, res, next) => {
  const { storyId, title, content, isEnding, endingLabel, endingType, orderIndex } = req.body;

  const story = await Story.findById(storyId);
  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check ownership
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to add pages to this story', 403));
  }

  const page = await Page.create({
    story: storyId,
    title,
    content,
    isEnding,
    endingLabel,
    endingType,
    orderIndex
  });

  // Add page to story
  story.pages.push(page._id);

  // Set as start page if it's the first page
  if (story.pages.length === 1 && !story.startPage) {
    story.startPage = page._id;
  }

  await story.save();

  res.status(201).json({
    success: true,
    data: page
  });
});

// @desc    Update page
// @route   PUT /api/pages/:id
// @access  Private (Author/Admin)
export const updatePage = asyncHandler(async (req, res, next) => {
  let page = await Page.findById(req.params.id).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this page', 403));
  }

  const { title, content, isEnding, endingLabel, endingType, orderIndex } = req.body;

  if (title !== undefined) page.title = title;
  if (content) page.content = content;
  if (isEnding !== undefined) page.isEnding = isEnding;
  if (endingLabel !== undefined) page.endingLabel = endingLabel;
  if (endingType !== undefined) page.endingType = endingType;
  if (orderIndex !== undefined) page.orderIndex = orderIndex;

  await page.save();

  res.status(200).json({
    success: true,
    data: page
  });
});

// @desc    Delete page
// @route   DELETE /api/pages/:id
// @access  Private (Author/Admin)
export const deletePage = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this page', 403));
  }

  // Remove from story
  const story = await Story.findById(page.story._id);
  story.pages = story.pages.filter(p => p.toString() !== page._id.toString());
  
  // Reset start page if this was it
  if (story.startPage && story.startPage.toString() === page._id.toString()) {
    story.startPage = null;
  }

  await story.save();

  // Delete associated choices
  await Choice.deleteMany({ page: page._id });

  // Delete page
  await page.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Page deleted successfully'
  });
});

// @desc    Upload page image
// @route   POST /api/pages/:id/image
// @access  Private (Author/Admin)
export const uploadPageImage = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this page', 403));
  }

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  page.image = `/uploads/${req.file.filename}`;
  await page.save();

  res.status(200).json({
    success: true,
    data: { image: page.image }
  });
});

// @desc    Add interactive zone to page
// @route   POST /api/pages/:id/zones
// @access  Private (Author/Admin)
export const addInteractiveZone = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this page', 403));
  }

  const { x, y, width, height, shape, targetPage, description } = req.body;

  page.interactiveZones.push({
    x,
    y,
    width,
    height,
    shape,
    targetPage,
    description
  });

  await page.save();

  res.status(201).json({
    success: true,
    data: page
  });
});

// @desc    Remove interactive zone
// @route   DELETE /api/pages/:id/zones/:zoneId
// @access  Private (Author/Admin)
export const removeInteractiveZone = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this page', 403));
  }

  page.interactiveZones = page.interactiveZones.filter(
    zone => zone._id.toString() !== req.params.zoneId
  );

  await page.save();

  res.status(200).json({
    success: true,
    data: page
  });
});
