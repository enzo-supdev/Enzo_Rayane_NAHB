import api from './api';

const gameService = {
  // Démarrer une partie
  startGame: async (storyId) => {
    const response = await api.post('/game/start', { storyId });
    return response.data;
  },

  // Faire un choix
  makeChoice: async (choiceId) => {
    const response = await api.post('/game/choice', { choiceId });
    return response.data;
  },

  // Récupérer les statistiques d'une histoire
  getStoryStats: async (storyId) => {
    const response = await api.get(`/game/stats/${storyId}`);
    return response.data;
  },

  // Récupérer l'historique de jeu
  getUserGameHistory: async () => {
    const response = await api.get('/game/history');
    return response.data;
  },
};

export default gameService;