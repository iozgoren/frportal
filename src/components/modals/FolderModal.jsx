// src/components/modals/FolderModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeFolderModal } from '../../store/slices/uiSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const FolderModal = () => {
  const dispatch = useDispatch();
  const { folderModalData } = useSelector(state => state.ui);
  
  // Form state
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [parentFolder, setParentFolder] = useState('root');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isEditMode = !!folderModalData?.id;
  
  // Mock folder data for parent selection
  const availableFolders = [
    { id: 'root', name: 'Root' },
    { id: 'folder1', name: 'Marketing Assets' },
    { id: 'folder2', name: 'Brand Guidelines' },
    { id: 'folder3', name: 'Social Media Content' },
  ];
  
  // Initialize form with folder data if editing
  useEffect(() => {
    if (isEditMode) {
      setFolderName(folderModalData.name || '');
      setDescription(folderModalData.description || '');
      setParentFolder(folderModalData.parentId || 'root');
    } else {
      // Set default values for new folder
      setFolderName('');
      setDescription('');
      setParentFolder(folderModalData?.parentId || 'root');
    }
  }, [folderModalData, isEditMode]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // const endpoint = isEditMode ? `/api/folders/${folderModalData.id}` : '/api/folders';
      // const method = isEditMode ? 'put' : 'post';
      // const folderData = { name: folderName, description, parentId: parentFolder };
      // const response = await api[method](endpoint, folderData);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Close the modal on success
      dispatch(closeFolderModal());
      
      // In a real application, you would also update the folders in your state
      
    } catch (err) {
      console.error('Error saving folder:', err);
      setError(err.response?.data?.message || 'Failed to save folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    dispatch(closeFolderModal());
  };
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isEditMode ? 'Edit Folder' : 'Create New Folder'}
                  </h3>
                  
                  <div className="mt-4">
                    {error && (
                      <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        {error}
                      </div>
                    )}
                    
                    <Input
                      id="folder-name"
                      name="folderName"
                      label="Folder Name"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      required
                      fullWidth
                    />
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Add a description for this folder"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="parent-folder" className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Folder
                      </label>
                      <select
                        id="parent-folder"
                        name="parentFolder"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={parentFolder}
                        onChange={(e) => setParentFolder(e.target.value)}
                      >
                        {availableFolders.map(folder => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto sm:ml-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Saving...' : 'Creating...'}
                  </>
                ) : isEditMode ? 'Save Changes' : 'Create Folder'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FolderModal;