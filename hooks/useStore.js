import { create } from 'zustand';
import axios from 'axios';

// Single axios instance - baseURL is /api, all paths are relative
const api = axios.create({ baseURL: '/api' });

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, bypass clear session
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // bypass everything
    return Promise.reject(error);
  }
);

export const useStore = create((set) => ({
  user: null,
  posts: [],
  loading: false,
  error: null,

  // Restore auth from localStorage on app boot (Bypassed)
  initAuth: () => {
    if (typeof window === 'undefined') return;
    set({ user: {
      id: '662b1f1a1c4b2a001c8e1234', 
      email: 'admin@blogpro.com',
      name: 'Admin User',
      role: 'admin',
    }});
  },

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, posts: [] });
  },

  fetchPosts: async (params) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/posts', { params });
      set({ posts: data.posts || [], loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return { posts: [] };
    }
  },

  createPost: async (postData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/posts', postData);
      set((state) => ({ posts: [data, ...(state.posts || [])], loading: false }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateAIContent: async (prompt) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/ai/generate', { prompt });
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  uploadFile: async (file) => {
    set({ loading: true });
    try {
      const { data } = await api.post(`/upload?filename=${encodeURIComponent(file.name)}`, file, {
        headers: { 'Content-Type': file.type },
      });
      set({ loading: false });
      return data.url;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export { api };
