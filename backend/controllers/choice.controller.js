import Choice from '../models/Choice.model.js';
import Page from '../models/Page.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';

// @desc    Create choice
// @route   POST /api/choices
// @access  Private (Author/Admin)
export const createChoice = asyncHandler(async (req, res, next) => {
  const { pageId, text, targetPage, requiresDice, diceCondition, orderIndex, description } = req.body;

  const page = await Page.findById(pageId).populate('story');
  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check ownership
  if (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to add choices to this page', 403));
  }

  // Check if page is an ending
  if (page.isEnding) {
    return next(new AppError('Cannot add choices to an ending page', 400));
  }

  // Verify target page exists and belongs to same story
  const target = await Page.findById(targetPage);
  if (!target || target.story.toString() !== page.story._id.toString()) {
    return next(new AppError('Invalid target page', 400));
  }

  const choice = await Choice.create({
    page: pageId,
    text,
    targetPage,
    requiresDice,
    diceCondition,
    orderIndex,
    description
  });

  // Add to page
  page.choices.push(choice._id);
  await page.save();

  res.status(201).json({
    success: true,
    data: choice
  });
});

// @desc    Update choice
// @route   PUT /api/choices/:id
// @access  Private (Author/Admin)
export const updateChoice = asyncHandler(async (req, res, next) => {
  let choice = await Choice.findById(req.params.id).populate({
    path: 'page',
    populate: { path: 'story' }
  });

  if (!choice) {
    return next(new AppError('Choice not found', 404));
  }

  // Check ownership
  if (choice.page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this choice', 403));
  }

  const { text, targetPage, requiresDice, diceCondition, orderIndex, description } = req.body;

  if (text) choice.text = text;
  if (targetPage) {
    // Verify target page
    const target = await Page.findById(targetPage);
    if (!target || target.story.toString() !== choice.page.story._id.toString()) {
      return next(new AppError('Invalid target page', 400));
    }
    choice.targetPage = targetPage;
  }
  if (requiresDice !== undefined) choice.requiresDice = requiresDice;
  if (diceCondition) choice.diceCondition = diceCondition;
  if (orderIndex !== undefined) choice.orderIndex = orderIndex;
  if (description !== undefined) choice.description = description;

  await choice.save();

  res.status(200).json({
    success: true,
    data: choice
  });
});

// @desc    Delete choice
// @route   DELETE /api/choices/:id
// @access  Private (Author/Admin)
export const deleteChoice = asyncHandler(async (req, res, next) => {
  const choice = await Choice.findById(req.params.id).populate({
    path: 'page',
    populate: { path: 'story' }
  });

  if (!choice) {
    return next(new AppError('Choice not found', 404));
  }

  // Check ownership
  if (choice.page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this choice', 403));
  }

  // Remove from page
  const page = await Page.findById(choice.page._id);
  page.choices = page.choices.filter(c => c.toString() !== choice._id.toString());
  await page.save();

  // Delete choice
  await choice.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Choice deleted successfully'
  });
});

// @desc    Get choices for a page
// @route   GET /api/choices/page/:pageId
// @access  Private/Public (depends on story)
export const getPageChoices = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId).populate('story');

  if (!page) {
    return next(new AppError('Page not found', 404));
  }

  // Check access
  if (page.story.status !== 'published' && 
      (!req.user || (page.story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
    return next(new AppError('Not authorized to view choices', 403));
  }

  const choices = await Choice.find({ page: req.params.pageId }).sort({ orderIndex: 1 });

  res.status(200).json({
    success: true,
    data: choices
  });
});
