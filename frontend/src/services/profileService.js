import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const profileService = {
  // Get user profile
  getMyProfile: async (token) => {
    const response = await axios.get(`${API_URL}/profile/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get another user's profile
  getUserProfile: async (userId, token) => {
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update profile customization
  updateProfile: async (profileData, token) => {
    const response = await axios.put(
      `${API_URL}/profile/my`,
      profileData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (type = 'level', limit = 10) => {
    const response = await axios.get(`${API_URL}/profile/leaderboard`, {
      params: { type, limit }
    });
    return response.data;
  }
};

export default profileService;
