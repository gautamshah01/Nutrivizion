import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component imports
import DashboardOverview from './components/DashboardOverview';
import NutritionistManagement from './components/NutritionistManagement';
import PatientManagement from './components/PatientManagement';
import AppointmentOverview from './components/AppointmentOverview';
import PaymentsEarnings from './components/PaymentsEarnings';
import VerificationSystem from './components/VerificationSystem';
import NotificationsBroadcast from './components/NotificationsBroadcast';
import AdminSettings from './components/AdminSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminInfo, setAdminInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');

    if (!token || !info) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminInfo(JSON.parse(info));
    } catch (error) {
      console.error('Error parsing admin info:', error);
      navigate('/admin/login');
      return;
    }

    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'nutritionists', name: 'Nutritionists', icon: '🧑‍⚕️' },
    { id: 'patients', name: 'Patients', icon: '👤' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'verification', name: 'Verification', icon: '📁' },
    { id: 'notifications', name: 'Notifications', icon: '📢' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'nutritionists':
        return <NutritionistManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'appointments':
        return <AppointmentOverview />;
      case 'payments':
        return <PaymentsEarnings />;
      case 'verification':
        return <VerificationSystem />;
      case 'notifications':
        return <NotificationsBroadcast />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardOverview />;
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
              <h1 className="text-2xl font-bold text-gray-900">NutriVision Admin</h1>
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
