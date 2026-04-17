import axios from 'axios';

// =============================================
//  Axios Instance with JWT Interceptor
// =============================================

const API = axios.create({
  baseURL: '',
  timeout: 10000,
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('neonpulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neonpulse_token');
      localStorage.removeItem('neonpulse_user');
    }
    return Promise.reject(error);
  }
);

// =============================================
//  Fallback Mock Data
// =============================================

const fallbackMockData = [
  {
    id: 'track-1',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    genres: ['Bollywood', 'Sad'],
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'track-2',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman',
    genres: ['Bollywood', 'Sufi'],
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'track-3',
    title: 'Chak De India',
    artist: 'Sukhwinder Singh',
    genres: ['Bollywood', 'Energetic'],
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

// =============================================
//  AUTH API
// =============================================

export const authAPI = {
  register: async (name, email, password) => {
    const res = await API.post('/api/auth/register', { name, email, password });
    return res.data;
  },

  login: async (email, password) => {
    const res = await API.post('/api/auth/login', { email, password });
    return res.data;
  },

  getProfile: async () => {
    const res = await API.get('/api/auth/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await API.put('/api/auth/profile', data);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await API.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await API.post(`/api/auth/reset-password/${token}`, { password });
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await API.post('/api/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};

// =============================================
//  DASHBOARD API
// =============================================

export const dashboardAPI = {
  getDashboard: async () => {
    const res = await API.get('/api/dashboard');
    return res.data;
  },

  trackListen: async (songData) => {
    const res = await API.post('/api/dashboard/listen', songData);
    return res.data;
  },

  trackMood: async (mood, rawInput = '') => {
    const res = await API.post('/api/dashboard/mood', { mood, rawInput });
    return res.data;
  },

  toggleFavorite: async (songId) => {
    const res = await API.post('/api/dashboard/favorite', { songId });
    return res.data;
  },

  getHistory: async (page = 1, limit = 20) => {
    const res = await API.get(`/api/dashboard/history?page=${page}&limit=${limit}`);
    return res.data;
  },
};

// =============================================
//  MUSIC API (existing)
// =============================================

export const getSpotifyStatus = async () => {
  try {
    const res = await API.get('/api/spotify/status');
    return res.data;
  } catch (error) {
    return { configured: false, available: false, message: 'Unable to reach backend.' };
  }
};

export const getRecommendations = async (payload) => {
  try {
    const res = await API.post('/api/recommendations', payload);

    const recommendations = res.data.recommendations.map((track, i) => ({
      ...track,
      audioUrl: track.audioUrl || fallbackMockData[i % fallbackMockData.length].audioUrl,
      image: track.image || fallbackMockData[i % fallbackMockData.length].image,
    }));

    return { recommendations, explanation: res.data.explanation };
  } catch (error) {
    return { recommendations: fallbackMockData, explanation: 'Backend unreachable. Showing curated fallback tracks.' };
  }
};

export default API;
