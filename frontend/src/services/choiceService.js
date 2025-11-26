import api from './api';

const choiceService = {
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

export default choiceService;