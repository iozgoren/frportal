// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateToken } from '../store/slices/authSlice';

// Create auth context
const AuthContext = createContext(null);

// Export hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  // Check for stored token and authenticate user on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          await dispatch(validateToken()).unwrap();
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
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
    loading: loading || authLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;