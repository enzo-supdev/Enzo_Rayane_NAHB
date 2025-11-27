import api from './api';

const pageService = {
  // Get page details
  getPage: async (pageId) => {
    const response = await api.get(`/pages/${pageId}`);
    return response.data;
  },

  // Create page
  createPage: async (storyId, pageData) => {
    const response = await api.post('/pages', { ...pageData, story: storyId });
    return response.data;
  },

  // Update page
  updatePage: async (pageId, pageData) => {
    const response = await api.put(`/pages/${pageId}`, pageData);
    return response.data;
  },

  // Delete page
  deletePage: async (pageId) => {
    const response = await api.delete(`/pages/${pageId}`);
    return response.data;
  },

  // Upload page image
  uploadImage: async (pageId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/pages/${pageId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default pageService;
