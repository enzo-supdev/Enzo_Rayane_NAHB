import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.data.user);
    return data;
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAuthor: user?.role === 'author' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
