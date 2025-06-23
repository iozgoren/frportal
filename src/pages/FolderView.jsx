// src/pages/FolderView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openUploadModal, openFolderModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';

// Mock data for development
const mockFolders = [
  { id: 'folder1', name: 'Marketing Assets', path: '/folder/folder1', createdAt: '2023-09-15', itemCount: 12 },
  { id: 'folder2', name: 'Brand Guidelines', path: '/folder/folder2', createdAt: '2023-07-22', itemCount: 8 },
  { id: 'folder3', name: 'Social Media', path: '/folder/folder3', createdAt: '2023-10-01', itemCount: 24 },
];

const mockAssets = [
  { 
    id: 'asset1', 
    name: 'Logo Primary', 
    type: 'image', 
    path: '/assets/logo_primary.png',
    thumbnail: 'https://placehold.co/200x200/4F46E5/FFFFFF?text=Logo', 
    createdAt: '2023-09-14',
    fileSize: '42KB',
    extension: 'png'
  },
  { 
    id: 'asset2', 
    name: 'Brand Guidelines PDF', 
    type: 'document', 
    path: '/assets/brand_guidelines.pdf',
    thumbnail: 'https://placehold.co/200x200/EF4444/FFFFFF?text=PDF', 
    createdAt: '2023-08-29',
    fileSize: '2.3MB',
    extension: 'pdf'
  },
  { 
    id: 'asset3', 
    name: 'Intro Video', 
    type: 'video', 
    path: '/assets/intro.mp4',
    thumbnail: 'https://placehold.co/200x200/10B981/FFFFFF?text=Video', 
    createdAt: '2023-09-05',
    fileSize: '12.7MB',
    extension: 'mp4'
  },
];

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [folders, setFolders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Home', path: '/dashboard' }]);
  const [view, setView] = useState('grid'); // grid or list
  
  useEffect(() => {
    // Fetch folder data
    const fetchFolderData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be API calls
        // const folderResponse = await api.get(`/api/folders/${folderId}/contents`);
        // const folderInfo = await api.get(`/api/folders/${folderId}`);
        
        // Mock API response using timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set folder data
        setFolders(mockFolders);
        setAssets(mockAssets);
        
        // Set current folder information
        if (folderId) {
          const folder = mockFolders.find(f => f.id === folderId) || {
            id: folderId,
            name: `Folder ${folderId}`,
            path: `/folder/${folderId}`,
          };
          
          setCurrentFolder(folder);
          
          // Update breadcrumbs
          setBreadcrumbs([
            { name: 'Home', path: '/dashboard' },
            { name: folder.name, path: `/folder/${folder.id}` },
          ]);
        } else {
          setCurrentFolder(null);
          setBreadcrumbs([{ name: 'Home', path: '/dashboard' }]);
        }
      } catch (err) {
        console.error('Error fetching folder data:', err);
        setError('Failed to load folder contents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFolderData();
  }, [folderId]);
  
  // Handle folder click
  const handleFolderClick = (folder) => {
    navigate(`/folder/${folder.id}`);
  };
  
  // Handle asset click
  const handleAssetClick = (asset) => {
    navigate(`/asset/${asset.id}`);
  };
  
  // Handle create new folder
  const handleCreateFolder = () => {
    dispatch(openFolderModal({ parentFolderId: folderId || null }));
  };
  
  // Handle upload asset
  const handleUploadAsset = () => {
    dispatch(openUploadModal({ folderId: folderId || null }));
  };
  
  // Change view mode
  const toggleView = () => {
    setView(prev => (prev === 'grid' ? 'list' : 'grid'));
  };
  
  // Render folder item
  const renderFolderItem = (folder) => (
    <div 
      key={folder.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleFolderClick(folder)}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-blue-100 mr-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{folder.name}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span>{folder.itemCount} items</span>
            <span className="mx-2">•</span>
            <span>Updated {new Date(folder.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render asset item for grid view
  const renderAssetGridItem = (asset) => {
    let thumbnailContent;
    
    if (asset.type === 'image') {
      thumbnailContent = <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />;
    } else if (asset.type === 'document') {
      thumbnailContent = (
        <div className="w-full h-full bg-red-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    } else if (asset.type === 'video') {
      thumbnailContent = (
        <div className="w-full h-full bg-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      );
    } else {
      thumbnailContent = (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
      );
    }
    
    return (
      <div 
        key={asset.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleAssetClick(asset)}
      >
        <div className="h-40 w-full overflow-hidden">
          {thumbnailContent}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{asset.name}</h3>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="uppercase">{asset.extension}</span>
            <span className="mx-2">•</span>
            <span>{asset.fileSize}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Render asset item for list view
  const renderAssetListItem = (asset) => {
    let iconContent;
    
    if (asset.type === 'image') {
      iconContent = (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    } else if (asset.type === 'document') {
      iconContent = (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
    } else if (asset.type === 'video') {
      iconContent = (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
    } else {
      iconContent = (
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    }
    
    return (
      <div 
        key={asset.id}
        className="bg-white border-b border-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
        onClick={() => handleAssetClick(asset)}
      >
        <div className="p-2 rounded-lg bg-gray-100 mr-3">
          {iconContent}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{asset.name}</h3>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="uppercase">{asset.extension}</span>
            <span className="mx-2">•</span>
            <span>{asset.fileSize}</span>
            <span className="mx-2">•</span>
            <span>Updated {new Date(asset.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-gray-400 hover:text-gray-600 ml-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="flex mb-5">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <li className="text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </li>
              )}
              <li>
                <a 
                  href={crumb.path} 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(crumb.path);
                  }} 
                  className={`
                    text-sm hover:text-blue-600
                    ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {crumb.name}
                </a>
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
      
      {/* Folder header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentFolder ? currentFolder.name : 'All Files'}
        </h1>
        
        <div className="flex space-x-2">
          <Button onClick={handleCreateFolder} variant="secondary" className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Folder
          </Button>
          
          <Button onClick={handleUploadAsset} className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Upload
          </Button>
          
          <button 
            onClick={toggleView} 
            className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {view === 'grid' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
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
      
      {/* Empty state */}
      {!loading && !error && folders.length === 0 && assets.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No files or folders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new folder or uploading a file
          </p>
          <div className="mt-6 space-x-3">
            <Button onClick={handleCreateFolder} variant="secondary" className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Folder
            </Button>
            <Button onClick={handleUploadAsset} className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Upload
            </Button>
          </div>
        </div>
      )}
      
      {/* Content */}
      {!loading && !error && (folders.length > 0 || assets.length > 0) && (
        <>
          {/* Folders */}
          {folders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Folders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map(folder => renderFolderItem(folder))}
              </div>
            </div>
          )}
          
          {/* Assets */}
          {assets.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Assets</h2>
              
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {assets.map(asset => renderAssetGridItem(asset))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {assets.map(asset => renderAssetListItem(asset))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FolderView;