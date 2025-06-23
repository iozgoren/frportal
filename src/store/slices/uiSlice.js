// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sidebar state
  sidebarOpen: true,
  
  // Notification panel
  notificationsPanelOpen: false,
  notifications: [
    {
      id: 'notif1',
      title: 'New asset shared',
      message: 'Sarah shared "Brand Guidelines 2023" with you',
      time: '2023-06-15T10:30:00',
      read: false,
      type: 'share'
    },
    {
      id: 'notif2',
      title: 'Comment on your post',
      message: 'John commented on "Marketing Campaign Q3"',
      time: '2023-06-14T15:45:00',
      read: false,
      type: 'comment'
    },
    {
      id: 'notif3',
      title: 'System maintenance',
      message: 'Scheduled maintenance on June 20th, 2023',
      time: '2023-06-13T09:00:00',
      read: true,
      type: 'system'
    }
  ],
  
  // Modals
  folderModalOpen: false,
  folderModalData: null,
  
  uploadModalOpen: false,
  uploadModalData: null,
  
  shareModalOpen: false,
  shareModalData: null,
  
  confirmationModalOpen: false,
  confirmationModalData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Notification panel
    toggleNotificationsPanel: (state) => {
      state.notificationsPanelOpen = !state.notificationsPanelOpen;
    },
    closeNotificationsPanel: (state) => {
      state.notificationsPanelOpen = false;
    },
    
    // Notification actions
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: `notif${Date.now()}`,
        time: new Date().toISOString(),
        read: false,
        ...action.payload
      });
    },
    
    // Folder modal
    openFolderModal: (state, action) => {
      state.folderModalOpen = true;
      state.folderModalData = action.payload || null;
    },
    closeFolderModal: (state) => {
      state.folderModalOpen = false;
      state.folderModalData = null;
    },
    
    // Upload modal
    openUploadModal: (state, action) => {
      state.uploadModalOpen = true;
      state.uploadModalData = action.payload || null;
    },
    closeUploadModal: (state) => {
      state.uploadModalOpen = false;
      state.uploadModalData = null;
    },
    
    // Share modal
    openShareModal: (state, action) => {
      state.shareModalOpen = true;
      state.shareModalData = action.payload || null;
    },
    closeShareModal: (state) => {
      state.shareModalOpen = false;
      state.shareModalData = null;
    },
    
    // Confirmation modal
    openConfirmationModal: (state, action) => {
      state.confirmationModalOpen = true;
      state.confirmationModalData = action.payload || {};
    },
    closeConfirmationModal: (state) => {
      state.confirmationModalOpen = false;
      state.confirmationModalData = null;
    },
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleNotificationsPanel,
  closeNotificationsPanel,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotification,
  clearAllNotifications,
  addNotification,
  openFolderModal,
  closeFolderModal,
  openUploadModal,
  closeUploadModal,
  openShareModal,
  closeShareModal,
  openConfirmationModal,
  closeConfirmationModal
} = uiSlice.actions;

export default uiSlice.reducer;