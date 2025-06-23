// src/components/features/AssetFilters.jsx
import React, { useState, useEffect, useRef } from 'react';

const AssetFilters = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    fileType: [],
    dateRange: {
      start: null,
      end: null
    },
    tags: [],
    sort: 'newest'
  });
  
  const filterPanelRef = useRef(null);
  const sortPanelRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortPanelRef.current && !sortPanelRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Apply filters when search or filters change
  useEffect(() => {
    // Debounce search to avoid too many filter operations
    const handler = setTimeout(() => {
      onFilterChange({ ...filters, search });
    }, 300);
    
    return () => clearTimeout(handler);
  }, [search, filters, onFilterChange]);
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const handleFileTypeToggle = (type) => {
    const updatedTypes = filters.fileType.includes(type)
      ? filters.fileType.filter(t => t !== type)
      : [...filters.fileType, type];
    
    setFilters({ ...filters, fileType: updatedTypes });
  };
  
  const handleDateRangeChange = (field, value) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };
  
  const handleSortChange = (sortValue) => {
    setFilters({ ...filters, sort: sortValue });
    setIsSortOpen(false);
  };
  
  const clearFilters = () => {
    setSearch('');
    setFilters({
      fileType: [],
      dateRange: { start: null, end: null },
      tags: [],
      sort: 'newest'
    });
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search assets..."
            className="block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterPanelRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center px-4 py-2 border ${filters.fileType.length > 0 || filters.dateRange.start || filters.dateRange.end ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 bg-white'} text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {(filters.fileType.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  {filters.fileType.length + (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0)}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">File Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: 'image', label: 'Images' }, { id: 'document', label: 'Documents' }, { id: 'video', label: 'Videos' }, { id: 'audio', label: 'Audio' }].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleFileTypeToggle(type.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${filters.fileType.includes(type.id) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Date Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="date-from" className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        id="date-from"
                        type="date"
                        value={filters.dateRange.start || ''}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="date-to" className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        id="date-to"
                        type="date"
                        value={filters.dateRange.end || ''}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex justify-between">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortPanelRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Sort
              {filters.sort !== 'newest' && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">1</span>
              )}
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  {[
                    { id: 'newest', label: 'Newest first' },
                    { id: 'oldest', label: 'Oldest first' },
                    { id: 'az', label: 'Name (A-Z)' },
                    { id: 'za', label: 'Name (Z-A)' },
                    { id: 'size-asc', label: 'Size (smallest first)' },
                    { id: 'size-desc', label: 'Size (largest first)' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`block w-full text-left px-4 py-2 text-sm ${filters.sort === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleSortChange(option.id)}
                    >
                      {option.label}
                      {filters.sort === option.id && (
                        <svg className="h-4 w-4 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {(filters.fileType.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {filters.fileType.map(type => {
            const label = {
              'image': 'Images',
              'document': 'Documents',
              'video': 'Videos',
              'audio': 'Audio'
            }[type];
            
            return (
              <span key={type} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                {label}
                <button 
                  type="button" 
                  onClick={() => handleFileTypeToggle(type)}
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            );
          })}
          
          {filters.dateRange.start && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              From: {new Date(filters.dateRange.start).toLocaleDateString()}
              <button 
                type="button" 
                onClick={() => handleDateRangeChange('start', null)}
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.dateRange.end && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              To: {new Date(filters.dateRange.end).toLocaleDateString()}
              <button 
                type="button" 
                onClick={() => handleDateRangeChange('end', null)}
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          
          <button 
            type="button" 
            onClick={clearFilters}
            className="text-xs text-gray-600 hover:text-gray-900 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetFilters;