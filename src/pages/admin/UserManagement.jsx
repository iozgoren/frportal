// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import userService from '../../services/userService';

// Mock data for development
const mockUsers = [
  { 
    id: 'user1', 
    name: 'John Smith', 
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-10-01T14:30:00',
    createdAt: '2023-01-15T09:00:00',
    permissions: ['full_access']
  },
  { 
    id: 'user2', 
    name: 'Emma Johnson', 
    email: 'emma@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2023-09-28T11:15:00',
    createdAt: '2023-03-22T10:30:00',
    permissions: ['create', 'edit', 'delete']
  },
  { 
    id: 'user3', 
    name: 'Michael Brown', 
    email: 'michael@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2023-08-15T16:45:00',
    createdAt: '2023-06-10T14:20:00',
    permissions: ['view']
  },
  { 
    id: 'user4', 
    name: 'Olivia Davis', 
    email: 'olivia@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2023-09-29T09:10:00',
    createdAt: '2023-04-05T11:45:00',
    permissions: ['create', 'edit']
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  
  // Form state for add/edit user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
    password: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await userService.getUsers();
        setUsers(response.users || response);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Kullanıcılar yüklenirken hata oluştu.');
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          setUsers(mockUsers);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Open add user modal
  const handleAddUser = () => {
    // Reset form data
    setFormData({
      name: '',
      email: '',
      role: 'Viewer',
      status: 'Active',
      password: '',
      confirmPassword: ''
    });
    setEditUser(null);
    setShowAddUserModal(true);
  };
  
  // Open edit user modal
  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      confirmPassword: ''
    });
    setEditUser(user);
    setShowAddUserModal(true);
  };
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!editUser && (!formData.password || formData.password !== formData.confirmPassword)) {
      alert('Passwords do not match or are empty');
      return;
    }
    
    try {
      if (editUser) {
        // Update existing user
        // In a real application, this would be an API call
        // await api.put(`/api/users/${editUser.id}`, formData);
        
        // Update user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === editUser.id 
              ? { ...user, ...formData } 
              : user
          )
        );
      } else {
        // Create new user
        // In a real application, this would be an API call
        // const response = await api.post('/api/users', formData);
        // const newUser = response.data;
        
        // Create mock user
        const newUser = {
          id: `user${users.length + 1}`,
          ...formData,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          permissions: formData.role === 'Admin' 
            ? ['full_access'] 
            : formData.role === 'Editor' 
              ? ['create', 'edit', 'delete'] 
              : ['view']
        };
        
        // Add new user to the local state
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
      
      // Close modal
      setShowAddUserModal(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // In a real application, this would be an API call
      // await api.delete(`/api/users/${userId}`);
      
      // Remove user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // If the user was selected, remove from selection
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(prevSelected => prevSelected.filter(id => id !== userId));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };
  
  // Handle bulk action (delete selected)
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) return;
    
    try {
      // In a real application, this would be an API call
      // await Promise.all(selectedUsers.map(id => api.delete(`/api/users/${id}`)));
      
      // Remove users from the local state
      setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
      
      // Clear selection
      setSelectedUsers([]);
    } catch (err) {
      console.error('Error deleting users:', err);
      alert('Failed to delete users. Please try again.');
    }
  };
  
  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };
  
  // Toggle select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      
      {/* Actions & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="space-x-2">
          <Button onClick={handleAddUser} className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add User
          </Button>
          
          {selectedUsers.length > 0 && (
            <Button 
              onClick={handleBulkDelete} 
              variant="danger" 
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
        </div>
        
        <div className="w-full sm:w-64">
          <Input
            id="search-users"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            }
          />
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading users...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* User table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : ''}
                        ${user.role === 'Editor' ? 'bg-blue-100 text-blue-800' : ''}
                        ${user.role === 'Viewer' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                        ${user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : ''}
                        ${user.status === 'Suspended' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString() + ' ' + 
                          new Date(user.lastLogin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : 'Never'
                      }
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {users.length === 0 ? 'No users found' : 'No matching users'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {users.length === 0 
              ? 'Get started by creating a new user'
              : 'Try adjusting your search criteria'
            }
          </p>
          {users.length === 0 && (
            <div className="mt-6">
              <Button onClick={handleAddUser} className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add User
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editUser ? 'Edit User' : 'Add New User'}
                      </h3>
                      
                      <div className="mt-4">
                        <Input 
                          id="name"
                          name="name"
                          label="Name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          fullWidth
                        />
                        
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          label="Email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          fullWidth
                        />
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleFormChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="Viewer">Viewer</option>
                            <option value="Editor">Editor</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                        
                        {!editUser && (
                          <>
                            <Input 
                              id="password"
                              name="password"
                              type="password"
                              label="Password"
                              value={formData.password}
                              onChange={handleFormChange}
                              required
                              fullWidth
                            />
                            
                            <Input 
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              label="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleFormChange}
                              required
                              fullWidth
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    {editUser ? 'Save Changes' : 'Add User'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddUserModal(false)}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;