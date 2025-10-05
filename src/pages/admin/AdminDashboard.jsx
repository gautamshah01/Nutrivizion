import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/logo.css';

// Component imports
import DashboardOverview from './components/DashboardOverview';
import NutritionistApproval from './components/NutritionistApproval';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminInfo, setAdminInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminUser');

    console.log('Admin auth check:', { token: !!token, info: !!info });

    if (!token) {
      console.log('No admin token found, redirecting to login');
      navigate('/login');
      return;
    }

    if (!info) {
      console.log('No admin info found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const parsedInfo = JSON.parse(info);
      console.log('Admin info parsed successfully:', parsedInfo);
      setAdminInfo(parsedInfo);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing admin info:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'approval', name: 'Nutritionist Approval', icon: '✅' }
  ];

  const renderActiveComponent = () => {
    try {
      switch (activeTab) {
        case 'overview':
          return <DashboardOverview />;
        case 'approval':
          return <NutritionistApproval />;
        default:
          return <DashboardOverview />;
      }
    } catch (error) {
      console.error('Error rendering admin component:', error);
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">Component Error</h3>
            <p className="text-red-600 mt-2">There was an error loading this section. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900"><span className="nutrivizion-text">nutrivizion</span> Admin</h1>
              <p className="text-sm text-gray-600">Platform Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminInfo?.name}</p>
              <p className="text-xs text-gray-600">{adminInfo?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="mt-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;