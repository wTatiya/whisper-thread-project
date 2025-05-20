
import React, { useState } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState('');

  const handleLoginSuccess = (username: string) => {
    setCurrentAdmin(username);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="whistleblower-container">
        {!isLoggedIn ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AdminDashboard currentAdmin={currentAdmin} />
        )}
      </div>
    </div>
  );
};

export default Admin;
