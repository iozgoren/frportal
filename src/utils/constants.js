// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',

  // User management
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',

  // Folder operations
  FOLDERS: '/folders',

  // Asset operations
  ASSETS: '/assets',
  ASSET_SHARE: (id) => `/assets/${id}/share`,

  // Brands
  BRANDS: '/brands',

  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`
};

// Asset types
export const ASSET_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  OTHER: 'other'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// File size limits (in MB)
export const FILE_SIZE_LIMITS = {
  IMAGE: 10,
  VIDEO: 100,
  DOCUMENT: 25,
  AUDIO: 50,
  OTHER: 25
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};