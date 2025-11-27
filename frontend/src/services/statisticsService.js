import api from './api';

const statisticsService = {
  // Get story statistics
  getStoryStatistics: async (storyId) => {
    const response = await api.get(`/statistics/story/${storyId}`);
    return response.data;
  },

  // Get author statistics
  getAuthorStatistics: async (authorId) => {
    const response = await api.get(`/statistics/author/${authorId}`);
    return response.data;
  },

  // Get global statistics (admin)
  getGlobalStatistics: async () => {
    const response = await api.get('/statistics/global');
    return response.data;
  },
};

export default statisticsService;
