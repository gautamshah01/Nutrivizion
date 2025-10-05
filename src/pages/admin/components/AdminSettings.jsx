import { useState, useEffect } from 'react'
import { Settings, Database, Shield, Bell, Mail, Globe, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'
import '../../../styles/logo.css'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [platformSettings, setPlatformSettings] = useState({
    commissionRate: 15,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,png,pdf',
    maintenanceMode: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem('adminInfo');
    if (info) {
      setAdminInfo(JSON.parse(info));
    }
  }, []);

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password updated successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    } finally {
      setIsLoading(false);
    }
  };

  const savePlatformSettings = async () => {
    setIsLoading(true);
    try {
      // Mock save - replace with actual API call
      console.log('Saving platform settings:', platformSettings);
      alert('Platform settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const AccountTab = () => (
    <div className="space-y-6">
      {/* Admin Profile */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={adminInfo.name}
              onChange={(e) => setAdminInfo({...adminInfo, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={adminInfo.email}
              onChange={(e) => setAdminInfo({...adminInfo, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={adminInfo.role}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={updatePassword}
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PlatformTab = () => (
    <div className="space-y-6">
      {/* Platform Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={platformSettings.commissionRate}
              onChange={(e) => setPlatformSettings({...platformSettings, commissionRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Platform commission on each consultation</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={platformSettings.maxFileSize}
              onChange={(e) => setPlatformSettings({...platformSettings, maxFileSize: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <input
              type="text"
              value={platformSettings.allowedFileTypes}
              onChange={(e) => setPlatformSettings({...platformSettings, allowedFileTypes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="jpg,png,pdf"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated file extensions</p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={platformSettings.maintenanceMode}
              onChange={(e) => setPlatformSettings({...platformSettings, maintenanceMode: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Enable Maintenance Mode
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={savePlatformSettings}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Version</p>
            <p className="text-lg text-gray-900"><span className="nutrivizion-text">nutrivizion</span> v1.0.0</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Environment</p>
            <p className="text-lg text-gray-900">Development</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Database</p>
            <p className="text-lg text-gray-900">MongoDB Connected</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Last Backup</p>
            <p className="text-lg text-gray-900">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and platform configuration</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'account', name: 'Account Settings', icon: '👤' },
              { id: 'platform', name: 'Platform Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'platform' && <PlatformTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;