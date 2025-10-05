import { useState, useEffect, useRef } from 'react'
import { Send, X, Paperclip, Smile } from 'lucide-react'

const ChatModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  otherUser, 
  userType = 'patient' // 'patient' or 'nutritionist'
}) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && otherUser) {
      initializeChat()
    }
  }, [isOpen, otherUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Initialize or get existing chat
      const response = await fetch('/api/chat/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nutritionistId: userType === 'patient' ? otherUser._id : currentUser._id,
          patientId: userType === 'patient' ? currentUser._id : otherUser._id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to initialize chat')
      }

      const data = await response.json()
      setChatId(data.chat._id)
      
      // Load existing messages
      await loadMessages(data.chat._id)
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatIdToLoad) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/chat/${chatIdToLoad}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !chatId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setMessages(prev => [...prev, data.messageData])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {userType === 'patient' ? `Dr. ${otherUser?.firstName} ${otherUser?.lastName}` : `${otherUser?.firstName} ${otherUser?.lastName}`}
              </h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUser._id
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)
                
                return (
                  <div key={message._id || index}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 my-2">
                        {formatDate(message.createdAt)}
                      </div>
                    )}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-20"
                disabled={loading || !chatId}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  disabled
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  disabled
                >
                  <Smile className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || loading || !chatId}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatModal