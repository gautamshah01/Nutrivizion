import React from 'react';

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminInfo = localStorage.getItem('adminInfo');

  console.log('AdminProtectedRoute check:', { 
    hasToken: !!adminToken, 
    hasInfo: !!adminInfo,
    token: adminToken?.substring(0, 10) + '...' // Log partial token for debugging
  });

  // If no admin credentials, redirect to login
  if (!adminToken || !adminInfo) {
    window.location.href = '/admin/login';
    return <div>Redirecting to login...</div>;
  }

  // If credentials exist, render the protected component
  return children;
};

export default AdminProtectedRoute;