import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'user_cand_1',
    name: 'Sarah Jenkins',
    email: 'candidate@jobportal.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    phone: '+1 (555) 234-5678',
    skills: ['React.js', 'Tailwind CSS', 'TypeScript', 'Next.js'],
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user_rec_1',
    name: 'Alex Morgan',
    email: 'recruiter@jobportal.com',
    password: 'Password@123',
    role: 'recruiter',
    company: 'TechCorp Global Solutions',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    phone: '+1 (555) 876-5432',
    designation: 'Head of Talent Acquisition',
    createdAt: '2026-01-10T11:30:00Z',
  },
];

export const AuthProvider = ({ children }) => {
  // Store all registered users in localStorage
  const [users, setUsers] = useState(() => {
    const existing = storage.get('job_portal_registered_users', null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storage.set('job_portal_registered_users', DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    return existing;
  });

  // Current active session
  const [user, setUser] = useState(() => storage.get('job_portal_session', null));
  const [loading, setLoading] = useState(false);

  // Sync session changes to localStorage
  useEffect(() => {
    if (user) {
      storage.set('job_portal_session', user);
    } else {
      storage.remove('job_portal_session');
    }
  }, [user]);

  // Sync users list to localStorage
  useEffect(() => {
    storage.set('job_portal_registered_users', users);
  }, [users]);

  // Register a new user
  const register = async (formData) => {
    setLoading(true);
    try {
      // Simulate slight network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      const emailNormalized = formData.email.trim().toLowerCase();
      const existingUser = users.find((u) => u.email.toLowerCase() === emailNormalized);

      if (existingUser) {
        throw new Error('An account with this email address already exists. Please log in.');
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name: formData.name.trim(),
        email: emailNormalized,
        password: formData.password,
        role: formData.role || 'candidate', // candidate or recruiter
        phone: formData.phone || '',
        company: formData.company || (formData.role === 'recruiter' ? 'Enterprise Inc.' : undefined),
        avatar:
          formData.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Create session
      const sessionData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company,
        avatar: newUser.avatar,
        token: 'jwt_mock_' + Math.random().toString(36).substring(2) + Date.now(),
        loggedInAt: new Date().toISOString(),
      };

      setUser(sessionData);
      toast.success(`Welcome to JobPortal, ${newUser.name}! Registration successful.`);
      return { success: true, user: sessionData };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (email, password, roleHint = null) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const emailNormalized = email.trim().toLowerCase();
      const matchedUser = users.find((u) => u.email.toLowerCase() === emailNormalized);

      if (!matchedUser) {
        throw new Error('No account found with this email. Please check your credentials or register.');
      }

      if (matchedUser.password !== password) {
        throw new Error('Invalid password. Please verify and try again.');
      }

      // Check role if roleHint provided
      if (roleHint && matchedUser.role !== roleHint) {
        throw new Error(
          `This account is registered as a ${matchedUser.role.toUpperCase()}. Please select the correct role or switch your login tab.`
        );
      }

      const sessionData = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        company: matchedUser.company,
        title: matchedUser.title,
        avatar: matchedUser.avatar,
        token: 'jwt_mock_' + Math.random().toString(36).substring(2) + Date.now(),
        loggedInAt: new Date().toISOString(),
      };

      setUser(sessionData);
      toast.success(`Welcome back, ${matchedUser.name}! Logged in as ${matchedUser.role}.`);
      return { success: true, user: sessionData };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Quick fill & demo login helper
  const demoLogin = async (role) => {
    const demoEmail = role === 'recruiter' ? 'recruiter@jobportal.com' : 'candidate@jobportal.com';
    return login(demoEmail, 'Password@123', role);
  };

  // Forgot password handler
  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const emailNormalized = email.trim().toLowerCase();
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === emailNormalized);

      if (userIndex === -1) {
        throw new Error('No user found registered with this email address.');
      }

      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      };

      setUsers(updatedUsers);
      toast.success('Your password has been successfully reset! You can now log in.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    const userName = user?.name || 'User';
    setUser(null);
    storage.remove('job_portal_session');
    toast.info(`You have been logged out. See you soon, ${userName}!`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        resetPassword,
        logout,
        registeredUsers: users,
      }}
    >
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
