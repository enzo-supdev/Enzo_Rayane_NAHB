import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const achievementService = {
  // Get all achievements
  getAllAchievements: async () => {
    const response = await axios.get(`${API_URL}/achievements/all`);
    return response.data;
  },

  // Get user's achievements with progress
  getMyAchievements: async (token) => {
    const response = await axios.get(`${API_URL}/achievements/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Seed achievements (admin only)
  seedAchievements: async (token) => {
    const response = await axios.post(
      `${API_URL}/achievements/seed`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default achievementService;
