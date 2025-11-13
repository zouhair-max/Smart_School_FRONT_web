// config/api.js
import axios from 'axios';

// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000/api'; // Backend Laravel sur port 8000
  }
  // En production, utilisez l'URL de votre backend déployé
    return 'http://localhost:8000/api'; // Backend Laravel sur port 8000
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Gestionnaire de stockage pour web
const storage = {
  getItem: (key) => {
    return localStorage.getItem(key);
  },
  
  setItem: (key, value) => {
    localStorage.setItem(key, value);
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};

// Intercepteur de requêtes
api.interceptors.request.use(
  (config) => {
    try {
      const token = storage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token retrieval error:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeItem('token');
      storage.removeItem('user');
      storage.removeItem('token_expires');
      
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;