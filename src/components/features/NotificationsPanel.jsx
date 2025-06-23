// src/components/features/NotificationsPanel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../../store/slices/uiSlice';

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await api.get(API_ENDPOINTS.NOTIFICATIONS);
        // setNotifications(response.data);
        
        // Mock notifications data
        setTimeout(() => {
          setNotifications([
            {
              id: '1',
              title: 'New asset shared',
              message: 'John Doe shared a new asset with you: Brand Guidelines 2023',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              read: false,
              type: 'share'
            },
            {
              id: '2',
              title: 'Asset updated',
              message: 'Marketing Presentation was updated by Jane Smith',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
              read: false,
              type: 'update'
            },
            {
              id: '3',
              title: 'Comment on asset',
              message: 'Robert Johnson commented on Logo Design: "Looks great, approved!"',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
              read: true,
              type: 'comment'
            }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  const handleNotificationClick = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
    
    // Mark as read in the local state as well
    setNotifications(notifications.map(notification => 
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
    
    // In a real app, you would make an API call here
    // await api.post(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`);
    
    // Navigate to the relevant item based on notification type
    // ...
  };
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
    
    // Mark all as read in the local state
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    
    // In a real app, you would make an API call here
    // await api.post(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`);
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'share':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
        );
      case 'update':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };
  
  return (
    <div className="bg-white rounded-md shadow overflow-hidden max-h-96">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto max-h-80">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`
                  p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0
                  ${notification.read ? 'bg-white' : 'bg-blue-50'}
                `}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 flex-shrink-0 self-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No notifications to display
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 text-center border-t border-gray-200">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;