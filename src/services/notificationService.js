
// src/services/notificationService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create axios instance for notification requests
const notificationAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
notificationAxios.interceptors.request.use(
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
notificationAxios.interceptors.response.use(
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

const notificationService = {
  // Get all notifications for current user
  getNotifications: async (params = {}) => {
    try {
      const response = await notificationAxios.get(API_ENDPOINTS.NOTIFICATIONS, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw new Error(error.response?.data?.message || 'Bildirimler alınamadı.');
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await notificationAxios.put(API_ENDPOINTS.MARK_NOTIFICATION_READ(id));
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error(error.response?.data?.message || 'Bildirim okundu olarak işaretlenemedi.');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await notificationAxios.put(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error(error.response?.data?.message || 'Tüm bildirimler okundu olarak işaretlenemedi.');
    }
  }
};

export default notificationService;
