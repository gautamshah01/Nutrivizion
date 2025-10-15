import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

export const useSocketIO = (userId) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)
  const connectionAttempted = useRef(false)

  useEffect(() => {
    // Only connect once per userId
    if (!userId || connectionAttempted.current || socketRef.current) {
      return
    }

    console.log('Initializing Socket.IO connection for user:', userId)
    connectionAttempted.current = true

    const socketInstance = io('https://nutri-vision-backend-production.up.railway.app', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
      timeout: 20000,
      forceNew: false,
      path: '/socket.io/'
    })

    socketRef.current = socketInstance

    socketInstance.on('connect', () => {
      console.log('Socket.IO connected:', socketInstance.id)
      setSocket(socketInstance)
      setIsConnected(true)
      
      // Join user-specific room for notifications
      socketInstance.emit('join_call_notifications', userId)
      socketInstance.emit('join_user_room', userId)
    })

    socketInstance.on('call_notification_connected', (data) => {
      console.log('Call notification service connected:', data)
    })

    socketInstance.on('incoming_call', (data) => {
      console.log('Incoming call received:', data)
      const { appointmentId, callType, callerName } = data
      
      // Dismiss any existing incoming call toasts
      toast.dismiss('incoming-call')
      
      // Show incoming call notification with unique ID
      toast((t) => (
        <div className="flex items-center space-x-4 p-2">
          <div className="flex-1">
            <p className="font-medium text-gray-900">📞 Incoming {callType} call</p>
            <p className="text-sm text-gray-600">from {callerName}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Check if we're already on the appointments page
                if (window.location.pathname === '/appointments') {
                  // Trigger call interface through custom event
                  window.dispatchEvent(new CustomEvent('incomingCall', {
                    detail: { appointmentId, callType, callerName }
                  }))
                } else {
                  // Navigate to dedicated call page
                  window.location.href = `/call/${appointmentId}`
                }
                
                toast.dismiss(t.id)
              }}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Join
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      ), {
        id: 'incoming-call',
        duration: 30000, // 30 seconds
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#000',
          border: '2px solid #10b981',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }
      })
    })

    socketInstance.on('qr_payment_request', (data) => {
      console.log('QR Payment request received:', data)
      const { appointmentId, nutritionistName, amount } = data
      
      // Dismiss any existing QR payment toasts
      toast.dismiss('qr-payment')
      
      // Show QR payment notification
      toast((t) => (
        <div className="flex items-center space-x-4 p-2">
          <div className="flex-1">
            <p className="font-medium text-gray-900">💳 Payment Required</p>
            <p className="text-sm text-gray-600">₹{amount} for session with {nutritionistName}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Trigger QR payment modal through custom event
                window.dispatchEvent(new CustomEvent('showQRPayment', {
                  detail: { appointmentId, nutritionistName, amount }
                }))
                toast.dismiss(t.id)
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Pay Now
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      ), {
        id: 'qr-payment',
        duration: Infinity, // Don't auto-dismiss payment requests
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#000',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }
      })
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO disconnected')
      setSocket(null)
      setIsConnected(false)
      // Clear any call-related toasts when disconnected
      toast.dismiss('incoming-call')
      toast.dismiss('joining-call')
      toast.dismiss('qr-payment')
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
      setIsConnected(false)
    })

    return () => {
      console.log('Cleaning up Socket.IO connection')
      connectionAttempted.current = false
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setSocket(null)
      setIsConnected(false)
      // Clear all call-related toasts on cleanup
      toast.dismiss('incoming-call')
      toast.dismiss('joining-call')
      toast.dismiss('call-connected')
      toast.dismiss('call-disconnected')
      toast.dismiss('qr-payment')
    }
  }, [userId])

  const notifyCallStart = (appointmentId, callType, recipientId, callerName) => {
    if (socket && isConnected) {
      console.log('Sending call notification via Socket.IO')
      socket.emit('start_call', {
        appointmentId,
        callType,
        recipientId,
        callerName
      })
      return true
    } else {
      console.log('Socket not connected, cannot send notification')
      return false
    }
  }

  return {
    socket,
    isConnected,
    notifyCallStart
  }
}