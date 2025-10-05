import { useState, useEffect, useRef } from 'react'
import { Send, Phone, Video, Paperclip, Smile } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import api from '../../services/api'

const ChatInterface = ({ appointmentId, onClose }) => {
  const { user, userType } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [appointment, setAppointment] = useState(null)
  const [chatSession, setChatSession] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails()
      fetchMessages()
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [appointmentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchAppointmentDetails = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}/details`)
      setAppointment(response.data.appointment)
    } catch (error) {
      console.error('Failed to fetch appointment details:', error)
      toast.error('Failed to load appointment details')
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/chat/appointment/${appointmentId}`)
      
      if (response.data.success) {
        setMessages(response.data.messages || [])
        setChatSession(response.data.chat)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    try {
      setSending(true)
      const response = await api.post(`/chat/appointment/${appointmentId}/message`, {
        content: newMessage.trim(),
        messageType: 'text'
      })

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.messageData])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const startVoiceCall = async () => {
    try {
      const response = await api.post(`/appointments/${appointmentId}/call/start`, {
        callType: 'voice'
      })
      
      if (response.data.success) {
        toast.success('Voice call started!')
        // Here you can integrate with your preferred calling service
        // For now, we'll just show a placeholder
        showCallInterface('voice')
      }
    } catch (error) {
      console.error('Failed to start voice call:', error)
      toast.error('Failed to start voice call')
    }
  }

  const startVideoCall = async () => {
    try {
      const response = await api.post(`/appointments/${appointmentId}/call/start`, {
        callType: 'video'
      })
      
      if (response.data.success) {
        toast.success('Video call started!')
        // Here you can integrate with your preferred video calling service
        // For now, we'll just show a placeholder
        showCallInterface('video', response.data.callSession.meetingLink)
      }
    } catch (error) {
      console.error('Failed to start video call:', error)
      toast.error('Failed to start video call')
    }
  }

  const showCallInterface = (type, meetingLink) => {
    // Placeholder for call interface
    // In a real app, you'd integrate with WebRTC, Zoom SDK, etc.
    alert(`${type} call started! ${meetingLink ? `Meeting link: ${meetingLink}` : ''}`)
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const isMyMessage = (message) => {
    return message.sender.toString() === user.id
  }

  const getOtherParticipant = () => {
    if (!appointment) return null
    
    return userType === 'nutritionist' 
      ? appointment.patientId 
      : appointment.nutritionistId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!appointment || !appointment.communicationEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Not Available</h3>
        <p className="text-gray-500">
          Chat is only available for approved appointments.
        </p>
      </div>
    )
  }

  const otherParticipant = getOtherParticipant()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {otherParticipant?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {otherParticipant?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {userType === 'nutritionist' ? 'Patient' : 'Nutritionist'} • 
                {appointment.sessionType} session
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Call Actions */}
            <button
              onClick={startVoiceCall}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Start voice call"
            >
              <Phone className="w-5 h-5" />
            </button>
            
            <button
              onClick={startVideoCall}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Start video call"
            >
              <Video className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Start the conversation! Send your first message below.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMine = isMyMessage(message)
            const showTimestamp = index === 0 || 
              new Date(message.timestamp) - new Date(messages[index - 1]?.timestamp) > 300000 // 5 minutes

            return (
              <div key={message._id || index}>
                {showTimestamp && (
                  <div className="text-center text-xs text-gray-500 my-4">
                    {formatMessageTime(message.timestamp)}
                  </div>
                )}
                
                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isMine 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {!isMine && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isMine ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface