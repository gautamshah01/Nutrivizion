/**
 * Generates a unique room name for Jitsi Meet calls
 * @param {string} patientId - Patient's user ID
 * @param {string} nutritionistId - Nutritionist's user ID
 * @param {string} patientName - Patient's username
 * @param {string} nutritionistName - Nutritionist's username
 * @returns {string} Unique room name
 */
export const generateRoomName = (patientId, nutritionistId, patientName, nutritionistName) => {
  // Create a consistent room name regardless of who initiates the call
  const sortedIds = [patientId, nutritionistId].sort()
  const sortedNames = [patientName, nutritionistName].sort()
  
  // Create a unique identifier combining IDs and names
  const roomId = `nutri-vision-${sortedIds[0]}-${sortedIds[1]}`
  
  return roomId
}

/**
 * Generates display name for the call participant
 * @param {Object} user - User object
 * @param {string} userType - 'patient' or 'nutritionist'
 * @returns {string} Display name for the call
 */
export const generateDisplayName = (user, userType) => {
  if (userType === 'nutritionist') {
    return `Dr. ${user.firstName} ${user.lastName}`
  } else {
    return `${user.firstName} ${user.lastName}`
  }
}

/**
 * Validates if a call can be initiated between two users
 * @param {Object} patient - Patient user object
 * @param {Object} nutritionist - Nutritionist user object
 * @returns {Object} Validation result
 */
export const validateCallParticipants = (patient, nutritionist) => {
  if (!patient || !nutritionist) {
    return {
      valid: false,
      error: 'Both patient and nutritionist must be provided'
    }
  }

  if (!patient._id || !nutritionist._id) {
    return {
      valid: false,
      error: 'User IDs are required'
    }
  }

  if (!patient.username || !nutritionist.username) {
    return {
      valid: false,
      error: 'Usernames are required'
    }
  }

  return {
    valid: true,
    roomName: generateRoomName(patient._id, nutritionist._id, patient.username, nutritionist.username),
    patientDisplayName: generateDisplayName(patient, 'patient'),
    nutritionistDisplayName: generateDisplayName(nutritionist, 'nutritionist')
  }
}

/**
 * Creates a consultation session record
 * @param {string} patientId - Patient's user ID
 * @param {string} nutritionistId - Nutritionist's user ID
 * @param {string} roomName - Jitsi room name
 * @param {string} type - 'video' or 'audio'
 * @returns {Object} Session data
 */
export const createConsultationSession = (patientId, nutritionistId, roomName, type = 'video') => {
  return {
    patientId,
    nutritionistId,
    roomName,
    type,
    startTime: new Date(),
    status: 'active'
  }
}

/**
 * Formats consultation duration
 * @param {Date} startTime - Call start time
 * @param {Date} endTime - Call end time (optional, defaults to now)
 * @returns {string} Formatted duration
 */
export const formatCallDuration = (startTime, endTime = new Date()) => {
  const duration = Math.floor((endTime - startTime) / 1000) // Duration in seconds
  
  if (duration < 60) {
    return `${duration} seconds`
  } else if (duration < 3600) {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  } else {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}