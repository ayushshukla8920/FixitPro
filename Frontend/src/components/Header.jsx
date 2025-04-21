import React from 'react';
import { useAuth } from '../context/Usercontext';

const Header = () => {
  const { token, user, logout } = useAuth();
  const isLoggedIn = !!token;

  const renderLinksByRole = () => {
    if (!user) return null;
    
    switch (user.role) {
      case "customer":
        return (
          <>
            <a href="/customer/dashboard" className="hover:text-blue-200">Dashboard</a>
            <a href="/customer/request" className="hover:text-blue-200">New Request</a>
          </>
        );
      case "technician":
        return (
          <>
            <a href="/technician/dashboard" className="hover:text-blue-200">Dashboard</a>
          </>
        );
      case "admin":
        return (
          <>
            <a href="/admin/dashboard" className="hover:text-blue-200">Dashboard</a>
            <a href="/admin/requests" className="hover:text-blue-200">Requests</a>
            <a href="/admin/technicians" className="hover:text-blue-200">Technicians</a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full bg-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className='flex items-center gap-5'>
          <img src="/icon.png" className='h-12 w-12' alt="Appliance Repair Logo" />
          <a href="/" className="text-2xl font-bold">Appliance Repair</a>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-200">Home</a>
          {isLoggedIn && renderLinksByRole()}
          <a href="/about" className="hover:text-blue-200">About</a>
          <a href="/contact" className="hover:text-blue-200">Contact</a>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="hidden md:inline">Welcome, {user.first_name || 'Guest'}</span>
              <button 
                onClick={logout} 
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg">Login</a>
              <a href="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg">Register</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;