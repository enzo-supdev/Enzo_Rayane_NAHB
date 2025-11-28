import api from './api';

const commentService = {
  // Create a new comment
  createComment: async (storyId, commentData) => {
    const response = await api.post(`/stories/${storyId}/comments`, commentData);
    return response.data;
  },

  // Get comments for a story
  getStoryComments: async (storyId, page = 1, limit = 10) => {
    const response = await api.get(`/stories/${storyId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Toggle like on a comment
  toggleLike: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  }
};

export default commentService;
