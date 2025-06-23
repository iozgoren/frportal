// src/components/layouts/MainLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import FolderModal from '../modals/FolderModal';
import UploadAssetModal from '../modals/UploadAssetModal';
import ShareAssetModal from '../modals/ShareAssetModal';
import ConfirmationModal from '../modals/ConfirmationModal';

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { 
    sidebarOpen,
    folderModalOpen,
    uploadModalOpen,
    shareModalOpen,
    confirmationModalOpen,
    confirmationModalData
  } = useSelector(state => state.ui);

  // Close modals when route changes
  useEffect(() => {
    // You could dispatch actions to close modals here if needed
  }, [location, dispatch]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Modals */}
      {folderModalOpen && <FolderModal />}
      {uploadModalOpen && <UploadAssetModal />}
      {shareModalOpen && <ShareAssetModal />}
      {confirmationModalOpen && (
        <ConfirmationModal
          title={confirmationModalData?.title}
          message={confirmationModalData?.message}
          confirmText={confirmationModalData?.confirmText}
          cancelText={confirmationModalData?.cancelText}
          confirmVariant={confirmationModalData?.confirmVariant}
          onConfirm={confirmationModalData?.onConfirm}
          onCancel={confirmationModalData?.onCancel}
        />
      )}
    </div>
  );
};

export default MainLayout;