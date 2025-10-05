import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, MessageSquare, Phone, Video, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AppointmentBooking = ({ nutritionist, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      sessionType: 'video',
      duration: 60
    }
  })

  const watchSessionType = watch('sessionType')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await api.post('/appointments/book', {
        ...data,
        nutritionistId: nutritionist._id
      })

      if (response.data.success) {
        toast.success('Appointment booked successfully!')
        onSuccess && onSuccess(response.data.appointment)
        onClose && onClose()
      }
    } catch (error) {
      console.error('Appointment booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      timeSlots.push({ value: time, label: displayTime })
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
                <p className="text-gray-600">with {nutritionist.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nutritionist Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{nutritionist.name}</h3>
                <p className="text-sm text-gray-600">{nutritionist.professional?.qualification}</p>
                <p className="text-sm text-gray-500">{nutritionist.professional?.experience} years experience</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">
                  ₹{nutritionist.consultationRate || 1000}/session
                </p>
                <p className="text-xs text-gray-500">Consultation Fee</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Select Date
              </label>
              <input
                {...register('date', { required: 'Date is required' })}
                type="date"
                min={minDate}
                className="input w-full"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Select Time
              </label>
              <select
                {...register('time', { required: 'Time is required' })}
                className="input w-full"
              >
                <option value="">Choose a time</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Session Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="relative">
                  <input
                    {...register('sessionType', { required: 'Session type is required' })}
                    type="radio"
                    value="video"
                    className="sr-only peer"
                  />
                  <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-colors">
                    <Video className="w-6 h-6 text-gray-600 peer-checked:text-primary-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-700">Video Call</span>
                  </div>
                </label>
                
                <label className="relative">
                  <input
                    {...register('sessionType')}
                    type="radio"
                    value="phone"
                    className="sr-only peer"
                  />
                  <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-colors">
                    <Phone className="w-6 h-6 text-gray-600 peer-checked:text-primary-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-700">Phone Call</span>
                  </div>
                </label>
                
                <label className="relative">
                  <input
                    {...register('sessionType')}
                    type="radio"
                    value="chat"
                    className="sr-only peer"
                  />
                  <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-6 h-6 text-gray-600 peer-checked:text-primary-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-700">Chat Only</span>
                  </div>
                </label>
              </div>
              {errors.sessionType && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionType.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration
              </label>
              <select
                {...register('duration', { required: 'Duration is required' })}
                className="input w-full"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Consultation
              </label>
              <textarea
                {...register('reason', { 
                  required: 'Reason is required',
                  minLength: { value: 10, message: 'Please provide at least 10 characters' }
                })}
                rows={4}
                className="input w-full"
                placeholder="Please describe your health goals, concerns, or what you'd like to discuss..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input w-full"
                placeholder="Any specific dietary restrictions, medications, or other information..."
              />
            </div>

            {/* Session Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Session Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your appointment will require approval from the nutritionist</li>
                <li>• You'll receive a notification once approved</li>
                {watchSessionType === 'video' && (
                  <li>• Video call link will be provided after approval</li>
                )}
                {watchSessionType === 'phone' && (
                  <li>• Phone call details will be shared after approval</li>
                )}
                <li>• Chat feature will be enabled after approval</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking