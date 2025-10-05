import React, { useState, useEffect } from 'react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams(filters).toString();
      
      const response = await fetch(`/api/admin/dashboard/patients?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data.patients);
      } else {
        console.error('Failed to fetch patients');
        // Mock data for development
        setPatients([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            isActive: true,
            createdAt: new Date().toISOString(),
            profile: { age: 28, gender: 'male' },
            appointments: []
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            isActive: true,
            createdAt: new Date().toISOString(),
            profile: { age: 32, gender: 'female' },
            appointments: []
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Mock data for development
      setPatients([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          isActive: true,
          createdAt: new Date().toISOString(),
          profile: { age: 28, gender: 'male' },
          appointments: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (patient, action) => {
    setSelectedPatient(patient);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = async (reason = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/dashboard/patients/${selectedPatient._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: actionType,
          reason: reason
        })
      });

      if (response.ok) {
        await fetchPatients();
        setShowModal(false);
        setSelectedPatient(null);
        setActionType('');
      } else {
        console.error('Failed to update patient status');
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  const ActionModal = () => {
    const [reason, setReason] = useState('');

    if (!showModal) return null;

    const getActionText = () => {
      switch (actionType) {
        case 'activate': return 'activate';
        case 'ban': return 'ban';
        default: return actionType;
      }
    };

    const requiresReason = ['ban'].includes(actionType);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            Confirm {getActionText().charAt(0).toUpperCase() + getActionText().slice(1)}
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to {getActionText()} {selectedPatient?.name}?
          </p>
          
          {requiresReason && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (required)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Please provide a reason..."
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => confirmAction(reason)}
              disabled={requiresReason && !reason.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (patient) => {
    if (!patient.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Banned</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-lg h-32"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
        <p className="text-gray-600 mt-1">Manage patient accounts and status</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                          <span className="text-blue-700 font-medium">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.profile?.age ? `${patient.profile.age} years` : 'N/A'} / {patient.profile?.gender || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(patient)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.appointments?.length || 0} appointments
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {patient.isActive ? (
                      <button
                        onClick={() => handleAction(patient, 'ban')}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(patient, 'activate')}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => console.log('View profile:', patient._id)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{patients.length}</span> of{' '}
                  <span className="font-medium">{patients.length}</span> results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActionModal />
    </div>
  );
};

export default PatientManagement;