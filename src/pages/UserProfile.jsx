// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    theme: 'light',
    notificationsEnabled: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        theme: user.preferences?.theme || 'light',
        notificationsEnabled: user.preferences?.notifications ?? true,
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleAvatarChange = (e) => {
    if (e.target.files?.length) {
      setFormData(prevState => ({
        ...prevState,
        avatar: e.target.files[0],
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // In a real application, this would be an API call
      // const formDataObj = new FormData();
      // formDataObj.append('name', formData.name);
      // formDataObj.append('email', formData.email);
      // if (formData.password) formDataObj.append('password', formData.password);
      // if (formData.avatar) formDataObj.append('avatar', formData.avatar);
      // formDataObj.append('preferences', JSON.stringify({
      //   theme: formData.theme,
      //   notifications: formData.notificationsEnabled,
      // }));
      // const response = await api.put('/api/users/profile', formDataObj);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the user in Redux store
      dispatch(setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        preferences: {
          theme: formData.theme,
          notifications: formData.notificationsEnabled,
        },
      }));
      
      setMessage('Profile updated successfully');
      
      // Reset password fields
      setFormData(prevState => ({
        ...prevState,
        password: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center">
                <div className="relative inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 mr-4">
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Change
                  </label>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG, or GIF up to 1MB</p>
                </div>
              </div>
            </div>
            
            {/* Personal information */}
            <Input
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                readOnly
                disabled
                className="w-full rounded-md shadow-sm border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-2 border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="New Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            <div className="md:col-span-2 border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                
                <div className="flex items-center h-10 mt-6">
                  <input
                    id="notificationsEnabled"
                    name="notificationsEnabled"
                    type="checkbox"
                    checked={formData.notificationsEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;