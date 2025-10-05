import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'

const JitsiMeetCall = ({ 
  roomName, 
  displayName, 
  onEndCall, 
  isOpen = false,
  participantType = 'patient' // 'patient' or 'nutritionist'
}) => {
  const jitsiContainerRef = useRef(null)
  const jitsiApiRef = useRef(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    if (isOpen && roomName && displayName && jitsiContainerRef.current) {
      initializeJitsi()
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose()
        jitsiApiRef.current = null
      }
    }
  }, [isOpen, roomName, displayName])

  const initializeJitsi = () => {
    // Clear any existing Jitsi instance
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose()
    }

    // Clear the container
    if (jitsiContainerRef.current) {
      jitsiContainerRef.current.innerHTML = ''
    }

    // Configure Jitsi Meet
    const options = {
      roomName: roomName,
      width: '100%',
      height: '600px',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        enableUserRolesBasedOnToken: false,
        disableDeepLinking: true,
        defaultLanguage: 'en',
        hideConferenceSubject: true,
        hideConferenceTimer: false,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'closedcaptions',
          'desktop',
          'embedmeeting',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'profile',
          'chat',
          'recording',
          'livestreaming',
          'etherpad',
          'sharedvideo',
          'settings',
          'raisehand',
          'videoquality',
          'filmstrip',
          'invite',
          'feedback',
          'stats',
          'shortcuts',
          'tileview',
          'videobackgroundblur',
          'download',
          'help',
          'mute-everyone',
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        DEFAULT_BACKGROUND: '#474747',
        DISABLE_VIDEO_BACKGROUND: false,
        INITIAL_TOOLBAR_TIMEOUT: 20000,
        TOOLBAR_TIMEOUT: 4000,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
      },
    }

    // Create Jitsi API instance
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', options)
    jitsiApiRef.current = api

    // Set up event listeners
    api.addEventListener('readyToClose', () => {
      setIsCallActive(false)
      onEndCall?.()
    })

    api.addEventListener('participantJoined', (participant) => {
      console.log('Participant joined:', participant)
      setIsCallActive(true)
    })

    api.addEventListener('participantLeft', (participant) => {
      console.log('Participant left:', participant)
    })

    api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
      setIsAudioMuted(muted)
    })

    api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
      setIsVideoMuted(muted)
    })

    api.addEventListener('videoConferenceJoined', () => {
      console.log('Video conference joined')
      setIsCallActive(true)
    })

    api.addEventListener('videoConferenceLeft', () => {
      console.log('Video conference left')
      setIsCallActive(false)
      onEndCall?.()
    })
  }

  const toggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio')
    }
  }

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo')
    }
  }

  const endCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup')
    }
    setIsCallActive(false)
    onEndCall?.()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {participantType === 'patient' ? 'Consultation Call' : 'Patient Consultation'}
            </h2>
            <p className="text-sm text-gray-600">
              Room: {roomName} • {displayName}
            </p>
          </div>
          <button
            onClick={endCall}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-gray-900 relative">
          <div 
            ref={jitsiContainerRef} 
            className="w-full h-full"
            style={{ minHeight: '600px' }}
          />
          
          {/* Loading State */}
          {!isCallActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Connecting to call...</p>
                <p className="text-sm text-gray-300 mt-2">
                  Please wait while we set up your consultation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={isVideoMuted ? 'Turn On Video' : 'Turn Off Video'}
          >
            {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="End Call"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>

        {/* Call Info */}
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {isCallActive ? '🟢 Call Active' : '🔄 Connecting...'}
            </span>
            <span className="text-xs">
              Powered by Jitsi Meet
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JitsiMeetCall