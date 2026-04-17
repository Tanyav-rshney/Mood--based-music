import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('neonpulse_user') || 'null'),
  token: localStorage.getItem('neonpulse_token') || null,
  loading: false,
  error: null,

  // ── Check if authenticated ──
  isAuthenticated: () => !!get().token && !!get().user,

  // ── Register ──
  registerUser: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.register(name, email, password);
      const { user, token } = res.data;
      localStorage.setItem('neonpulse_token', token);
      localStorage.setItem('neonpulse_user', JSON.stringify(user));
      set({ user, token, loading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // ── Login ──
  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login(email, password);
      const { user, token } = res.data;
      localStorage.setItem('neonpulse_token', token);
      localStorage.setItem('neonpulse_user', JSON.stringify(user));
      set({ user, token, loading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // ── Forgot Password ──
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.forgotPassword(email);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // ── Reset Password ──
  resetPassword: async (token, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.resetPassword(token, password);
      const { user, token: newToken } = res.data;
      localStorage.setItem('neonpulse_token', newToken);
      localStorage.setItem('neonpulse_user', JSON.stringify(user));
      set({ user, token: newToken, loading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Reset failed';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // ── Fetch Profile (verify token) ──
  fetchProfile: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await authAPI.getProfile();
      const user = res.data.user;
      localStorage.setItem('neonpulse_user', JSON.stringify(user));
      set({ user });
    } catch {
      // Token invalid — clear everything
      localStorage.removeItem('neonpulse_token');
      localStorage.removeItem('neonpulse_user');
      set({ user: null, token: null });
    }
  },

  // ── Logout ──
  logout: () => {
    localStorage.removeItem('neonpulse_token');
    localStorage.removeItem('neonpulse_user');
    set({ user: null, token: null, error: null });
  },

  // ── Simple login (for backward compat) ──
  login: (userData) => set({ user: userData }),

  // ── Clear Error ──
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
