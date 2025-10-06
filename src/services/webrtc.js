import { io } from 'socket.io-client'

// WebRTC Service for handling peer-to-peer connections
class WebRTCService {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.socket = null;
    this.isInitiator = false;
    this.roomId = null;
    this.userId = null;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
    this.onIceConnectionStateChange = null;
    
    // ICE servers configuration - optimized for better connectivity
    this.iceServers = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Free TURN servers for better NAT traversal
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject', 
          credential: 'openrelayproject'
        }
      ],
      iceCandidatePoolSize: 10
    };
  }

  // Initialize Socket.IO connection for signaling
  initializeSocket(roomId, userId) {
    this.roomId = roomId;
    this.userId = userId;
    
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io('https://nutri-vision-backend-production.up.railway.app', {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected for WebRTC room:', roomId);
      this.socket.emit('join_webrtc_room', { roomId, userId });
    });

    this.socket.on('webrtc_connected', (data) => {
      console.log('WebRTC signaling connected:', data);
    });

    this.socket.on('user_joined', (data) => {
      console.log('User joined room:', data);
    });

    this.socket.on('webrtc_signal', async (message) => {
      await this.handleSignalingMessage(message);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected from WebRTC signaling');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO WebRTC connection error:', error);
    });
  }

  // Handle signaling messages
  async handleSignalingMessage(message) {
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message.offer);
        break;
      case 'answer':
        await this.handleAnswer(message.answer);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message.candidate);
        break;
      case 'user-joined':
        if (!this.isInitiator) {
          this.isInitiator = true;
          await this.createOffer();
        }
        break;
      case 'user-left':
        this.handleUserLeft();
        break;
      case 'call-ended':
        this.handleCallEnded();
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  // Send signaling message
  sendSignalingMessage(message) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('webrtc_signal', message);
    }
  }

  // Initialize peer connection
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.iceServers);

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      console.log('🔗 WebRTC Connection state:', state);
      
      if (state === 'connected') {
        console.log('✅ WebRTC connection established successfully!');
      } else if (state === 'disconnected') {
        console.log('⚠️ WebRTC connection disconnected');
      } else if (state === 'failed') {
        console.log('❌ WebRTC connection failed');
      } else if (state === 'connecting') {
        console.log('🔄 WebRTC connecting...');
      }
      
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
    };

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      const iceState = this.peerConnection.iceConnectionState;
      console.log('🧊 ICE Connection state:', iceState);
      
      if (iceState === 'connected' || iceState === 'completed') {
        console.log('✅ ICE connection established!');
      } else if (iceState === 'failed') {
        console.log('❌ ICE connection failed - may need TURN servers');
      }
    };

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
      if (this.onIceConnectionStateChange) {
        this.onIceConnectionStateChange(this.peerConnection.iceConnectionState);
      }
    };
  }

  // Get user media (camera and microphone)
  async getUserMedia(constraints = { video: true, audio: true }) {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      console.log('Requesting media permissions:', constraints);
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Media permissions granted, stream:', this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera and microphone access denied. Please allow permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera or microphone found. Please check your devices.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera or microphone is already in use by another application.');
      } else {
        throw new Error(`Media access error: ${error.message}`);
      }
    }
  }

  // Start call as initiator
  async startCall(roomId, userId, constraints = { video: true, audio: true }) {
    try {
      // Get user media
      await this.getUserMedia(constraints);
      
      // Initialize socket and peer connection
      this.initializeSocket(roomId, userId);
      this.createPeerConnection();
      
      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  // Join existing call
  async joinCall(roomId, userId, constraints = { video: true, audio: true }) {
    try {
      // Get user media
      await this.getUserMedia(constraints);
      
      // Initialize socket and peer connection
      this.initializeSocket(roomId, userId);
      this.createPeerConnection();
      
      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Notify other users that we joined
      this.sendSignalingMessage({ type: 'user-joined' });

      return this.localStream;
    } catch (error) {
      console.error('Error joining call:', error);
      throw error;
    }
  }

  // Create offer
  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.sendSignalingMessage({
        type: 'offer',
        offer: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  // Handle received offer
  async handleOffer(offer) {
    try {
      await this.peerConnection.setRemoteDescription(offer);
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      this.sendSignalingMessage({
        type: 'answer',
        answer: answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Handle received answer
  async handleAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  // Handle ICE candidate
  async handleIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  // Handle user left
  handleUserLeft() {
    console.log('👋 Other participant left the call');
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }
    // Trigger connection state change to notify UI
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange('disconnected');
    }
  }

  // Handle call ended by other participant
  handleCallEnded() {
    console.log('🔚 Call ended by other participant');
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange('ended-by-peer');
    }
    // Clean up without sending another end message
    this.cleanupCall();
  }

  // Clean up call without notifying other participants
  cleanupCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Stop remote stream
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Close socket
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Reset state
    this.isInitiator = false;
    this.roomId = null;
  }

  // Toggle audio
  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Returns true if muted
      }
    }
    return false;
  }

  // Toggle video
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled; // Returns true if video is off
      }
    }
    return false;
  }

  // End call
  endCall() {
    console.log('🔚 Ending call and notifying other participants');
    
    // Notify other participants that call is ending before cleanup
    if (this.socket && this.socket.connected) {
      this.sendSignalingMessage({ type: 'call-ended' });
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Stop remote stream
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Close socket after a brief delay to ensure message is sent
    if (this.socket) {
      setTimeout(() => {
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      }, 500);
    }

    // Reset state
    this.isInitiator = false;
    this.roomId = null;
  }

  // Get connection statistics
  async getStats() {
    if (this.peerConnection) {
      return await this.peerConnection.getStats();
    }
    return null;
  }
}

export default WebRTCService;