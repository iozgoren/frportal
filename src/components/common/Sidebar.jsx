// src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar, openFolderModal } from '../../store/slices/uiSlice';

// Mock folder data
const mockFolders = [
  { id: 'all', name: 'All Assets', icon: 'grid', isDefault: true },
  { id: 'folder1', name: 'Marketing Assets', icon: 'folder' },
  { id: 'folder2', name: 'Brand Guidelines', icon: 'folder' },
  { id: 'folder3', name: 'Social Media Content', icon: 'folder' },
  { id: 'folder4', name: 'Product Photos', icon: 'folder' },
  { id: 'folder5', name: 'Videos', icon: 'folder' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { sidebarOpen } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);
  
  const [folders, setFolders] = useState(mockFolders);
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  
  const isAdmin = user?.role === 'Admin' || user?.permissions?.includes('admin');
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleToggleFolders = () => {
    setFoldersExpanded(!foldersExpanded);
  };
  
  const handleCreateFolder = () => {
    dispatch(openFolderModal());
  };
  
  // Navigation link active style
  const navLinkClass = ({ isActive }) => 
    `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      isActive 
        ? 'text-white bg-blue-800' 
        : 'text-blue-100 hover:text-white hover:bg-blue-700'
    }`;
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 transition duration-300 ease-in-out transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-full
      `}>
        {/* Logo and close button */}
        <div className="flex items-center justify-between px-4 py-5">
          <Link to="/dashboard" className="flex items-center">
            <img
              className="h-8 w-auto mr-2"
              src="https://placehold.co/80x80/3B82F6/FFFFFF?text=FR"
              alt="FR Portal"
            />
            <span className="text-white font-bold text-lg">FR PORTAL</span>
          </Link>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden text-blue-300 hover:text-white"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4 h-full flex flex-col">
          <NavLink to="/dashboard" className={navLinkClass}>
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NavLink>
          
          {/* Folders section */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                Folders
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleToggleFolders}
                  className="text-blue-300 hover:text-white"
                >
                  {foldersExpanded ? (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={handleCreateFolder}
                  className="text-blue-300 hover:text-white"
                  title="Create new folder"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            {foldersExpanded && (
              <div className="space-y-1">
                {folders.map(folder => (
                  <NavLink 
                    key={folder.id}
                    to={`/folder/${folder.id}`}
                    className={navLinkClass}
                  >
                    {folder.icon === 'grid' ? (
                      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    ) : (
                      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    )}
                    {folder.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          
          {/* Admin section */}
          {isAdmin && (
            <div className="mt-6">
              <h3 className="px-3 mb-2 text-xs uppercase tracking-wider text-blue-200 font-semibold">
                Administration
              </h3>
              <div className="space-y-1">
                <NavLink to="/admin/users" className={navLinkClass}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Management
                </NavLink>
                
                <NavLink to="/admin/brands" className={navLinkClass}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Brand Management
                </NavLink>
              </div>
            </div>
          )}
          
          {/* Bottom section */}
          <div className="mt-auto">
            <NavLink to="/profile" className={navLinkClass}>
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </NavLink>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 mt-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-md"
            >
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;