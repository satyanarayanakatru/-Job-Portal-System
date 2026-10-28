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
    experience: '6 years',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user_cand_2',
    name: 'David Chen',
    email: 'david.chen@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Staff Cloud Infrastructure Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Seattle, WA',
    phone: '+1 (555) 345-6789',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    experience: '8 years',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'user_cand_3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Lead AI / ML Research Scientist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Boston, MA',
    phone: '+1 (555) 456-7890',
    skills: ['PyTorch', 'Python', 'LLMs', 'LangChain'],
    experience: '7 years',
    createdAt: '2026-03-05T14:30:00Z',
  },
  {
    id: 'user_cand_4',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Principal Product Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    phone: '+1 (555) 567-8901',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
    experience: '9 years',
    createdAt: '2026-03-20T11:15:00Z',
  },
  {
    id: 'user_cand_5',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Senior Full Stack Web Developer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    phone: '+1 (555) 678-9012',
    skills: ['React.js', 'Node.js', 'PostgreSQL', 'GraphQL'],
    experience: '5 years',
    createdAt: '2026-04-12T09:45:00Z',
  },
  {
    id: 'user_cand_6',
    name: 'Michael Chang',
    email: 'michael.chang@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Distributed Systems & Go Engineer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    location: 'Chicago, IL',
    phone: '+1 (555) 789-0123',
    skills: ['Golang', 'Kafka', 'gRPC', 'Microservices'],
    experience: '6 years',
    createdAt: '2026-05-18T16:20:00Z',
  },
  {
    id: 'user_cand_7',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.mansoor@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'DevSecOps & Cyber Defense Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Washington, DC',
    phone: '+1 (555) 890-1234',
    skills: ['DevSecOps', 'SIEM', 'Penetration Testing', 'ISO 27001'],
    experience: '5 years',
    createdAt: '2026-06-01T13:10:00Z',
  },
  {
    id: 'user_cand_8',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Senior Mobile Engineer (iOS & React Native)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    location: 'Denver, CO',
    phone: '+1 (555) 901-2345',
    skills: ['React Native', 'Swift', 'iOS', 'Mobile Architecture'],
    experience: '6 years',
    createdAt: '2026-06-25T15:00:00Z',
  },
  {
    id: 'user_cand_9',
    name: 'Sofia Ramirez',
    email: 'sofia.ramirez@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Lead QA Automation & Reliability Engineer',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    location: 'Los Angeles, CA',
    phone: '+1 (555) 012-3456',
    skills: ['Cypress', 'Playwright', 'Jest', 'CI/CD Pipelines'],
    experience: '4 years',
    createdAt: '2026-07-14T08:30:00Z',
  },
  {
    id: 'user_cand_10',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Data Platform & Analytics Engineer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    location: 'Atlanta, GA',
    phone: '+1 (555) 123-4567',
    skills: ['Snowflake', 'Apache Spark', 'dbt', 'Python'],
    experience: '5 years',
    createdAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 'user_rec_1',
    name: 'Alex Morgan',
    email: 'recruiter@jobportal.com',
    password: 'Password@123',
    role: 'recruiter',
    company: 'TechCorp Global Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    phone: '+1 (555) 876-5432',
    designation: 'Head of Talent Acquisition',
    createdAt: '2026-01-10T11:30:00Z',
  },
];

export const AuthProvider = ({ children }) => {
  // Store all registered users in localStorage (auto-upgrade to 10 verified candidates if needed)
  const [users, setUsers] = useState(() => {
    const existing = storage.get('job_portal_registered_users', null);
    if (!existing || !Array.isArray(existing) || existing.length <= 2) {
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
