// src/components/modals/ShareAssetModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeShareModal } from '../../store/slices/uiSlice';
import Button from '../common/Button';

const ShareAssetModal = () => {
  const dispatch = useDispatch();
  const { shareModalData } = useSelector(state => state.ui);
  
  // Form state
  const [email, setEmail] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permission, setPermission] = useState('view');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Mock user data
  const suggestedUsers = [
    { id: 'user1', name: 'John Smith', email: 'john.smith@example.com', avatar: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=JS' },
    { id: 'user2', name: 'Emma Johnson', email: 'emma.johnson@example.com', avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=EJ' },
    { id: 'user3', name: 'Alex Rodriguez', email: 'alex.rodriguez@example.com', avatar: 'https://placehold.co/40x40/EF4444/FFFFFF?text=AR' },
    { id: 'user4', name: 'Sarah Williams', email: 'sarah.williams@example.com', avatar: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=SW' }
  ];

  // Permission options
  const permissions = [
    { value: 'view', label: 'Can View' },
    { value: 'comment', label: 'Can Comment' },
    { value: 'edit', label: 'Can Edit' }
  ];
  
  const assetInfo = shareModalData?.asset || { name: 'Selected Asset', type: 'document' };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (selectedUsers.length === 0 && !email.trim()) {
      setError('Please enter an email or select a user to share with');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, you would make API calls here
      // const shareData = {
      //   assetId: shareModalData.assetId,
      //   users: [
      //     ...selectedUsers.map(user => ({ userId: user.id, permission })),
      //     ...(email.trim() ? [{ email: email.trim(), permission }] : [])
      //   ],
      //   message: message.trim() || undefined
      // };
      // await api.post('/assets/share', shareData);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      setSuccess(true);
      setEmail('');
      setMessage('');
      
      // After a delay, close the modal
      setTimeout(() => {
        dispatch(closeShareModal());
      }, 1500);
      
    } catch (err) {
      console.error('Error sharing asset:', err);
      setError(err.response?.data?.message || 'Failed to share asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a user from suggestions
  const handleAddUser = (user) => {
    if (!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setEmail('');
  };
  
  // Handle removing a selected user
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };
  
  // Handle close modal
  const handleClose = () => {
    dispatch(closeShareModal());
  };
  
  // Filter suggestions based on input
  const filteredSuggestions = email.trim() !== '' 
    ? suggestedUsers.filter(user => 
        user.name.toLowerCase().includes(email.toLowerCase()) || 
        user.email.toLowerCase().includes(email.toLowerCase())
      )
    : [];
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {success ? (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Asset Shared Successfully
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      The asset "{assetInfo.name}" has been shared successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Share "{assetInfo.name}"
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      {error && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                          {error}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Share with
                        </label>
                        
                        {/* Selected users */}
                        {selectedUsers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {selectedUsers.map(user => (
                              <div 
                                key={user.id}
                                className="flex items-center bg-blue-50 rounded-full pl-1 pr-2 py-1 text-sm"
                              >
                                <img 
                                  src={user.avatar} 
                                  alt={user.name}
                                  className="h-5 w-5 rounded-full mr-1"
                                />
                                <span className="text-blue-800">{user.name}</span>
                                <button
                                  type="button"
                                  className="ml-1 text-blue-400 hover:text-blue-600"
                                  onClick={() => handleRemoveUser(user.id)}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Email input */}
                        <div className="relative">
                          <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email or name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          
                          {/* Suggestions dropdown */}
                          {filteredSuggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto">
                              <ul className="divide-y divide-gray-200">
                                {filteredSuggestions.map(user => (
                                  <li 
                                    key={user.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => handleAddUser(user)}
                                  >
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="h-6 w-6 rounded-full mr-2"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Permission selector */}
                      <div>
                        <label htmlFor="permission" className="block text-sm font-medium text-gray-700">
                          Permission level
                        </label>
                        <select
                          id="permission"
                          name="permission"
                          value={permission}
                          onChange={(e) => setPermission(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {permissions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Message input (optional) */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Message (optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="2"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a message"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="submit"
                  disabled={loading || (selectedUsers.length === 0 && !email.trim())}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sharing...
                    </>
                  ) : 'Share'}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareAssetModal;