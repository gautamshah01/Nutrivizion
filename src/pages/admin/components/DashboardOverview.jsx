import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    overview: {
      totalPatients: 0,
      totalNutritionists: 0,
      activeNutritionists: 0,
      pendingVerifications: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      totalEarnings: 0,
      thisWeekEarnings: 0
    },
    weeklyActivity: {
      newPatients: 0,
      newNutritionists: 0,
      appointments: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change} this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <span className="text-blue-600 font-medium">Send Notification</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
          <span className="text-green-600 font-medium">Export Reports</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
          <span className="text-purple-600 font-medium">View Analytics</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
          <span className="text-orange-600 font-medium">System Settings</span>
        </button>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[
          { type: 'user', message: 'New patient registration: John Doe', time: '5 minutes ago', color: 'green' },
          { type: 'nutritionist', message: 'Nutritionist verification completed: Dr. Smith', time: '15 minutes ago', color: 'blue' },
          { type: 'appointment', message: '3 new appointments scheduled today', time: '1 hour ago', color: 'purple' },
          { type: 'payment', message: 'Payment processed: ₹1150.00', time: '2 hours ago', color: 'green' },
          { type: 'system', message: 'System backup completed successfully', time: '3 hours ago', color: 'gray' }
        ].map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-2`}></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-200 rounded-lg h-64"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.overview.totalPatients.toLocaleString()}
          change={stats.weeklyActivity.newPatients}
          icon="👤"
          color="blue"
        />
        <StatCard
          title="Active Nutritionists"
          value={stats.overview.activeNutritionists.toLocaleString()}
          icon="🧑‍⚕️"
          color="green"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.overview.todayAppointments.toLocaleString()}
          icon="📅"
          color="purple"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${stats.overview.totalEarnings.toLocaleString()}`}
          change={`₹${stats.overview.thisWeekEarnings}`}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Verifications"
          value={stats.overview.pendingVerifications.toLocaleString()}
          icon="📁"
          color="orange"
        />
        <StatCard
          title="Total Appointments"
          value={stats.overview.totalAppointments.toLocaleString()}
          change={stats.weeklyActivity.appointments}
          icon="📊"
          color="indigo"
        />
        <StatCard
          title="This Week Earnings"
          value={`₹${stats.overview.thisWeekEarnings.toLocaleString()}`}
          icon="📈"
          color="green"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">API Server: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Database: Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Storage: 85% Used</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;