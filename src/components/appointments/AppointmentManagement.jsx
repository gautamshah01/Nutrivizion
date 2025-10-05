import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Phone, 
  Video,
  Filter
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import api from '../../services/api'
import ChatInterface from '../communication/ChatInterface'
import CallInterface from '../communication/CallInterface'
import PaymentQRModal from '../payment/PaymentQRModal'

const AppointmentManagement = ({ onChatSelect, onClose, incomingCall, onCallHandled, callNotificationService }) => {
  const { user, userType } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  // Interface states
  const [chatOpen, setChatOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const [callAppointment, setCallAppointment] = useState(null)
  const [callType, setCallType] = useState('voice')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)



  useEffect(() => {
    fetchAppointments()
  }, [filter, approvalFilter])



  // Handle incoming call notifications
  const handleIncomingCall = (appointmentId, incomingCallType) => {
    // Find the appointment
    const appointment = appointments.find(apt => apt._id === appointmentId)
    if (appointment) {
      setCallAppointment(appointment)
      setCallType(incomingCallType)
      setCallOpen(true)
      toast.success(`Joining ${incomingCallType} call...`)
    }
  }

  // Handle incoming call from parent component
  useEffect(() => {
    console.log('AppointmentManagement useEffect triggered:', { 
      incomingCall, 
      appointmentsLength: appointments.length,
      hasOnCallHandled: !!onCallHandled 
    })
    
    if (incomingCall && appointments.length > 0) {
      const { appointmentId, callType } = incomingCall
      console.log('AppointmentManagement: Looking for appointment:', appointmentId)
      const appointment = appointments.find(apt => apt._id === appointmentId)
      
      if (appointment) {
        console.log('AppointmentManagement: Processing incoming call', { appointment, callType })
        console.log('AppointmentManagement: Setting call state - callOpen will be true')
        
        // Dismiss any existing toasts before showing new one
        toast.dismiss()
        
        setCallAppointment(appointment)
        setCallType(callType)
        setCallOpen(true)
        
        // Only show toast if not already in call
        if (!callOpen) {
          toast.success(`Joining ${callType} call...`, { id: 'joining-call' })
        }
        
        // Notify parent that call has been handled
        if (onCallHandled) {
          onCallHandled()
        }
      } else {
        console.log('AppointmentManagement: Appointment not found for ID:', appointmentId)
      }
    } else {
      console.log('AppointmentManagement: Conditions not met', { 
        hasIncomingCall: !!incomingCall, 
        appointmentsLength: appointments.length 
      })
    }
  }, [incomingCall, appointments, onCallHandled, callOpen])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const endpoint = userType === 'nutritionist' ? '/appointments/nutritionist' : '/appointments/patient'
      const params = new URLSearchParams()
      
      if (filter !== 'all') params.append('status', filter)
      if (approvalFilter !== 'all') params.append('approvalStatus', approvalFilter)

      const response = await api.get(`${endpoint}?${params.toString()}`)
      setAppointments(response.data.appointments || [])
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appointmentId) => {
    try {
      setActionLoading(appointmentId)
      const response = await api.put(`/appointments/${appointmentId}/approve`)
      
      if (response.data.success) {
        toast.success('Appointment approved successfully!')
        fetchAppointments()
      }
    } catch (error) {
      console.error('Failed to approve appointment:', error)
      toast.error(error.response?.data?.message || 'Failed to approve appointment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appointmentId, reason) => {
    try {
      setActionLoading(appointmentId)
      const response = await api.put(`/appointments/${appointmentId}/reject`, { reason })
      
      if (response.data.success) {
        toast.success('Appointment rejected')
        fetchAppointments()
      }
    } catch (error) {
      console.error('Failed to reject appointment:', error)
      toast.error(error.response?.data?.message || 'Failed to reject appointment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStartChat = async (appointment) => {
    try {
      // If onChatSelect prop is provided, use it (for AppointmentsPage)
      if (onChatSelect) {
        onChatSelect(appointment._id || appointment.id);
        return;
      }
      
      // Otherwise use internal chat interface (for NutritionistDashboard)
      setSelectedAppointment(appointment);
      setChatOpen(true);
      const participantName = (userType === 'Patient' || userType === 'patient') ? appointment.nutritionistId?.name : appointment.patientId?.name;
      toast.success(`Chat opened with ${participantName || 'Unknown'}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleStartCall = async (appointment, callType = 'voice') => {
    console.log('handleStartCall called:', { appointment: appointment._id, callType, userType })
    try {
      const response = await api.post(`/appointments/${appointment._id}/call/start`, {
        callType: callType
      });
      console.log('Call start API response:', response.data)
      if (response.data.success) {
        setCallAppointment(appointment);
        setCallType(callType);
        setCallOpen(true);
        console.log('AppointmentManagement call debug:', { 
          appointment, 
          callType, 
          userType,
          nutritionistName: appointment.nutritionistId?.name, 
          patientName: appointment.patientId?.name,
          // Check all possible patient field paths
          patientId: appointment.patientId,
          patient: appointment.patient,
          appointmentKeys: Object.keys(appointment),
          // Try different ways to get patient name
          patientViaId: appointment.patientId,
          patientViaPatient: appointment.patient,
          // Check if user info is in other places
          userId: appointment.userId,
          user: appointment.user
        });
        
        const participantName = (userType === 'Patient' || userType === 'patient') ? appointment.nutritionistId?.name : appointment.patientId?.name;
        toast.success(`${callType} call started with ${participantName || 'Unknown'}`);
        
        // Notify the other participant about the call
        if (callNotificationService) {
          const recipientId = (userType === 'Patient' || userType === 'patient') ? appointment.nutritionistId?._id || appointment.nutritionistId : appointment.patientId?._id || appointment.patientId;
          const callerName = user?.name || 'Someone';
          console.log('Notifying call start:', { recipientId, callerName, appointment: appointment._id });
          callNotificationService.notifyCallStart(appointment._id, callType, recipientId, callerName);
        } else {
          console.log('Call notification service not available');
        }
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      toast.error('Failed to start call');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Calendar },
      'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      missed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig.scheduled
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getApprovalBadge = (approvalStatus) => {
    const approvalConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      approved: { bg: 'bg-green-100', text: 'text-green-800' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800' }
    }

    const config = approvalConfig[approvalStatus] || approvalConfig.pending

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
      </span>
    )
  }

  const getSessionTypeIcon = (sessionType) => {
    const icons = {
      video: Video,
      phone: Phone,
      chat: MessageSquare
    }
    
    const Icon = icons[sessionType] || MessageSquare
    return <Icon className="w-4 h-4" />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Call Interface */}
      {callOpen && callAppointment && (
        <CallInterface
          isOpen={callOpen}
          onClose={() => setCallOpen(false)}
          appointment={callAppointment}
          callType={callType}
        />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userType === 'nutritionist' ? 'Appointment Requests' : 'My Appointments'}
        </h2>
        

        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="all">All Approvals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">
            {userType === 'nutritionist' 
              ? "You don't have any appointment requests yet."
              : "You haven't booked any appointments yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userType === 'nutritionist' 
                          ? appointment.patientId?.name 
                          : appointment.nutritionistId?.name
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        {userType === 'nutritionist' 
                          ? appointment.patientId?.email
                          : appointment.nutritionistId?.professional?.qualification
                        }
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formatTime(appointment.time)} ({appointment.duration} min)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSessionTypeIcon(appointment.sessionType)}
                      <span className="text-sm text-gray-700 capitalize">
                        {appointment.sessionType}
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center space-x-3 mb-4">
                    {getApprovalBadge(appointment.approvalStatus)}
                    {getStatusBadge(appointment.status)}
                    <span className="text-sm text-gray-500">
                      Fee: ${appointment.fee}
                    </span>
                  </div>

                  {/* Communication Options */}
                  {appointment.communicationEnabled && appointment.approvalStatus === 'approved' && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Communication enabled - Chat, calls, and video calls are available
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="ml-6 flex flex-col space-y-2">
                  {userType === 'nutritionist' && appointment.approvalStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(appointment._id)}
                        disabled={actionLoading === appointment._id}
                        className="btn btn-primary btn-sm"
                      >
                        {actionLoading === appointment._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please provide a reason for rejection:')
                          if (reason) handleReject(appointment._id, reason)
                        }}
                        disabled={actionLoading === appointment._id}
                        className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}

                  {appointment.communicationEnabled && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleStartChat(appointment)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Start Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStartCall(appointment, 'voice')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Start Voice Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStartCall(appointment, 'video')}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="Start Video Call"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {appointment.approvalStatus === 'rejected' && appointment.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {appointment.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          userType={userType}
        />
      )}
    </div>
  )
}

// Appointment Details Modal Component
const AppointmentDetailsModal = ({ appointment, onClose, userType }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Participant Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {userType === 'nutritionist' ? 'Patient Information' : 'Nutritionist Information'}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  {userType === 'nutritionist' 
                    ? appointment.patientId?.name 
                    : appointment.nutritionistId?.name
                  }
                </p>
                <p className="text-sm text-gray-600">
                  {userType === 'nutritionist' 
                    ? appointment.patientId?.email
                    : appointment.nutritionistId?.email
                  }
                </p>
              </div>
            </div>

            {/* Session Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Session Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{appointment.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Session Type</p>
                  <p className="font-medium capitalize">{appointment.sessionType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fee</p>
                  <p className="font-medium">${appointment.fee}</p>
                </div>
              </div>
            </div>

            {/* Reason & Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Consultation Reason</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{appointment.reason}</p>
            </div>

            {appointment.notes?.patient && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Patient Notes</h3>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-md">{appointment.notes.patient}</p>
              </div>
            )}

            {appointment.notes?.nutritionist && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Nutritionist Notes</h3>
                <p className="text-gray-700 bg-green-50 p-3 rounded-md">{appointment.notes.nutritionist}</p>
              </div>
            )}

            {/* Communication Status */}
            {appointment.communicationEnabled && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Communication Enabled</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Chat, voice calls, and video calls are available for this appointment.
                </p>
              </div>
            )}
          </div>

          {onClose && (
            <div className="mt-6 flex justify-end">
              <button onClick={onClose} className="btn btn-primary">
                Close
              </button>
            </div>
          )}
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

    </div>
  )
}

export default AppointmentManagement