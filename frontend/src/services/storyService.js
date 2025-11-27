import api from './api';

const storyService = {
  // Get all published stories
  getStories: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/stories?${params}`);
    return response.data;
  },

  // Get single story
  getStory: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  // Create story
  createStory: async (storyData) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  // Update story
  updateStory: async (id, storyData) => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  },

  // Delete story
  deleteStory: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },

  // Get my stories (author)
  getMyStories: async () => {
    const response = await api.get('/stories/my/all');
    return response.data;
  },

  // Upload cover image
  uploadCover: async (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/stories/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default storyService;
