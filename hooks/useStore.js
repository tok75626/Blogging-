import { create } from 'zustand';
import axios from 'axios';

// API Instance with automatic refresh token handling
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const useStore = create((set, get) => ({
  user: null,
  posts: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      set({ user: null });
    }
  },

  fetchPosts: async (params) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/posts', { params });
      set({ posts: data.posts || [], loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
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
      const { data } = await api.post(`/upload?filename=${file.name}`, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      set({ loading: false });
      return data.url;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));

export { api };
