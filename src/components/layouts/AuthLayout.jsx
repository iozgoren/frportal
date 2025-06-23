// src/components/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { loading } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <img
              className="mx-auto h-16 w-auto"
              src="https://placehold.co/80x80/3B82F6/FFFFFF?text=FR"
              alt="FR Portal Logo"
            />
          </Link>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            International Franchise Portal
          </h2>
        </div>

        {/* Render the nested routes */}
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FR Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;