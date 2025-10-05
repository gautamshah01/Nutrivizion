import React, { useState, useEffect } from 'react';

const NotificationsBroadcast = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    priority: 'normal',
    type: 'general'
  });

  useEffect(() => {
    fetchNotificationHistory();
    fetchTemplates();
    fetchAlerts();
  }, []);

  const fetchNotificationHistory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/notifications/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.notifications);
      } else {
        // Mock data
        setNotifications([
          {
            id: 1,
            title: 'System Maintenance',
            message: 'Scheduled maintenance tonight',
            targetAudience: 'all',
            recipientCount: 1250,
            sentAt: new Date(),
            status: 'sent',
            deliveryStats: { sent: 1250, delivered: 1180, failed: 70 }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/notifications/templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/notifications/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data.data.alerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const sendNotification = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newNotification)
      });

      if (response.ok) {
        setNewNotification({
          title: '',
          message: '',
          targetAudience: 'all',
          priority: 'normal',
          type: 'general'
        });
        await fetchNotificationHistory();
        alert('Notification sent successfully!');
      } else {
        alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    } finally {
      setIsLoading(false);
    }
  };

  const SendNotificationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send New Notification</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notification title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notification message..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select
                value={newNotification.targetAudience}
                onChange={(e) => setNewNotification({...newNotification, targetAudience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="patients">Patients Only</option>
                <option value="nutritionists">Nutritionists Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newNotification.priority}
                onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="promotion">Promotion</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={sendNotification}
              disabled={isLoading || !newNotification.title || !newNotification.message}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notification History</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{notification.title}</h4>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Target: {notification.targetAudience}</span>
                  <span>Recipients: {notification.recipientCount}</span>
                  <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="ml-4">
                {notification.deliveryStats && (
                  <div className="text-right text-sm">
                    <div className="text-green-600">Delivered: {notification.deliveryStats.delivered}</div>
                    <div className="text-red-600">Failed: {notification.deliveryStats.failed}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AlertsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-6">
            <div className="flex items-start space-x-3">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                alert.severity === 'urgent' ? 'bg-red-500' :
                alert.severity === 'high' ? 'bg-orange-500' :
                alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                <p className="text-gray-600 mt-1">{alert.message}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Severity: {alert.severity}</span>
                  <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Notifications & Broadcast</h2>
        <p className="text-gray-600 mt-1">Send notifications to users and monitor system alerts</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'send', name: 'Send Notification', icon: '📤' },
              { id: 'history', name: 'History', icon: '📋' },
              { id: 'alerts', name: 'System Alerts', icon: '🚨' }
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
          {activeTab === 'send' && <SendNotificationTab />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'alerts' && <AlertsTab />}
        </div>
      </div>
    </div>
  );
};

export default NotificationsBroadcast;