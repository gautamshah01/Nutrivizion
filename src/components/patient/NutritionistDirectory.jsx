import { useState, useEffect } from 'react'
import { Star, MapPin, Clock, Phone, MessageCircle, Video, Calendar } from 'lucide-react'
import CallInterface from '../communication/CallInterface'
import ChatModal from '../chat/ChatModal'
import { generateRoomName, generateDisplayName, validateCallParticipants } from '../../utils/callUtils'

const NutritionistDirectory = ({ currentUser }) => {
  const [nutritionists, setNutritionists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [isCallOpen, setIsCallOpen] = useState(false)
  const [selectedNutritionist, setSelectedNutritionist] = useState(null)
  const [callInfo, setCallInfo] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatNutritionist, setChatNutritionist] = useState(null)

  const specializations = [
    'Weight Management',
    'Sports Nutrition',
    'Clinical Nutrition',
    'Pediatric Nutrition',
    'Geriatric Nutrition',
    'Diabetes Management',
    'Heart Disease',
    'Eating Disorders',
    'Vegetarian/Vegan Nutrition',
    'Food Allergies',
    'Digestive Health',
    'Women\'s Health',
    'Men\'s Health',
    'Mental Health Nutrition',
    'Cancer Nutrition',
    'Kidney Disease',
    'General Nutrition'
  ]

  useEffect(() => {
    fetchNutritionists()
  }, [])

  const fetchNutritionists = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/nutritionists/directory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch nutritionists')
      }

      const data = await response.json()
      setNutritionists(data.nutritionists || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching nutritionists:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredNutritionists = nutritionists.filter(nutritionist => {
    const matchesSearch = 
      nutritionist.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutritionist.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutritionist.specializations.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesSpecialization = !selectedSpecialization || 
      nutritionist.specializations.includes(selectedSpecialization)

    return matchesSearch && matchesSpecialization
  })

  const initiateVideoCall = (nutritionist, callType = 'video') => {
    const validation = validateCallParticipants(currentUser, nutritionist)
    
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setSelectedNutritionist(nutritionist)
    setCallInfo({
      roomName: validation.roomName,
      displayName: validation.patientDisplayName,
      participantType: 'patient',
      callType: callType
    })
    setIsCallOpen(true)
  }

  const initiateChat = (nutritionist) => {
    setChatNutritionist(nutritionist)
    setIsChatOpen(true)
  }

  const bookAppointment = (nutritionist) => {
    // Navigate to appointment booking
    alert(`Booking appointment with Dr. ${nutritionist.firstName} ${nutritionist.lastName}`)
  }

  const handleCallEnd = () => {
    setIsCallOpen(false)
    setSelectedNutritionist(null)
    setCallInfo(null)
  }

  const handleChatClose = () => {
    setIsChatOpen(false)
    setChatNutritionist(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Nutritionist</h2>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search nutritionists by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Nutritionist List */}
        <div className="space-y-6">
          {filteredNutritionists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No nutritionists found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredNutritionists.map(nutritionist => (
              <div key={nutritionist._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 mb-4 lg:mb-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {nutritionist.firstName[0]}{nutritionist.lastName[0]}
                      </span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          Dr. {nutritionist.firstName} {nutritionist.lastName}
                        </h3>
                        <p className="text-gray-600 mb-2">{nutritionist.qualification}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(nutritionist.rating || 4.5)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {nutritionist.rating || 4.5} ({nutritionist.reviewCount || 25} reviews)
                          </span>
                        </div>

                        {/* Location and Experience */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {nutritionist.location || 'Remote Available'}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {nutritionist.yearsOfExperience || 5}+ years experience
                          </div>
                        </div>
                      </div>

                      {/* Consultation Rate */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{nutritionist.consultationRate || 1000}
                        </p>
                        <p className="text-sm text-gray-600">per session</p>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nutritionist.specializations.map(spec => (
                          <span
                            key={spec}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    {nutritionist.bio && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {nutritionist.bio}
                        </p>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Available:</span> {nutritionist.availability || 'Mon-Fri, 9AM-5PM'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => initiateVideoCall(nutritionist, 'video')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </button>
                      
                      <button
                        onClick={() => initiateVideoCall(nutritionist, 'voice')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Audio Call
                      </button>

                      <button
                        onClick={() => initiateChat(nutritionist)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </button>

                      <button
                        onClick={() => bookAppointment(nutritionist)}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WebRTC Call Modal */}
      {isCallOpen && callInfo && selectedNutritionist && (
        <CallInterface
          isOpen={isCallOpen}
          onClose={handleCallEnd}
          appointment={{
            _id: `call-${selectedNutritionist._id}-${Date.now()}`,
            nutritionistName: selectedNutritionist.name,
            nutritionist: {
              name: selectedNutritionist.name,
              _id: selectedNutritionist._id
            },
            source: 'NutritionistDirectory' // Debug identifier
          }}
          callType={callInfo.callType || 'voice'}
        />
      )}

      {/* Chat Modal */}
      {isChatOpen && chatNutritionist && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleChatClose}
          currentUser={currentUser}
          otherUser={chatNutritionist}
          userType="patient"
        />
      )}
    </>
  )
}

export default NutritionistDirectory