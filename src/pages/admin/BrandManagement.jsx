// src/pages/admin/BrandManagement.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Mock data for development
const mockBrands = [
  { 
    id: 'brand1', 
    name: 'Global Franchise Co.', 
    logo: 'https://placehold.co/200x200/4F46E5/FFFFFF?text=GF',
    status: 'Active',
    country: 'United States',
    assetsCount: 47,
    createdAt: '2023-01-15T09:00:00'
  },
  { 
    id: 'brand2', 
    name: 'Euro Partners Ltd.', 
    logo: 'https://placehold.co/200x200/EF4444/FFFFFF?text=EP',
    status: 'Active',
    country: 'United Kingdom',
    assetsCount: 32,
    createdAt: '2023-02-22T10:30:00'
  },
  { 
    id: 'brand3', 
    name: 'Asia Franchise Network', 
    logo: 'https://placehold.co/200x200/10B981/FFFFFF?text=AF',
    status: 'Inactive',
    country: 'Singapore',
    assetsCount: 15,
    createdAt: '2023-03-10T14:20:00'
  },
  { 
    id: 'brand4', 
    name: 'Latin America Holdings', 
    logo: 'https://placehold.co/200x200/F59E0B/FFFFFF?text=LA',
    status: 'Active',
    country: 'Brazil',
    assetsCount: 28,
    createdAt: '2023-04-05T11:45:00'
  }
];

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  
  // Form state for add/edit brand
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    status: 'Active',
    logo: null
  });
  
  useEffect(() => {
    // Fetch brands
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // const response = await api.get('/api/brands');
        // setBrands(response.data);
        
        // Mock API response using timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        setBrands(mockBrands);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Open add brand modal
  const handleAddBrand = () => {
    // Reset form data
    setFormData({
      name: '',
      country: '',
      status: 'Active',
      logo: null
    });
    setEditBrand(null);
    setShowAddBrandModal(true);
  };
  
  // Open edit brand modal
  const handleEditBrand = (brand) => {
    setFormData({
      name: brand.name,
      country: brand.country,
      status: brand.status,
      logo: null // Cannot set the logo from a URL
    });
    setEditBrand(brand);
    setShowAddBrandModal(true);
  };
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle logo upload
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files[0] }));
    }
  };
  
  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (editBrand) {
        // Update existing brand
        // In a real application, this would be an API call
        // await api.put(`/api/brands/${editBrand.id}`, formData);
        
        // Update brand in the local state
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === editBrand.id 
              ? { 
                  ...brand, 
                  name: formData.name,
                  country: formData.country,
                  status: formData.status,
                  // In a real app, we would update the logo if a new one was uploaded
                } 
              : brand
          )
        );
      } else {
        // Create new brand
        // In a real application, this would be an API call
        // const response = await api.post('/api/brands', formData);
        // const newBrand = response.data;
        
        // Create mock brand
        const newBrand = {
          id: `brand${brands.length + 1}`,
          ...formData,
          logo: formData.logo ? URL.createObjectURL(formData.logo) : 'https://placehold.co/200x200/3B82F6/FFFFFF?text=New',
          assetsCount: 0,
          createdAt: new Date().toISOString()
        };
        
        // Add new brand to the local state
        setBrands(prevBrands => [...prevBrands, newBrand]);
      }
      
      // Close modal
      setShowAddBrandModal(false);
    } catch (err) {
      console.error('Error saving brand:', err);
      alert('Failed to save brand. Please try again.');
    }
  };
  
  // Handle brand deletion
  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      // In a real application, this would be an API call
      // await api.delete(`/api/brands/${brandId}`);
      
      // Remove brand from the local state
      setBrands(prevBrands => prevBrands.filter(brand => brand.id !== brandId));
      
      // If the brand was selected, remove from selection
      if (selectedBrands.includes(brandId)) {
        setSelectedBrands(prevSelected => prevSelected.filter(id => id !== brandId));
      }
    } catch (err) {
      console.error('Error deleting brand:', err);
      alert('Failed to delete brand. Please try again.');
    }
  };
  
  // Handle bulk action (delete selected)
  const handleBulkDelete = async () => {
    if (selectedBrands.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedBrands.length} selected brands?`)) return;
    
    try {
      // In a real application, this would be an API call
      // await Promise.all(selectedBrands.map(id => api.delete(`/api/brands/${id}`)));
      
      // Remove brands from the local state
      setBrands(prevBrands => prevBrands.filter(brand => !selectedBrands.includes(brand.id)));
      
      // Clear selection
      setSelectedBrands([]);
    } catch (err) {
      console.error('Error deleting brands:', err);
      alert('Failed to delete brands. Please try again.');
    }
  };
  
  // Toggle brand selection
  const toggleBrandSelection = (brandId) => {
    setSelectedBrands(prevSelected => 
      prevSelected.includes(brandId)
        ? prevSelected.filter(id => id !== brandId)
        : [...prevSelected, brandId]
    );
  };
  
  // Toggle select all brands
  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands.map(brand => brand.id));
    }
  };
  
  // Filter brands by search query
  const filteredBrands = brands.filter(brand => {
    const query = searchQuery.toLowerCase();
    return (
      brand.name.toLowerCase().includes(query) ||
      brand.country.toLowerCase().includes(query) ||
      brand.status.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Brand Management</h1>
      
      {/* Actions & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="space-x-2">
          <Button onClick={handleAddBrand} className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Brand
          </Button>
          
          {selectedBrands.length > 0 && (
            <Button 
              onClick={handleBulkDelete} 
              variant="danger" 
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Selected ({selectedBrands.length})
            </Button>
          )}
        </div>
        
        <div className="w-full sm:w-64">
          <Input
            id="search-brands"
            placeholder="Search brands..."
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
          <span className="text-lg font-medium text-gray-700">Loading brands...</span>
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
      
      {/* Brand grid */}
      {!loading && !error && filteredBrands.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map(brand => (
            <div 
              key={brand.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => toggleBrandSelection(brand.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ml-3"
                    />
                  </div>
                  <div className="flex space-x-2 px-3 py-1">
                    <button
                      onClick={() => handleEditBrand(brand)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center py-4">
                  <div 
                    className="h-24 w-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
                  >
                    {brand.logo ? (
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="text-3xl font-bold text-gray-300">
                        {brand.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{brand.name}</h3>
                  <div className="text-sm text-gray-500 mb-3">{brand.country}</div>
                  
                  <div className="flex justify-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${brand.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {brand.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {brand.assetsCount} assets
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Added: {new Date(brand.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && filteredBrands.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {brands.length === 0 ? 'No brands found' : 'No matching brands'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {brands.length === 0 
              ? 'Get started by creating a new brand'
              : 'Try adjusting your search criteria'
            }
          </p>
          {brands.length === 0 && (
            <div className="mt-6">
              <Button onClick={handleAddBrand} className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Brand
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Add/Edit Brand Modal */}
      {showAddBrandModal && (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editBrand ? 'Edit Brand' : 'Add New Brand'}
                      </h3>
                      
                      <div className="mt-4">
                        <Input 
                          id="name"
                          name="name"
                          label="Brand Name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          fullWidth
                        />
                        
                        <Input 
                          id="country"
                          name="country"
                          label="Country"
                          value={formData.country}
                          onChange={handleFormChange}
                          required
                          fullWidth
                        />
                        
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
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo
                          </label>
                          <div className="flex items-center">
                            <div className="h-16 w-16 overflow-hidden bg-gray-100 rounded-full mr-4 flex items-center justify-center">
                              {formData.logo ? (
                                <img 
                                  src={URL.createObjectURL(formData.logo)} 
                                  alt="Logo preview" 
                                  className="h-full w-full object-cover"
                                />
                              ) : editBrand?.logo ? (
                                <img 
                                  src={editBrand.logo} 
                                  alt="Current logo" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-gray-300">
                                  {formData.name ? formData.name.charAt(0) : '?'}
                                </div>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label htmlFor="logo-upload" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                              {editBrand ? 'Change Logo' : 'Upload Logo'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    {editBrand ? 'Save Changes' : 'Add Brand'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddBrandModal(false)}
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

export default BrandManagement;