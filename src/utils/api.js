// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
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

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 responses (unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear any stored tokens
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API utility functions
const apiUtils = {
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  
  // User management
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  
  // For admin
  getUsers: (params) => api.get('/users', { params }),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Folder operations
  getFolders: (params) => api.get('/folders', { params }),
  createFolder: (folderData) => api.post('/folders', folderData),
  updateFolder: (id, folderData) => api.put(`/folders/${id}`, folderData),
  deleteFolder: (id) => api.delete(`/folders/${id}`),
  
  // Asset operations
  getAssets: (params) => api.get('/assets', { params }),
  getAssetById: (id) => api.get(`/assets/${id}`),
  uploadAsset: (formData) => api.post('/assets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateAsset: (id, assetData) => api.put(`/assets/${id}`, assetData),
  deleteAsset: (id) => api.delete(`/assets/${id}`),
  shareAsset: (id, shareData) => api.post(`/assets/${id}/share`, shareData),
  
  // Brands (for admin)
  getBrands: (params) => api.get('/brands', { params }),
  createBrand: (brandData) => api.post('/brands', brandData),
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

export default apiUtils;