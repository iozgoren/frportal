// src/services/authService.js
// Service for handling authentication-related API calls to PHP REST API
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance for auth requests
const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
authAxios.interceptors.request.use(
  (config) => {
    // Add authorization header with JWT token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  login: async (username, password) => {
    try {
      const response = await authAxios.post('/login', { 
        username, 
        password,
        ipAddress: window.clientInformation?.ip || null,
        userAgent: navigator.userAgent || null
      });
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
    }
  },
  
  logout: async () => {
    try {
      const response = await authAxios.post('/logout');
      
      // Remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      // Remove tokens anyway
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      throw new Error('Çıkış yapılırken bir hata oluştu.');
    }
  },
  
  validateToken: async (token) => {
    try {
      const response = await authAxios.post('/validate-token', { token });
      return response.data.user;
    } catch (error) {
      console.error('Token validation failed:', error);
      throw new Error('Oturum doğrulanamadı.');
    }
  },
  
  refreshToken: async (refreshToken) => {
    try {
      const response = await authAxios.post('/refresh-token', { refreshToken });
      
      // Update tokens in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, force logout
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      throw new Error('Oturum yenilenemedi. Lütfen tekrar giriş yapın.');
    }
  },
  
  getUserProfile: async () => {
    try {
      const response = await authAxios.get('/profile');
      return response.data.user;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw new Error('Kullanıcı profili alınamadı.');
    }
  },
  
  getUserBrands: async () => {
    try {
      const response = await authAxios.get('/user-brands');
      return response.data.brands;
    } catch (error) {
      console.error('Failed to get user brands:', error);
      throw new Error('Kullanıcı markaları alınamadı.');
    }
  },
  
  getUserRoles: async () => {
    try {
      const response = await authAxios.get('/user-roles');
      return response.data.roles;
    } catch (error) {
      console.error('Failed to get user roles:', error);
      throw new Error('Kullanıcı rolleri alınamadı.');
    }
  },
  
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authAxios.post('/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw new Error(error.response?.data?.message || 'Şifre değiştirilemedi.');
    }
  }
};

export default authService;