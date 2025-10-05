import { useState, useEffect } from 'react';
import {
  Calendar, Users, DollarSign, MessageCircle, Video, Phone,
  CheckCircle, XCircle, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import ChatInterface from '../components/communication/ChatInterface';
import CallInterface from '../components/communication/CallInterface';

const NutritionistDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    monthlyEarnings: 0,
    upcomingAppointments: 0,
    completedSessions: 0,
    avgRating: 4.8,
    unreadMessages: 0
  });

  // Interface states
  const [chatOpen, setChatOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [callType, setCallType] = useState('voice');


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real appointments from API
      const response = await api.get('/nutritionist/dashboard');
      
      if (response.data.success) {
        const dashboardData = response.data.dashboard;
        const todaysAppointments = dashboardData.todaysAppointments || [];
        const upcomingAppointments = dashboardData.upcomingAppointments || [];
        
        // Combine today and upcoming appointments
        const allAppointments = [...todaysAppointments, ...upcomingAppointments];
        
        // Transform appointments for display
        const transformedAppointments = allAppointments.map(apt => ({
          id: apt.id || apt._id,
          patientName: apt.patient?.name || apt.patientId?.name || 'Unknown Patient',
          patientEmail: apt.patient?.email || apt.patientId?.email || '',
          time: apt.time,
          date: new Date(apt.date).toLocaleDateString(),
          type: apt.sessionType || 'video',
          status: apt.approvalStatus || 'approved',
          duration: apt.duration || 60,
          fee: apt.fee || 75,
          reason: apt.reason || 'Consultation',
          communicationEnabled: apt.communicationEnabled || true,
          approvalStatus: apt.approvalStatus || 'approved',
          appointmentId: apt.id || apt._id
        }));
        
        setAppointments(transformedAppointments);
        
        // Update stats with real data
        setStats({
          totalPatients: dashboardData.stats?.totalPatients || allAppointments.length,
          monthlyEarnings: dashboardData.earnings?.thisMonth || 0,
          upcomingAppointments: upcomingAppointments.length,
          completedSessions: dashboardData.earnings?.completedSessions || 0,
          avgRating: 4.8,
          unreadMessages: dashboardData.stats?.unreadMessages || 0
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/approve`);
      if (response.data.success) {
        toast.success('Appointment approved! Patient will receive payment notification.');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to approve appointment:', error);
      toast.error('Failed to approve appointment');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/reject`);
      if (response.data.success) {
        toast.success('Appointment rejected.');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  const handleStartCall = async (appointment, type = 'video') => {
    try {
      console.log('Starting call with appointment:', appointment);
      const patientName = appointment.patientName || appointment.patient?.name || 'Patient';
      
      const response = await api.post(`/appointments/${appointment.appointmentId || appointment.id}/call/start`, {
        callType: type
      });
      if (response.data.success) {
        setSelectedAppointment(appointment);
        setCallType(type);
        setCallOpen(true);
        toast.success(`${type} call started with ${patientName}`);
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      toast.error('Failed to start call');
    }
  };

  const handleStartChat = async (appointment) => {
    try {
      console.log('Starting chat with appointment:', appointment);
      const patientName = appointment.patientName || appointment.patient?.name || 'Patient';
      
      setSelectedAppointment(appointment);
      setChatOpen(true);
      console.log('Chat state set:', { chatOpen: true, selectedAppointment: appointment });
      toast.success(`Chat opened with ${patientName}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Dr. Nutritionist'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here is what is happening with your practice today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.monthlyEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
          </div>
          
          <div className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-primary-600" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-gray-900">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
                            <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                          </div>
                          
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.duration} min  ${appointment.fee}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.approvalStatus === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.approvalStatus}
                        </span>
                        
                        {appointment.communicationEnabled && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Communication Enabled
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {appointment.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveAppointment(appointment.appointmentId)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(appointment.appointmentId)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {appointment.communicationEnabled && appointment.approvalStatus === 'approved' && (
                          <>
                            <button
                              onClick={() => handleStartChat(appointment)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat
                            </button>
                            <button
                              onClick={() => handleStartCall(appointment)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Start Call
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {chatOpen && selectedAppointment && (
        <ChatInterface
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          appointment={selectedAppointment}
          onStartCall={handleStartCall}
        />
      )}

      {/* Call Interface */}
      {callOpen && selectedAppointment && (
        <CallInterface
          isOpen={callOpen}
          onClose={() => setCallOpen(false)}
          appointment={{
            ...selectedAppointment,
            source: 'NutritionistDashboard' // Debug identifier
          }}
          callType={callType}
        />
      )}


    </div>
  );
};

export default NutritionistDashboard;
