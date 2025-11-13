// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/login', {
        email,
        password
      });

      const data = response.data;
      
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        school_id: data.user.school_id,
        schoolLogo: data.user.schoolLogo,
        schoolName: data.user.schoolName,
        token: data.token,
        expires_at: data.expires_at
      };

      setCurrentUser(userData);
      
      // Utilisation du storage unifié
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token_expires', data.expires_at);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Échec de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setError(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires');
      }
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await api.post('/refresh-token');
      const data = response.data;
      
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...user,
        token: data.token,
        expires_at: data.expires_at
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('token_expires', data.expires_at);
      }
      
      setCurrentUser(updatedUser);
      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
    return null;
  };

  const clearError = () => setError(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const expires = localStorage.getItem('token_expires');

        if (user && token && expires) {
          // Vérifier si le token a expiré
          if (new Date(expires) > new Date()) {
            setCurrentUser(JSON.parse(user));
          } else {
            // Tentative de rafraîchissement du token
            const newToken = await refreshToken();
            if (!newToken) {
              await logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    refreshToken,
    error,
    clearError,
    isAuthenticated: !!currentUser,
    hasRole: (role) => currentUser?.role === role,
    hasAnyRole: (roles) => roles.includes(currentUser?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};