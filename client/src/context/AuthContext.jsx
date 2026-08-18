import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cloudcart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cloudcart_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('cloudcart_user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.loginUser(credentials);
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('cloudcart_token', jwtToken);
    localStorage.setItem('cloudcart_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const res = await authService.registerUser(userData);
    const { user: newUserData, token: jwtToken } = res.data;
    setUser(newUserData);
    setToken(jwtToken);
    localStorage.setItem('cloudcart_token', jwtToken);
    localStorage.setItem('cloudcart_user', JSON.stringify(newUserData));
    return newUserData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cloudcart_token');
    localStorage.removeItem('cloudcart_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('cloudcart_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
