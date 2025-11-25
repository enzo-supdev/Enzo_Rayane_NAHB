import api from './api';

const pageService = {
  // Récupérer les pages d'une histoire
  getPagesByStory: async (storyId) => {
    const response = await api.get(`/pages/story/${storyId}`);
    return response.data;
  },

  // Récupérer une page par ID avec ses choix
  getPageById: async (id) => {
    const response = await api.get(`/pages/${id}`);
    return response.data;
  },

  // Créer une page
  createPage: async (pageData) => {
    const response = await api.post('/pages', pageData);
    return response.data;
  },

  // Mettre à jour une page
  updatePage: async (id, pageData) => {
    const response = await api.put(`/pages/${id}`, pageData);
    return response.data;
  },

  // Supprimer une page
  deletePage: async (id) => {
    const response = await api.delete(`/pages/${id}`);
    return response.data;
  },

  // Créer un choix
  createChoice: async (choiceData) => {
    const response = await api.post('/choices', choiceData);
    return response.data;
  },

  // Mettre à jour un choix
  updateChoice: async (id, choiceData) => {
    const response = await api.put(`/choices/${id}`, choiceData);
    return response.data;
  },

  // Supprimer un choix
  deleteChoice: async (id) => {
    const response = await api.delete(`/choices/${id}`);
    return response.data;
  },
};

export default pageService;