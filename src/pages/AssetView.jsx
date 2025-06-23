// src/pages/AssetView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openShareModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';

// Mock data for development
const mockAsset = {
  id: 'asset1',
  name: 'Logo Primary',
  description: 'Main brand logo for use on light backgrounds',
  type: 'image',
  path: '/assets/logo_primary.png',
  url: 'https://placehold.co/800x600/4F46E5/FFFFFF?text=Logo',
  thumbnail: 'https://placehold.co/200x200/4F46E5/FFFFFF?text=Logo',
  createdAt: '2023-09-14T14:48:00',
  updatedAt: '2023-09-14T14:48:00',
  createdBy: {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
  },
  fileSize: '42KB',
  dimensions: '1200 × 800 px',
  extension: 'png',
  tags: ['logo', 'brand', 'primary'],
  folder: {
    id: 'folder1',
    name: 'Marketing Assets'
  }
};

const AssetView = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch asset data
    const fetchAssetData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // const response = await api.get(`/api/assets/${assetId}`);
        // setAsset(response.data);
        
        // Mock API response using timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        setAsset({ ...mockAsset, id: assetId });
      } catch (err) {
        console.error('Error fetching asset data:', err);
        setError('Failed to load asset. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssetData();
  }, [assetId]);
  
  const handleBack = () => {
    if (asset?.folder) {
      navigate(`/folder/${asset.folder.id}`);
    } else {
      navigate('/dashboard');
    }
  };
  
  const handleShare = () => {
    if (asset) {
      dispatch(openShareModal({
        id: asset.id,
        name: asset.name,
        type: asset.type
      }));
    }
  };
  
  const handleDownload = () => {
    // In a real application, this would trigger a download
    alert('Downloading asset: ' + asset.name);
  };
  
  const handleDelete = () => {
    // In a real application, this would open a confirmation modal
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      // Delete logic would go here
      navigate('/dashboard');
    }
  };
  
  // Render asset preview based on type
  const renderPreview = () => {
    if (!asset) return null;
    
    switch (asset.type) {
      case 'image':
        return (
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
            <img 
              src={asset.url} 
              alt={asset.name} 
              className="max-w-full max-h-96 rounded shadow-sm" 
            />
          </div>
        );
      case 'document':
        return (
          <div className="bg-gray-100 p-12 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-20 w-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-900">{asset.name}</p>
              <p className="text-sm text-gray-500">{asset.extension.toUpperCase()} • {asset.fileSize}</p>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
            <div className="relative w-full">
              <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden bg-black flex items-center justify-center">
                <svg className="h-20 w-20 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-12 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-20 w-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-900">{asset.name}</p>
              <p className="text-sm text-gray-500">{asset.extension.toUpperCase()} • {asset.fileSize}</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="p-6">
      {/* Back button */}
      <button 
        onClick={handleBack}
        className="inline-flex items-center text-sm text-gray-600 mb-4 hover:text-gray-900 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to {asset?.folder ? asset.folder.name : 'Dashboard'}
      </button>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading asset...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* Asset content */}
      {!loading && !error && asset && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset preview - takes up 2/3 of the screen on large screens */}
          <div className="lg:col-span-2">
            {/* Asset header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
              {asset.description && (
                <p className="mt-1 text-gray-600">{asset.description}</p>
              )}
            </div>
            
            {/* Asset preview */}
            {renderPreview()}
            
            {/* Tags */}
            {asset.tags && asset.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {asset.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Asset details - takes up 1/3 of the screen on large screens */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h2>
                
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{asset.type}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Size</dt>
                    <dd className="mt-1 text-sm text-gray-900">{asset.fileSize}</dd>
                  </div>
                  
                  {asset.dimensions && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                      <dd className="mt-1 text-sm text-gray-900">{asset.dimensions}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Format</dt>
                    <dd className="mt-1 text-sm text-gray-900 uppercase">{asset.extension}</dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Created by</dt>
                    <dd className="mt-1 text-sm text-gray-900">{asset.createdBy.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">{new Date(asset.createdAt).toLocaleDateString()}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{new Date(asset.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
                
                <div className="mt-6 space-y-3">
                  <Button onClick={handleDownload} fullWidth className="flex items-center justify-center">
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download
                  </Button>
                  
                  <Button onClick={handleShare} variant="secondary" fullWidth className="flex items-center justify-center">
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    Share
                  </Button>
                  
                  <Button 
                    onClick={handleDelete} 
                    variant="danger" 
                    fullWidth 
                    className="flex items-center justify-center"
                  >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetView;