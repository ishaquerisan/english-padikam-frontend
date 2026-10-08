import axios from 'axios';

const getBaseUrl = (): string => {
  const customUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
  if (customUrl) {
    // Ensure the URL ends with /api
    return customUrl.endsWith('/api') ? customUrl : `${customUrl.replace(/\/$/, '')}/api`;
  }
  // Default fallback
  return import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://api.padikam.altezzai.com/api';
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('padikam_token') || localStorage.getItem('angleyam_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if on protected route
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('padikam_token');
        localStorage.removeItem('padikam_user');
        localStorage.removeItem('angleyam_token');
        localStorage.removeItem('angleyam_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
