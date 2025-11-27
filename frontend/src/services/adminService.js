import api from './api';

const adminService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Ban user
  banUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/ban`);
    return response.data;
  },

  // Unban user
  unbanUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unban`);
    return response.data;
  },

  // Promote to author
  promoteToAuthor: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/promote`);
    return response.data;
  },

  // Get all stories (including drafts)
  getAllStories: async () => {
    const response = await api.get('/admin/stories');
    return response.data;
  },

  // Suspend story
  suspendStory: async (storyId) => {
    const response = await api.put(`/admin/stories/${storyId}/suspend`);
    return response.data;
  },

  // Unsuspend story
  unsuspendStory: async (storyId) => {
    const response = await api.put(`/admin/stories/${storyId}/unsuspend`);
    return response.data;
  },

  // Delete story
  deleteStory: async (storyId) => {
    const response = await api.delete(`/admin/stories/${storyId}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default adminService;
