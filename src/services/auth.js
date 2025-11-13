// src/services/auth.js
import { authAPI } from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};