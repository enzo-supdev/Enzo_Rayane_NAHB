import api from './api';

const storyService = {
  // Récupérer toutes les histoires publiées
  getPublishedStories: async (search = '') => {
    const response = await api.get('/stories', { params: { search } });
    return response.data;
  },

  // Récupérer mes histoires
  getMyStories: async () => {
    const response = await api.get('/stories/my/stories');
    return response.data;
  },

  // Récupérer une histoire par ID
  getStoryById: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  // Créer une histoire
  createStory: async (storyData) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  // Mettre à jour une histoire
  updateStory: async (id, storyData) => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  },

  // Supprimer une histoire
  deleteStory: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },

  // Publier une histoire
  publishStory: async (id) => {
    const response = await api.post(`/stories/${id}/publish`);
    return response.data;
  },
};

export default storyService;