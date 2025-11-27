import Game from '../models/Game.model.js';
import Story from '../models/Story.model.js';
import Page from '../models/Page.model.js';
import Choice from '../models/Choice.model.js';
import { AppError, asyncHandler } from '../middlewares/error.middleware.js';
import { rollDice } from '../utils/dice.utils.js';

// @desc    Start a new game
// @route   POST /api/games/start
// @access  Private
export const startGame = asyncHandler(async (req, res, next) => {
  const { storyId, isPreview } = req.body;

  const story = await Story.findById(storyId).populate('startPage');

  if (!story) {
    return next(new AppError('Story not found', 404));
  }

  // Check if story is playable
  if (!story.isPlayable() && !isPreview) {
    return next(new AppError('Story is not available to play', 400));
  }

  // For preview mode, check if user is author
  if (isPreview && story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Only the author can preview their story', 403));
  }

  if (!story.startPage) {
    return next(new AppError('Story has no start page', 400));
  }

  const game = await Game.create({
    story: storyId,
    player: req.user._id,
    currentPage: story.startPage._id,
    isPreview: isPreview || false
  });

  // Add first step to path
  game.addStep(story.startPage._id);
  await game.save();

  // Increment play count (only for non-preview games)
  if (!isPreview) {
    story.totalPlays += 1;
    await story.save();
  }

  const populatedGame = await Game.findById(game._id)
    .populate('story', 'title description coverImage')
    .populate('currentPage');

  res.status(201).json({
    success: true,
    data: populatedGame
  });
});

// @desc    Make a choice in game
// @route   POST /api/games/:id/choose
// @access  Private
export const makeChoice = asyncHandler(async (req, res, next) => {
  const { choiceId, diceRoll } = req.body;

  const game = await Game.findById(req.params.id).populate('currentPage');

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  // Check ownership
  if (game.player.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to play this game', 403));
  }

  // Check if game is still in progress
  if (game.status !== 'in_progress') {
    return next(new AppError('Game is not in progress', 400));
  }

  const choice = await Choice.findById(choiceId).populate('targetPage');

  if (!choice) {
    return next(new AppError('Choice not found', 404));
  }

  // Verify choice belongs to current page
  if (choice.page.toString() !== game.currentPage._id.toString()) {
    return next(new AppError('Invalid choice for current page', 400));
  }

  // Handle dice roll if required
  let actualDiceRoll = diceRoll;
  if (choice.requiresDice) {
    if (!actualDiceRoll) {
      // Roll dice automatically if not provided
      actualDiceRoll = rollDice(choice.diceCondition.diceType);
    }

    // Check if dice roll succeeds
    if (!choice.checkDiceRoll(actualDiceRoll)) {
      return res.status(200).json({
        success: false,
        message: 'Dice roll failed',
        diceRoll: actualDiceRoll,
        required: choice.diceCondition
      });
    }
  }

  // Add step to path
  game.addStep(choice.targetPage._id, choiceId, actualDiceRoll);

  // Update choice statistics
  choice.timesChosen += 1;
  await choice.save();

  // Update page visited count
  const targetPage = choice.targetPage;
  targetPage.timesVisited += 1;

  // Check if reached ending
  if (targetPage.isEnding) {
    game.complete(targetPage._id);
    targetPage.timesCompleted += 1;

    // Update story stats (only for non-preview games)
    if (!game.isPreview) {
      const story = await Story.findById(game.story);
      story.totalCompletions += 1;
      await story.save();
    }
  }

  await targetPage.save();
  await game.save();

  const populatedGame = await Game.findById(game._id)
    .populate('currentPage')
    .populate({
      path: 'path.choice',
      select: 'text'
    });

  res.status(200).json({
    success: true,
    data: populatedGame,
    ...(actualDiceRoll && { diceRoll: actualDiceRoll })
  });
});

// @desc    Get game details
// @route   GET /api/games/:id
// @access  Private
export const getGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id)
    .populate('story', 'title description coverImage')
    .populate('currentPage')
    .populate('endingReached')
    .populate({
      path: 'path.page',
      select: 'title content'
    })
    .populate({
      path: 'path.choice',
      select: 'text'
    });

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  // Check ownership
  if (game.player.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this game', 403));
  }

  // Calculate path similarity if completed
  let pathSimilarity = null;
  if (game.status === 'completed') {
    pathSimilarity = await game.calculatePathSimilarity();
  }

  res.status(200).json({
    success: true,
    data: {
      ...game.toObject(),
      pathSimilarity
    }
  });
});

// @desc    Get user's games
// @route   GET /api/games/my/all
// @access  Private
export const getMyGames = asyncHandler(async (req, res, next) => {
  const { status, storyId } = req.query;

  let query = { player: req.user._id, isPreview: false };
  if (status) query.status = status;
  if (storyId) query.story = storyId;

  const games = await Game.find(query)
    .populate('story', 'title coverImage')
    .populate('endingReached', 'endingLabel endingType')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: games
  });
});

// @desc    Get user's endings for a story
// @route   GET /api/games/story/:storyId/endings
// @access  Private
export const getStoryEndings = asyncHandler(async (req, res, next) => {
  const games = await Game.find({
    story: req.params.storyId,
    player: req.user._id,
    status: 'completed',
    isPreview: false
  }).populate('endingReached', 'endingLabel endingType');

  // Get unique endings
  const uniqueEndings = [];
  const seenEndings = new Set();

  for (const game of games) {
    if (game.endingReached) {
      const endingId = game.endingReached._id.toString();
      if (!seenEndings.has(endingId)) {
        seenEndings.add(endingId);
        uniqueEndings.push(game.endingReached);
      }
    }
  }

  // Get all possible endings for the story
  const allEndings = await Page.find({
    story: req.params.storyId,
    isEnding: true
  }).select('endingLabel endingType');

  res.status(200).json({
    success: true,
    data: {
      unlockedEndings: uniqueEndings,
      totalEndings: allEndings.length,
      allEndings
    }
  });
});

// @desc    Roll dice
// @route   POST /api/games/dice/roll
// @access  Private
export const rollGameDice = asyncHandler(async (req, res, next) => {
  const { diceType } = req.body;

  const result = rollDice(diceType || 'd6');

  res.status(200).json({
    success: true,
    data: {
      diceType: diceType || 'd6',
      result
    }
  });
});
