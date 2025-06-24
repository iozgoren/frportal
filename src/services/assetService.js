
// src/services/assetService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create axios instance for asset requests
const assetAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
assetAxios.interceptors.request.use(
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
assetAxios.interceptors.response.use(
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

const assetService = {
  // Get all assets
  getAssets: async (params = {}) => {
    try {
      const response = await assetAxios.get(API_ENDPOINTS.ASSETS, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get assets:', error);
      throw new Error(error.response?.data?.message || 'Varlıklar alınamadı.');
    }
  },

  // Get asset by ID
  getAssetById: async (id) => {
    try {
      const response = await assetAxios.get(API_ENDPOINTS.ASSET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Failed to get asset:', error);
      throw new Error(error.response?.data?.message || 'Varlık bilgileri alınamadı.');
    }
  },

  // Upload new asset
  uploadAsset: async (formData) => {
    try {
      const response = await assetAxios.post(API_ENDPOINTS.ASSETS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload asset:', error);
      throw new Error(error.response?.data?.message || 'Varlık yüklenemedi.');
    }
  },

  // Update asset
  updateAsset: async (id, assetData) => {
    try {
      const response = await assetAxios.put(API_ENDPOINTS.ASSET_BY_ID(id), assetData);
      return response.data;
    } catch (error) {
      console.error('Failed to update asset:', error);
      throw new Error(error.response?.data?.message || 'Varlık güncellenemedi.');
    }
  },

  // Delete asset
  deleteAsset: async (id) => {
    try {
      const response = await assetAxios.delete(API_ENDPOINTS.ASSET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Failed to delete asset:', error);
      throw new Error(error.response?.data?.message || 'Varlık silinemedi.');
    }
  },

  // Share asset
  shareAsset: async (id, shareData) => {
    try {
      const response = await assetAxios.post(API_ENDPOINTS.ASSET_SHARE(id), shareData);
      return response.data;
    } catch (error) {
      console.error('Failed to share asset:', error);
      throw new Error(error.response?.data?.message || 'Varlık paylaşılamadı.');
    }
  }
};

export default assetService;
