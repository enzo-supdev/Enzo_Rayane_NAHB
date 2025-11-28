import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const libraryService = {
  // Get user's library
  getMyLibrary: async (token) => {
    const response = await axios.get(`${API_URL}/library`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (storyId, token) => {
    const response = await axios.post(
      `${API_URL}/library/favorites/${storyId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Check if story is favorite
  checkFavorite: async (storyId, token) => {
    const response = await axios.get(
      `${API_URL}/library/favorites/${storyId}/check`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Create reading list
  createReadingList: async (listData, token) => {
    const response = await axios.post(
      `${API_URL}/library/lists`,
      listData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Add story to reading list
  addToReadingList: async (listId, storyId, token) => {
    const response = await axios.post(
      `${API_URL}/library/lists/${listId}/stories/${storyId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Remove story from reading list
  removeFromReadingList: async (listId, storyId, token) => {
    const response = await axios.delete(
      `${API_URL}/library/lists/${listId}/stories/${storyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete reading list
  deleteReadingList: async (listId, token) => {
    const response = await axios.delete(
      `${API_URL}/library/lists/${listId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default libraryService;
