
// src/services/userService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create axios instance for user requests
const userAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
userAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
userAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const userService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    try {
      const response = await userAxios.get(API_ENDPOINTS.USERS, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcılar alınamadı.');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await userAxios.get(API_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı bilgileri alınamadı.');
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await userAxios.post(API_ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı oluşturulamadı.');
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await userAxios.put(API_ENDPOINTS.USER_BY_ID(id), userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı güncellenemedi.');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await userAxios.delete(API_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı silinemedi.');
    }
  },

  // Delete multiple users
  deleteUsers: async (userIds) => {
    try {
      const response = await userAxios.delete(API_ENDPOINTS.USERS, {
        data: { userIds }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to delete users:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcılar silinemedi.');
    }
  }
};

export default userService;
