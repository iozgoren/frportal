// src/utils/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  VALIDATE_TOKEN: '/auth/validate-token',
  USER_PROFILE: '/auth/profile',
  USER_BRANDS: '/auth/user-brands',
  USER_ROLES: '/auth/user-roles',
  CHANGE_PASSWORD: '/auth/change-password',

  // User management
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,

  // Asset management
  ASSETS: '/assets',
  ASSET_BY_ID: (id) => `/assets/${id}`,
  ASSET_SHARE: (id) => `/assets/${id}/share`,

  // Folder management
  FOLDERS: '/folders',
  FOLDER_BY_ID: (id) => `/folders/${id}`,

  // Brand management
  BRANDS: '/brands',
  BRAND_BY_ID: (id) => `/brands/${id}`,

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

// File extensions by type
export const FILE_EXTENSIONS = {
  [ASSET_TYPES.IMAGE]: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  [ASSET_TYPES.VIDEO]: ['.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm'],
  [ASSET_TYPES.DOCUMENT]: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  [ASSET_TYPES.AUDIO]: ['.mp3', '.wav', '.ogg', '.m4a', '.flac']
};

// Maximum file size in bytes (100MB by default)
export const MAX_FILE_SIZE = {
  [ASSET_TYPES.IMAGE]: 15 * 1024 * 1024, // 15MB
  [ASSET_TYPES.VIDEO]: 100 * 1024 * 1024, // 100MB
  [ASSET_TYPES.DOCUMENT]: 50 * 1024 * 1024, // 50MB
  [ASSET_TYPES.AUDIO]: 25 * 1024 * 1024, // 25MB
  [ASSET_TYPES.OTHER]: 50 * 1024 * 1024 // 50MB
};

// Supported languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' }
];

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

// Permission levels
export const PERMISSIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  ADMIN: 'admin'
};

// Asset statuses
export const ASSET_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DRAFT: 'draft'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SHARE: 'share',
  COMMENT: 'comment',
  UPDATE: 'update',
  SYSTEM: 'system'
};