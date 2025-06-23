// src/components/features/AssetCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleModal, setModalData } from '../../store/slices/uiSlice';

const AssetCard = ({ asset }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showActions, setShowActions] = useState(false);
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const getFileTypeIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'ppt':
      case 'pptx':
        return (
          <svg className="h-10 w-10 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return null; // No icon for images, we'll display the thumbnail instead
      case 'mp4':
      case 'mov':
      case 'avi':
        return (
          <svg className="h-10 w-10 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  const handleViewAsset = () => {
    navigate(`/assets/${asset.id}`);
  };
  
  const handleShareAsset = (e) => {
    e.stopPropagation(); // Prevent triggering the card click event
    dispatch(setModalData({ asset }));
    dispatch(toggleModal({ modal: 'shareAsset', open: true }));
  };
  
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent triggering the card click event
    // In a real app, you would download the file here
    window.open(asset.downloadUrl, '_blank');
  };
  
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the card click event
    dispatch(setModalData({
      assetId: asset.id,
      assetName: asset.name,
      onConfirm: () => {
        // Here you would handle the asset deletion logic
        console.log('Deleting asset:', asset.id);
      }
    }));
    dispatch(toggleModal({ modal: 'deleteConfirmation', open: true }));
  };
  
  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-md"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleViewAsset}
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
        {asset.thumbnailUrl ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getFileTypeIcon(asset.fileType)}
          </div>
        )}
        
        {/* Hover actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
            <button
              onClick={handleViewAsset}
              className="p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none"
              title="View details"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button
              onClick={handleShareAsset}
              className="p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none"
              title="Share asset"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none"
              title="Download"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            {asset.canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none"
                title="Delete"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* File type badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-900 bg-opacity-70 text-white text-xs uppercase rounded">
          {asset.fileType}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate" title={asset.name}>
          {asset.name}
        </h3>
        
        <p className="text-sm text-gray-500 mt-1 truncate" title={asset.description}>
          {asset.description || 'No description provided'}
        </p>
        
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>{formatSize(asset.size)}</span>
          <span>{formatDate(asset.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;