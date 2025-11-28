import Comment from '../models/Comment.model.js';
import Story from '../models/Story.model.js';

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { content, rating } = req.body;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const comment = await Comment.create({
      story: storyId,
      author: req.user.id,
      content,
      rating: rating || null
    });

    await comment.populate('author', 'username avatar');

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a story
export const getStoryComments = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const comments = await Comment.find({ story: storyId })
      .populate('author', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Comment.countDocuments({ story: storyId });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// Update a comment
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('author', 'username avatar');

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle like on a comment
export const toggleLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const liked = comment.toggleLike(req.user.id);
    await comment.save();

    res.json({
      message: liked ? 'Comment liked' : 'Comment unliked',
      liked,
      likesCount: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};
