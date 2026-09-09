import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agrinova-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('agrinova-token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('agrinova-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrinova-user');
    }
  }, [user]);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('agrinova-token', token);
    } else {
      localStorage.removeItem('agrinova-token');
    }
  }, [token]);

  // Validate session on initial load if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (token && !user) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            // Token invalid or expired
            setToken(null);
            setUser(null);
          }
        } catch (e) {
          console.warn('[Auth] Session check failed:', e.message);
        }
      }
    };
    verifySession();
  }, [token]);

  const login = async (phoneOrEmail, password, role) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        phoneOrEmail,
        password,
        role
      });

      if (res.success && res.data) {
        const loggedUser = res.data.user;
        const authToken = res.data.token;

        setUser(loggedUser);
        setToken(authToken);
        setLoading(false);
        return { success: true, user: loggedUser, message: res.message };
      } else {
        setLoading(false);
        return {
          success: false,
          message: res.message || 'Login failed. Please check your credentials.',
          errorCode: res.errorCode
        };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.message || 'Server error occurred during login.'
      };
    }
  };

  const signup = async (username, email, phone, password, role) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        phone,
        password,
        role
      });

      if (res.success && res.data) {
        const newUser = res.data.user;
        const authToken = res.data.token;

        setUser(newUser);
        setToken(authToken);
        setLoading(false);
        return { success: true, user: newUser, message: res.message };
      } else {
        setLoading(false);
        return {
          success: false,
          message: res.message || 'Registration failed.',
          errorCode: res.errorCode
        };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.message || 'Server error during registration.'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, signup, logout, loading }}>
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
