// src/routes/AppRoutes.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import AuthLayout from '../components/layouts/AuthLayout';
import MainLayout from '../components/layouts/MainLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import FolderView from '../pages/FolderView';
import AssetView from '../pages/AssetView';
import UserProfile from '../pages/UserProfile';
import NotFound from '../pages/NotFound';

// Admin pages
import UserManagement from '../pages/admin/UserManagement';
import BrandManagement from '../pages/admin/BrandManagement';

// ProtectedRoute component
const ProtectedRoute = ({ element, requiredPermission }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if specific permission is required
  if (requiredPermission && (!user?.permissions || !user.permissions.includes(requiredPermission))) {
    // Redirect to dashboard if user doesn't have required permission
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the protected element
  return element;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
      </Route>
      
      {/* Protected routes */}
      <Route element={<MainLayout />}>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Regular user routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/folder/:folderId" element={<ProtectedRoute element={<FolderView />} />} />
        <Route path="/asset/:assetId" element={<ProtectedRoute element={<AssetView />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
        
        {/* Admin routes */}
        <Route 
          path="/admin/users" 
          element={<ProtectedRoute element={<UserManagement />} requiredPermission="admin" />} 
        />
        <Route 
          path="/admin/brands" 
          element={<ProtectedRoute element={<BrandManagement />} requiredPermission="admin" />} 
        />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;