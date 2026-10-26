import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get('job_portal_user', null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!storage.get('job_portal_user', null));

  useEffect(() => {
    if (user) {
      storage.set('job_portal_user', user);
      setIsAuthenticated(true);
    } else {
      storage.remove('job_portal_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
