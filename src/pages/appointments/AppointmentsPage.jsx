import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AppointmentManagement from '../../components/appointments/AppointmentManagement'
import ChatInterface from '../../components/chat/ChatInterface'
import PaymentQRModal from '../../components/payment/PaymentQRModal'
import { useSocketIO } from '../../hooks/useSocketIO.jsx'
import api from '../../services/api'
import { MessageSquare, Calendar, Users } from 'lucide-react'

const AppointmentsPage = () => {
  const { user, userType } = useAuth()
  const [activeTab, setActiveTab] = useState('appointments')
  const [selectedAppointmentForChat, setSelectedAppointmentForChat] = useState(null)
  const [conversations, setConversations] = useState([])
  const [appointments, setAppointments] = useState([])
  
  // Call state management
  const [incomingCall, setIncomingCall] = useState(null)
  
  // QR Payment state management
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)
  
  // Socket.IO hook for call notifications
  const { socket, isConnected, notifyCallStart } = useSocketIO(user?.id)

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchConversations()
    }
  }, [activeTab])

  // Listen for incoming call events from Socket.IO
  useEffect(() => {
    const handleIncomingCallEvent = (event) => {
      const { appointmentId, callType, callerName } = event.detail
      console.log('Received incoming call event:', { appointmentId, callType, callerName })
      handleIncomingCall(appointmentId, callType)
    }

    const handleQRPaymentEvent = (event) => {
      const { appointmentId, nutritionistName, amount } = event.detail
      console.log('Received QR payment event:', { appointmentId, nutritionistName, amount })
      handleQRPayment(appointmentId, nutritionistName, amount)
    }

    window.addEventListener('incomingCall', handleIncomingCallEvent)
    window.addEventListener('showQRPayment', handleQRPaymentEvent)
    
    return () => {
      window.removeEventListener('incomingCall', handleIncomingCallEvent)
      window.removeEventListener('showQRPayment', handleQRPaymentEvent)
    }
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/user/conversations')
      setConversations(response.data.conversations || [])
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const handleChatSelect = (appointmentId) => {
    setSelectedAppointmentForChat(appointmentId)
    setActiveTab('chat')
  }

  // Handle incoming call notifications
  const handleIncomingCall = (appointmentId, callType) => {
    console.log('AppointmentsPage: Incoming call received', { appointmentId, callType })
    setIncomingCall({ appointmentId, callType })
    
    // Switch to appointments tab to show the call interface
    setActiveTab('appointments')
  }

  // Handle QR payment notifications
  const handleQRPayment = (appointmentId, nutritionistName, amount) => {
    console.log('AppointmentsPage: QR payment received', { appointmentId, nutritionistName, amount })
    setPaymentDetails({ appointmentId, nutritionistName, amount })
    setPaymentModalOpen(true)
    
    // Switch to appointments tab to show the payment modal
    setActiveTab('appointments')
  }

  const tabs = [
    {
      id: 'appointments',
      name: 'Appointments',
      icon: Calendar,
      count: null
    },
    {
      id: 'chat',
      name: 'Messages',
      icon: MessageSquare,
      count: conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {userType === 'nutritionist' ? 'Manage Appointments' : 'My Appointments'}
          </h1>
          <p className="mt-2 text-gray-600">
            {userType === 'nutritionist' 
              ? 'Review appointment requests and communicate with patients'
              : 'Track your appointments and chat with your nutritionist'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.count > 0 && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'appointments' && (
            <div className="p-6">
              <AppointmentManagement 
                onChatSelect={handleChatSelect}
                incomingCall={incomingCall}
                onCallHandled={() => setIncomingCall(null)}
                callNotificationService={{ notifyCallStart, isConnected }}
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[600px]">
              {selectedAppointmentForChat ? (
                <ChatInterface 
                  appointmentId={selectedAppointmentForChat}
                  onClose={() => setSelectedAppointmentForChat(null)}
                />
              ) : (
                <ConversationsList 
                  conversations={conversations}
                  onSelectConversation={(appointmentId) => setSelectedAppointmentForChat(appointmentId)}
                />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Socket.IO connection is managed by useSocketIO hook */}
      
      {/* QR Payment Modal */}
      {paymentModalOpen && paymentDetails && (
        <PaymentQRModal
          isVisible={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setPaymentDetails(null)
          }}
          patientName={paymentDetails.nutritionistName}
          amount={paymentDetails.amount}
        />
      )}
    </div>
  )
}

// Conversations List Component
const ConversationsList = ({ conversations, onSelectConversation }) => {
  const { userType } = useAuth()

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-gray-400 mb-4">
          <MessageSquare className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-500">
          {userType === 'nutritionist' 
            ? "You'll see patient conversations here once appointments are approved."
            : "Start a conversation with your nutritionist after your appointment is approved."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <p className="text-sm text-gray-500 mt-1">
          {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 100px)' }}>
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const participant = conversation.participant
            
            return (
              <button
                key={conversation._id}
                onClick={() => onSelectConversation(conversation.appointmentId)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold">
                      {participant?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {participant?.user?.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(conversation.lastMessage?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(conversation.appointment?.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })} • {conversation.appointment?.sessionType} session
                    </p>
                    
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    
                    {conversation.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {conversation.unreadCount} new message{conversation.unreadCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage