import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Clock, Phone, MessageCircle, Video, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const SafeNutritionistDirectory = ({ currentUser }) => {
  const navigate = useNavigate()
  const [nutritionists, setNutritionists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [bookingNutritionistId, setBookingNutritionistId] = useState(null)

  // Simplified specializations array
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
      setError('')
      console.log('Fetching nutritionists...')
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutri-vision-backend-production.up.railway.app/api'
      const response = await fetch(`${API_BASE_URL}/nutritionists/directory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      console.log('Nutritionists data:', data)
      
      if (data.success && data.nutritionists) {
        setNutritionists(data.nutritionists)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching nutritionists:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredNutritionists = nutritionists.filter(nutritionist => {
    const matchesSearch = !searchTerm || 
      nutritionist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutritionist.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutritionist.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutritionist.professional?.specializations?.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesSpecialization = !selectedSpecialization || 
      nutritionist.professional?.specializations?.includes(selectedSpecialization)

    return matchesSearch && matchesSpecialization
  })

  const handleVideoCall = (nutritionist) => {
    // Navigate to appointments page with video call intent
    navigate('/appointments', { state: { action: 'video-call', nutritionistId: nutritionist._id } })
  }

  const handleChat = (nutritionist) => {
    // Navigate to appointments page with chat intent
    navigate('/appointments', { state: { action: 'chat', nutritionistId: nutritionist._id } })
  }

  const handleBooking = async (nutritionist) => {
    setBookingNutritionistId(nutritionist._id)
    
    try {
      // Quick book appointment with default values
      const appointmentData = {
        nutritionistId: nutritionist._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        time: '10:00',
        sessionType: 'video',
        reason: 'I would like to schedule a consultation to discuss my nutrition and health goals.',
        duration: 60,
        notes: 'Initial consultation booking from directory'
      }

      const response = await api.post('/appointments/book', appointmentData)
      
      if (response.data.success) {
        toast.success(`Appointment booked with ${nutritionist.name}! Waiting for approval.`)
        // Navigate to appointments page to see the booking
        navigate('/appointments')
      }
    } catch (error) {
      console.error('Booking failed:', error)
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBookingNutritionistId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading nutritionists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error Loading Nutritionists</h3>
            <p className="mt-2">{error}</p>
          </div>
          <button 
            onClick={fetchNutritionists}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
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

      {/* Nutritionist List */}
      <div className="space-y-6">
        {filteredNutritionists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No nutritionists found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialization('')
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredNutritionists.map(nutritionist => (
            <div key={nutritionist._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                {/* Profile Image */}
                <div className="flex-shrink-0 mb-4 lg:mb-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {nutritionist.firstName?.[0] || 'N'}{nutritionist.lastName?.[0] || 'A'}
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        Dr. {nutritionist.firstName || 'Unknown'} {nutritionist.lastName || 'Unknown'}
                      </h3>
                      <p className="text-gray-600 mb-2">{nutritionist.professional?.qualification || 'Nutritionist'}</p>
                      
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
                          {nutritionist.location?.city || 'Remote Available'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {nutritionist.yearsOfExperience || nutritionist.professional?.experience || 5}+ years experience
                        </div>
                      </div>
                    </div>

                    {/* Consultation Rate */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{nutritionist.consultationRate || nutritionist.professional?.consultationFee || 1000}
                      </p>
                      <p className="text-sm text-gray-600">per session</p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(nutritionist.professional?.specializations || []).map(spec => (
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleVideoCall(nutritionist)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </button>
                    
                    <button
                      onClick={() => handleVideoCall(nutritionist)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Audio Call
                    </button>

                    <button
                      onClick={() => handleChat(nutritionist)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </button>

                    <button
                      onClick={() => handleBooking(nutritionist)}
                      disabled={bookingNutritionistId === nutritionist._id}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {bookingNutritionistId === nutritionist._id ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SafeNutritionistDirectory