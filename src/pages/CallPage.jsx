import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CallInterface from '../components/communication/CallInterface'
import api from '../services/api'

const CallPage = () => {
  const { appointmentId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true)
        
        // Determine API endpoint based on user type
        const endpoint = user?.role === 'nutritionist' 
          ? `/appointments/nutritionist?appointmentId=${appointmentId}`
          : `/appointments/patient?appointmentId=${appointmentId}`
        
        const response = await api.get(endpoint)
        
        // Find the specific appointment
        let foundAppointment = null
        if (response.data.appointments) {
          foundAppointment = response.data.appointments.find(apt => apt._id === appointmentId)
        } else if (response.data._id === appointmentId) {
          foundAppointment = response.data
        }

        if (foundAppointment) {
          setAppointment(foundAppointment)
        } else {
          setError('Appointment not found')
        }
      } catch (error) {
        console.error('Failed to fetch appointment:', error)
        setError('Failed to load appointment')
      } finally {
        setLoading(false)
      }
    }

    if (appointmentId && user) {
      fetchAppointment()
    }
  }, [appointmentId, user])

  const handleCallEnd = () => {
    console.log('Call ended, navigating back to appointments')
    navigate('/appointments')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading call...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Appointment not found</p>
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <CallInterface
        isOpen={true}
        onClose={handleCallEnd}
        appointment={appointment}
        callType="video" // Default to video, can be modified based on URL params
      />
    </div>
  )
}

export default CallPage