import api from './api';

const gameService = {
  // Démarrer une session de jeu
  startGame: async (storyId) => {
    const response = await api.post('/game/start', { storyId });
    return response.data;
  },

  // Faire un choix
  makeChoice: async (journeyId, choiceId) => {
    const response = await api.post('/game/choice', { journeyId, choiceId });
    return response.data;
  },

  // Récupérer mes sessions
  getMySessions: async (storyId = null) => {
    const params = storyId ? `?storyId=${storyId}` : '';
    const response = await api.get(`/game/sessions${params}`);
    return response.data;
  },

  // Récupérer une session par ID
  getSessionById: async (id) => {
    const response = await api.get(`/game/sessions/${id}`);
    return response.data;
  },

  // Récupérer les fins déverrouillées
  getUnlockedEndings: async (storyId) => {
    const response = await api.get(`/game/unlocked-endings/${storyId}`);
    return response.data;
  },
};

export default gameService;