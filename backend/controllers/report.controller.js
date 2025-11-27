import Report from '../models/Report.model.js';
import Story from '../models/Story.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';
import { paginate } from '../utils/query.utils.js';

// @desc    Create report
// @route   POST /api/reports
// @access  Private
export const createReport = asyncHandler(async (req, res, next) => {
  const { storyId, reason, description } = req.body;

  const story = await Story.findById(storyId);
  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check if user already reported this story
  const existingReport = await Report.findOne({
    story: storyId,
    reporter: req.user._id,
    status: 'pending'
  });

  if (existingReport) {
    return next(new AppError('You have already reported this story', 400));
  }

  const report = await Report.create({
    story: storyId,
    reporter: req.user._id,
    reason,
    description
  });

  res.status(201).json({
    success: true,
    data: report
  });
});

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
export const getReports = asyncHandler(async (req, res, next) => {
  const { status, page, limit } = req.query;

  let query = {};
  if (status) query.status = status;

  const result = await paginate(Report, query, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: 'story', select: 'title author' },
      { path: 'reporter', select: 'username' },
      { path: 'reviewedBy', select: 'username' }
    ]
  });

  res.status(200).json({
    success: true,
    data: result.results,
    pagination: result.pagination
  });
});

// @desc    Get reports for a story (Admin only)
// @route   GET /api/reports/story/:storyId
// @access  Private (Admin)
export const getStoryReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find({ story: req.params.storyId })
    .populate('reporter', 'username')
    .populate('reviewedBy', 'username')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: reports
  });
});

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
export const updateReport = asyncHandler(async (req, res, next) => {
  const { status, adminNote } = req.body;

  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError('Report not found', 404));
  }

  report.status = status;
  if (adminNote) report.adminNote = adminNote;
  report.reviewedBy = req.user._id;
  report.reviewedAt = Date.now();

  await report.save();

  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Get my reports
// @route   GET /api/reports/my/all
// @access  Private
export const getMyReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find({ reporter: req.user._id })
    .populate('story', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: reports
  });
});
