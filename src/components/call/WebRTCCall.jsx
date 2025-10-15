import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import WebRTCService from '../../services/webrtc'
import toast from 'react-hot-toast'

const WebRTCCall = ({ 
  roomId, 
  appointment,
  callType = 'voice', // 'voice' or 'video'
  onEndCall, 
  isOpen = false,
  isInitiator = false // Whether this user initiated the call
}) => {
  const { user, userType } = useAuth()
  
  // Debug logging
  useEffect(() => {
    console.log('WebRTCCall props:', { roomId, appointment, callType, isOpen, isInitiator })
  }, [roomId, appointment, callType, isOpen, isInitiator])
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const webrtcServiceRef = useRef(null)
  
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(callType === 'voice')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState('connecting')
  const [callDuration, setCallDuration] = useState(0)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionTimeout, setConnectionTimeout] = useState(null)

  // Initialize WebRTC service
  useEffect(() => {
    if (!webrtcServiceRef.current) {
      webrtcServiceRef.current = new WebRTCService()
    }
  }, [])

  // Start call when component opens
  useEffect(() => {
    if (isOpen && roomId && webrtcServiceRef.current) {
      startCall()
    }

    return () => {
      // Cleanup timeout
      if (connectionTimeout) {
        clearTimeout(connectionTimeout)
      }
      // Cleanup WebRTC
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.endCall()
      }
    }
  }, [isOpen, roomId]) // Removed connectionTimeout dependency to prevent infinite loop

  // Call duration timer
  useEffect(() => {
    let timer
    if (isConnected) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isConnected])

  const startCall = async () => {
    try {
      const webrtcService = webrtcServiceRef.current
      const userId = user?.id || user?._id
      const constraints = {
        video: callType === 'video',
        audio: true
      }

      // Set up event handlers
      webrtcService.onRemoteStream = (stream) => {
        console.log('Setting remote stream')
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      }

      webrtcService.onConnectionStateChange = (state) => {
        console.log('Connection state changed:', state)
        setConnectionState(state)
        setIsConnected(state === 'connected')
        
        if (state === 'connected') {
          // Clear timeout when connected
          if (connectionTimeout) {
            clearTimeout(connectionTimeout)
            setConnectionTimeout(null)
          }
          // Dismiss joining toast and show connected
          toast.dismiss('joining-call')
          toast.success('Call connected successfully', { id: 'call-connected' })
        } else if (state === 'disconnected' || state === 'failed') {
          toast.dismiss() // Clear all toasts
          toast.error('Call disconnected', { id: 'call-disconnected' })
          setIsConnected(false)
          // Auto-end call for the other participant
          if (onEndCall) {
            setTimeout(() => onEndCall(), 1000)
          }
        } else if (state === 'ended-by-peer') {
          toast.dismiss() // Clear all toasts
          toast('Call ended by other participant', { 
            id: 'call-ended-by-peer',
            icon: 'ℹ️',
            style: {
              background: '#3b82f6',
              color: '#fff',
            }
          })
          setIsConnected(false)
          // End call immediately when ended by peer
          if (onEndCall) {
            setTimeout(() => onEndCall(), 500)
          }
        }
      }

      webrtcService.onIceConnectionStateChange = (state) => {
        console.log('ICE connection state:', state)
        if (state === 'connected' || state === 'completed') {
          setIsConnected(true)
        } else if (state === 'disconnected' || state === 'failed') {
          setIsConnected(false)
        }
      }

      // Start or join call based on whether we're the initiator
      const localStream = isInitiator 
        ? await webrtcService.startCall(roomId, userId, constraints)
        : await webrtcService.joinCall(roomId, userId, constraints)
      
      // Set local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream
      }

      // Set connection state to connecting
      setConnectionState('connecting')
      
      // Set connection timeout (90 seconds for slower networks and better NAT traversal)
      const timeoutId = setTimeout(() => {
        console.log('⏰ Connection timeout check:', { connectionState, isConnected })
        if (connectionState === 'connecting' && !isConnected) {
          console.log('⏰ Connection timeout - call took too long to establish')
          toast.error('Connection timeout. Please check your internet connection and try again.')
          if (onEndCall) {
            onEndCall()
          }
        } else {
          console.log('✅ Timeout check passed - call is connected or in different state')
        }
      }, 90000) // 90 seconds

      setConnectionTimeout(timeoutId)
      // Don't show joining toast here as it's already shown in AppointmentManagement
    } catch (error) {
      console.error('Failed to start call:', error)
      toast.error('Failed to start call: ' + error.message)
    }
  }

  const toggleAudio = () => {
    if (webrtcServiceRef.current) {
      const muted = webrtcServiceRef.current.toggleAudio()
      setIsAudioMuted(muted)
      toast.success(muted ? 'Microphone muted' : 'Microphone unmuted')
    }
  }

  const toggleVideo = () => {
    if (callType === 'voice') {
      toast.error('Video not available in voice-only call')
      return
    }
    
    if (webrtcServiceRef.current) {
      const videoOff = webrtcServiceRef.current.toggleVideo()
      setIsVideoMuted(videoOff)
      toast.success(videoOff ? 'Camera turned off' : 'Camera turned on')
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        // Replace video track with screen share
        const webrtcService = webrtcServiceRef.current
        if (webrtcService.peerConnection && webrtcService.localStream) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = webrtcService.peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          )
          
          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
          
          // Update local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream
          }
          
          setIsScreenSharing(true)
          toast.success('Screen sharing started')
          
          // Handle screen share end
          videoTrack.onended = () => {
            stopScreenShare()
          }
        }
      } else {
        stopScreenShare()
      }
    } catch (error) {
      console.error('Screen share error:', error)
      toast.error('Failed to share screen')
    }
  }

  const stopScreenShare = async () => {
    try {
      const webrtcService = webrtcServiceRef.current
      if (webrtcService.localStream) {
        // Get camera stream back
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true
        })
        
        // Replace screen share track with camera
        const videoTrack = cameraStream.getVideoTracks()[0]
        const sender = webrtcService.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )
        
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack)
        }
        
        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream
        }
        
        // Update local stream reference
        webrtcService.localStream = cameraStream
      }
      
      setIsScreenSharing(false)
      toast.success('Screen sharing stopped')
    } catch (error) {
      console.error('Stop screen share error:', error)
      toast.error('Failed to stop screen sharing')
    }
  }

  const endCall = () => {
    console.log('🔚 Ending call from WebRTCCall component')
    
    // Clear any connection timeout
    if (connectionTimeout) {
      clearTimeout(connectionTimeout)
      setConnectionTimeout(null)
    }
    
    // End the WebRTC call
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.endCall()
    }
    
    // Reset component state
    setIsConnected(false)
    setCallDuration(0)
    setConnectionState('disconnected')
    
    // Dismiss all toasts and show call ended
    toast.dismiss()
    toast.success('Call ended', { id: 'call-ended-local' })
    
    // Notify parent component
    onEndCall?.()
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const otherParticipant = (userType === 'patient' || userType === 'Patient')
    ? (appointment?.nutritionistName || appointment?.nutritionist?.name || appointment?.nutritionistId?.name || 'Nutritionist')
    : (appointment?.patientName || appointment?.patient?.name || appointment?.patientId?.name || 'Patient')
  
  // Add console logging to debug the participant name issue
  console.log('WebRTC Call Debug:', {
    userType,
    appointment,
    otherParticipant,
    callType,
    roomId,
    source: appointment?.source || 'Unknown source',
    participantResolution: {
      isPatient: (userType === 'Patient' || userType === 'patient'),
      shouldShowNutritionist: (userType === 'Patient' || userType === 'patient'),
      nutritionistName: appointment?.nutritionistId?.name,
      patientName: appointment?.patientId?.name
    }
  });
  
  // Debug logging for participant name
  useEffect(() => {
    console.log('Participant name resolution:', { 
      userType, 
      appointment, 
      otherParticipant,
      appointmentNutritionistName: appointment?.nutritionistName,
      appointmentNutritionistObj: appointment?.nutritionist?.name,
      appointmentNutritionistId: appointment?.nutritionistId?.name,
      appointmentPatientName: appointment?.patientName,
      appointmentPatientObj: appointment?.patient?.name,
      appointmentPatientId: appointment?.patientId?.name
    })
  }, [userType, appointment, otherParticipant])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold">
                {callType === 'video' ? 'Video Call' : 'Voice Call'} with {otherParticipant}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className={`flex items-center space-x-1 ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                </span>
                {isConnected && (
                  <span>{formatDuration(callDuration)}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={endCall}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative bg-gray-800">
          {callType === 'video' ? (
            <div className="h-full flex">
              {/* Remote Video (Main) */}
              <div className="flex-1 relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-lg">Connecting to {otherParticipant}...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  You
                </div>
              </div>
            </div>
          ) : (
            /* Voice Call UI */
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{otherParticipant}</h3>
                <p className="text-gray-400">
                  {isConnected ? `Voice call active • ${formatDuration(callDuration)}` : 'Connecting...'}
                </p>
                
                {/* Audio visualization */}
                {isConnected && !isAudioMuted && (
                  <div className="flex items-center justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1 bg-green-400 rounded animate-pulse"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                isAudioMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {/* Video Toggle (only for video calls) */}
            {callType === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  isVideoMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoMuted ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </button>
            )}

            {/* Screen Share (only for video calls) */}
            {callType === 'video' && (
              <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-full transition-colors ${
                  isScreenSharing 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
              </button>
            )}

            {/* End Call */}
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="End call"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Call Info Footer */}
        <div className="px-6 py-3 bg-gray-900 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Room: {roomId}</span>
            <span>WebRTC P2P Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebRTCCall