import { useState, useEffect, useRef } from 'react'
import { 
  X, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  MoreVertical,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import api from '../../services/api'

const ChatInterface = ({ isOpen, onClose, appointment, onStartCall }) => {
  const { user, userType } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && appointment) {
      initializeChat()
    }
  }, [isOpen, appointment])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    try {
      setLoading(true)
      console.log('Initializing chat for appointment:', appointment)
      
      // For now, just simulate a chat session to test the UI
      setChatId('demo-chat-id')
      setMessages([
        {
          _id: '1',
          content: 'Hello! How can I help you today?',
          sender: userType === 'nutritionist' ? 'other' : user.id,
          timestamp: new Date()
        }
      ])
      
      // TODO: Implement real chat initialization
      // const existingChatResponse = await api.get(`/chat/appointment/${appointment._id}`)
      // if (existingChatResponse.data.success && existingChatResponse.data.chat) {
      //   setChatId(existingChatResponse.data.chat._id)
      //   loadMessages(existingChatResponse.data.chat._id)
      // } else {
      //   const response = await api.post('/chat/initiate', {
      //     appointmentId: appointment._id
      //   })
      //   if (response.data.success) {
      //     setChatId(response.data.chat._id)
      //     loadMessages(response.data.chat._id)
      //   }
      // }
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      toast.error('Failed to open chat')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`)
      if (response.data.success) {
        setMessages(response.data.messages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return

    // Demo mode - simulate sending message
    const demoMessage = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: user.id,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, demoMessage])
    setNewMessage('')
    
    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage = {
        _id: (Date.now() + 1).toString(),
        content: 'Thank you for your message! This is a demo response.',
        sender: 'other',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, responseMessage])
    }, 1000)

    // TODO: Implement real message sending
    // try {
    //   const response = await api.post(`/chat/${chatId}/message`, {
    //     content: newMessage,
    //     type: 'text'
    //   })
    //   if (response.data.success) {
    //     setMessages(prev => [...prev, response.data.message])
    //     setNewMessage('')
    //   }
    // } catch (error) {
    //   console.error('Failed to send message:', error)
    //   toast.error('Failed to send message')
    // }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const otherParticipant = userType === 'nutritionist' 
    ? (appointment.patientName || appointment.patient?.name || 'Patient')
    : (appointment.nutritionistName || appointment.nutritionist?.name || 'Nutritionist')

  if (!isOpen) return null

  console.log('ChatInterface rendering with:', { isOpen, appointment, userType });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{otherParticipant}</h3>
              <p className="text-sm text-gray-500">
                {appointment.date} at {appointment.time}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStartCall && onStartCall(appointment, 'voice')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full"
              title="Start Voice Call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => onStartCall && onStartCall(appointment, 'video')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Start Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Start your conversation with {otherParticipant}</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender.toString() === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.toString() === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender.toString() === user.id
                        ? 'text-blue-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface