import api from './api';

const gameService = {
  // Start a new game
  startGame: async (storyId) => {
    const response = await api.post('/games/start', { storyId });
    return response.data;
  },

  // Make a choice
  makeChoice: async (gameId, choiceId) => {
    const response = await api.post(`/games/${gameId}/choose`, { choiceId });
    return response.data;
  },

  // Get game state
  getGame: async (gameId) => {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  },

  // Get my games
  getMyGames: async () => {
    const response = await api.get('/games/my/all');
    return response.data;
  },

  // Roll dice
  rollDice: async (gameId, diceType) => {
    const response = await api.post('/games/dice/roll', { gameId, diceType });
    return response.data;
  },
};

export default gameService;
