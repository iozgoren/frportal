// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

// Create auth context
const AuthContext = createContext(null);

// Export hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  // Check for stored token and authenticate user on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // In a real app, validate token with the server
          // const response = await api.get('/auth/me');
          // dispatch(setUser(response.data));
          
          // For demo, just use mock data if token exists
          // Mock user for now
          const mockUser = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Admin',
            avatarUrl: 'https://placehold.co/200x200/4F46E5/FFFFFF?text=A',
            permissions: ['admin', 'user']
          };
          
          dispatch(setUser(mockUser));
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, [dispatch]);

  // Provide auth context value
  const value = {
    user,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;