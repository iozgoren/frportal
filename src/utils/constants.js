// src/utils/constants.js
export const API_BASE_URL = 'https://api.frportal.example.com'; // Replace with actual API URL

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