import Library from '../models/Library.model.js';
import Story from '../models/Story.model.js';
import Game from '../models/Game.model.js';

// Get user library
export const getUserLibrary = async (req, res) => {
  try {
    const userId = req.user._id;

    let library = await Library.findOne({ user: userId })
      .populate({
        path: 'favorites.story',
        select: 'title description coverImage author tags theme averageRating ratingsCount'
      })
      .populate({
        path: 'inProgress.story',
        select: 'title description coverImage author tags theme'
      })
      .populate({
        path: 'inProgress.currentPage',
        select: 'content'
      })
      .populate({
        path: 'completed.story',
        select: 'title description coverImage author tags theme averageRating'
      })
      .populate({
        path: 'readingLists.stories',
        select: 'title coverImage author theme'
      });

    if (!library) {
      library = await Library.create({ user: userId });
    }

    res.status(200).json({
      success: true,
      library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching library',
      error: error.message
    });
  }
};

// Toggle favorite
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storyId } = req.params;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    let library = await Library.findOne({ user: userId });

    if (!library) {
      library = await Library.create({ user: userId });
    }

    const isFavorite = library.isFavorite(storyId);

    if (isFavorite) {
      library.removeFavorite(storyId);
    } else {
      library.addFavorite(storyId);
    }

    await library.save();
    await library.populate({
      path: 'favorites.story',
      select: 'title description coverImage author tags theme averageRating ratingsCount'
    });

    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite,
      favorites: library.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling favorite',
      error: error.message
    });
  }
};

// Check if story is favorite
export const checkFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storyId } = req.params;

    const library = await Library.findOne({ user: userId });

    const isFavorite = library ? library.isFavorite(storyId) : false;

    res.status(200).json({
      success: true,
      isFavorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking favorite',
      error: error.message
    });
  }
};

// Update reading progress (called during gameplay)
export const updateProgress = async (userId, storyId, gameId, currentPageId, progressPercent) => {
  try {
    let library = await Library.findOne({ user: userId });

    if (!library) {
      library = await Library.create({ user: userId });
    }

    library.updateProgress(storyId, gameId, currentPageId, progressPercent);
    await library.save();

    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

// Mark story as completed
export const markCompleted = async (userId, storyId, gameId, endingReached, readingTime = 0, rating = null) => {
  try {
    let library = await Library.findOne({ user: userId });

    if (!library) {
      library = await Library.create({ user: userId });
    }

    library.markCompleted(storyId, gameId, endingReached, readingTime, rating);
    await library.save();

    return { success: true };
  } catch (error) {
    console.error('Error marking completed:', error);
    return { success: false, error: error.message };
  }
};

// Create reading list
export const createReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description, isPublic } = req.body;

    let library = await Library.findOne({ user: userId });

    if (!library) {
      library = await Library.create({ user: userId });
    }

    library.readingLists.push({
      name,
      description: description || '',
      isPublic: isPublic || false,
      stories: [],
      createdAt: new Date()
    });

    await library.save();

    res.status(201).json({
      success: true,
      message: 'Reading list created',
      readingList: library.readingLists[library.readingLists.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating reading list',
      error: error.message
    });
  }
};

// Add story to reading list
export const addToReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listId, storyId } = req.params;

    const library = await Library.findOne({ user: userId });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    const readingList = library.readingLists.id(listId);

    if (!readingList) {
      return res.status(404).json({
        success: false,
        message: 'Reading list not found'
      });
    }

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if already in list
    if (!readingList.stories.includes(storyId)) {
      readingList.stories.push(storyId);
      await library.save();
      await library.populate({
        path: 'readingLists.stories',
        select: 'title coverImage author theme'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Story added to reading list',
      readingList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to reading list',
      error: error.message
    });
  }
};

// Remove story from reading list
export const removeFromReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listId, storyId } = req.params;

    const library = await Library.findOne({ user: userId });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    const readingList = library.readingLists.id(listId);

    if (!readingList) {
      return res.status(404).json({
        success: false,
        message: 'Reading list not found'
      });
    }

    readingList.stories = readingList.stories.filter(
      id => id.toString() !== storyId
    );

    await library.save();

    res.status(200).json({
      success: true,
      message: 'Story removed from reading list',
      readingList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from reading list',
      error: error.message
    });
  }
};

// Delete reading list
export const deleteReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listId } = req.params;

    const library = await Library.findOne({ user: userId });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    library.readingLists = library.readingLists.filter(
      list => list._id.toString() !== listId
    );

    await library.save();

    res.status(200).json({
      success: true,
      message: 'Reading list deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reading list',
      error: error.message
    });
  }
};

export default {
  getUserLibrary,
  toggleFavorite,
  checkFavorite,
  updateProgress,
  markCompleted,
  createReadingList,
  addToReadingList,
  removeFromReadingList,
  deleteReadingList
};
