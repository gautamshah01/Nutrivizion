import WebRTCCall from '../call/WebRTCCall'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const CallInterface = ({ isOpen, onClose, appointment, callType = 'voice' }) => {
  const { user } = useAuth()
  const roomId = appointment?._id || appointment?.id || `call-${Date.now()}`
  
  // Debug logging
  console.log('CallInterface rendering:', { isOpen, appointment, callType, roomId })
  
  const handleCallEnd = () => {
    console.log('Call ended via CallInterface')
    // Dismiss all toasts and show call ended
    toast.dismiss()
    toast.success('Call ended', { id: 'call-ended' })
    onClose()
  }

  if (!isOpen) {
    console.log('CallInterface not open, returning null')
    return null
  }
  
  console.log('CallInterface rendering WebRTCCall component')

  return (
    <div>
      {/* Debug overlay - shows call is active */}
      <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded z-[60] shadow-lg">
        📞 {callType} call active
      </div>
      
      <WebRTCCall
        roomId={roomId}
        appointment={appointment}
        callType={callType}
        onEndCall={handleCallEnd}
        isOpen={isOpen}
      />
    </div>
  )
}

export default CallInterface
