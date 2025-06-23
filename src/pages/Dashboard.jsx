// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Mock data for the dashboard
const mockRecentAssets = [
  {
    id: 'asset1',
    name: 'Brand Logo 2023',
    type: 'image',
    thumbnail: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Logo',
    updatedAt: '2023-06-15T14:22:00',
    size: '1.2 MB'
  },
  {
    id: 'asset2',
    name: 'Marketing Campaign Video',
    type: 'video',
    thumbnail: 'https://placehold.co/100x100/10B981/FFFFFF?text=Video',
    updatedAt: '2023-06-14T09:15:00',
    size: '15.8 MB'
  },
  {
    id: 'asset3',
    name: 'Q2 Sales Report',
    type: 'document',
    thumbnail: 'https://placehold.co/100x100/EF4444/FFFFFF?text=PDF',
    updatedAt: '2023-06-13T16:45:00',
    size: '2.4 MB'
  },
  {
    id: 'asset4',
    name: 'Social Media Guidelines',
    type: 'document',
    thumbnail: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=DOC',
    updatedAt: '2023-06-12T11:30:00',
    size: '1.8 MB'
  }
];

const mockStats = [
  { name: 'Total Assets', value: '1,284', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Active Users', value: '42', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Shared with Me', value: '38', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  { name: 'Storage Used', value: '68.2 GB', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }
];

const mockFolders = [
  { id: 'all', name: 'All Assets', count: 1284, icon: 'grid' },
  { id: 'folder1', name: 'Marketing Assets', count: 285, icon: 'folder' },
  { id: 'folder2', name: 'Brand Guidelines', count: 124, icon: 'folder' },
  { id: 'folder3', name: 'Social Media Content', count: 346, icon: 'folder' },
  { id: 'folder4', name: 'Product Photos', count: 218, icon: 'folder' },
  { id: 'folder5', name: 'Videos', count: 97, icon: 'folder' }
];

const mockActivities = [
  {
    id: 'activity1',
    user: { name: 'John Smith', avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=JS' },
    action: 'uploaded',
    item: 'Q2 Marketing Plan',
    timestamp: '2023-06-15T14:30:00',
  },
  {
    id: 'activity2',
    user: { name: 'Emma Johnson', avatar: 'https://placehold.co/100x100/10B981/FFFFFF?text=EJ' },
    action: 'commented on',
    item: 'Brand Guidelines 2023',
    timestamp: '2023-06-15T10:15:00',
  },
  {
    id: 'activity3',
    user: { name: 'Alex Rodriguez', avatar: 'https://placehold.co/100x100/EF4444/FFFFFF?text=AR' },
    action: 'shared',
    item: 'Social Media Templates',
    timestamp: '2023-06-14T16:45:00',
  },
  {
    id: 'activity4',
    user: { name: 'Sarah Williams', avatar: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=SW' },
    action: 'updated',
    item: 'Product Catalog',
    timestamp: '2023-06-14T09:20:00',
  },
  {
    id: 'activity5',
    user: { name: 'Michael Brown', avatar: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=MB' },
    action: 'deleted',
    item: 'Outdated Assets',
    timestamp: '2023-06-13T11:10:00',
  }
];

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [recentAssets, setRecentAssets] = useState([]);
  const [stats, setStats] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // In a real app, these would be API calls
        // const assetsResponse = await api.get('/assets/recent');
        // const statsResponse = await api.get('/dashboard/stats');
        // const foldersResponse = await api.get('/folders');
        // const activitiesResponse = await api.get('/activities');
        
        // Mock API responses with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRecentAssets(mockRecentAssets);
        setStats(mockStats);
        setFolders(mockFolders);
        setActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      {/* Header with greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || 'User'}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your assets today.
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading dashboard...</span>
        </div>
      )}
      
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-md bg-blue-500 bg-opacity-10">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        {stat.name}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recent assets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-base font-medium text-gray-900">Recent Assets</h3>
                <Link to="/folder/all" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentAssets.map(asset => (
                  <Link key={asset.id} to={`/asset/${asset.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-3 flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                        <img src={asset.thumbnail} alt={asset.name} className="h-10 w-10 object-cover" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                        <div className="flex text-xs text-gray-500">
                          <span>{asset.type}</span>
                          <span className="mx-1">•</span>
                          <span>{asset.size}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeTime(asset.updatedAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Upload New Asset
                </button>
              </div>
            </div>
            
            {/* Recent activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">Recent Activity</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {activities.map(activity => (
                  <div key={activity.id} className="px-4 py-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <img 
                          src={activity.user.avatar} 
                          alt={activity.user.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user.name}</span> {activity.action} <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Quick access folders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-base font-medium text-gray-900">Folders</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  New Folder
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {folders.map(folder => (
                  <Link key={folder.id} to={`/folder/${folder.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-3 flex items-center">
                      {folder.icon === 'grid' ? (
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      )}
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {folder.count} items
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Help section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Need help?</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Check out our documentation for tips on getting the most out of FR PORTAL.
                  </p>
                  <div className="mt-3">
                    <button className="text-sm font-medium text-blue-800 hover:text-blue-700">
                      View Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;