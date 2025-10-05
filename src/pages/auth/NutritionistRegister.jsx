import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, 
  GraduationCap, Award, Clock, FileText, 
  Check, ChevronRight, ChevronLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const NutritionistRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger
  } = useForm()

  const password = watch('password', '')
  const totalSteps = 4

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

  const onSubmit = async (data) => {
    if (step < totalSteps) {
      const isStepValid = await validateCurrentStep()
      if (isStepValid) {
        setStep(step + 1)
      }
      return
    }

    setLoading(true)
    
    try {
      // Split the full name into first and last name
      const nameParts = data.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''
      const username = data.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      
      const nutritionistData = {
        // Personal Info
        name: data.name,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        location: {
          city: data.city,
          country: data.country
        },
        
        // Professional Info
        professional: {
          qualification: data.qualification,
          certification: data.certification || '',
          license: data.license || '',
          experience: parseInt(data.experience),
          specializations: data.specializations || [],
          bio: data.bio || ''
        },
        
        // Agreements
        agreements: {
          terms: data.terms,
          privacy: data.privacy
        }
      }
      
      console.log('Sending nutritionist data:', nutritionistData)
      
      const response = await api.post('/nutritionist/auth/register', nutritionistData)
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('nutritionist_token', response.data.token)
        
        toast.success('Registration successful! Welcome to nutrivizion!')
        navigate('/nutritionist/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const validateCurrentStep = async () => {
    const fieldsToValidate = getFieldsForStep(step)
    return await trigger(fieldsToValidate)
  }

  const getFieldsForStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return ['name', 'email', 'phone', 'city', 'country']
      case 2:
        return ['qualification', 'experience', 'specializations']
      case 3:
        return ['password', 'confirmPassword']
      case 4:
        return ['terms', 'privacy']
      default:
        return []
    }
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo()
      case 2:
        return renderProfessionalInfo()
      case 3:
        return renderAccountSetup()
      case 4:
        return renderAgreements()
      default:
        return null
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Tell us about yourself</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <div className="relative">
          <input
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            type="text"
            className="input pl-10"
            placeholder="Enter your full name"
          />
          <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email'
              }
            })}
            type="email"
            className="input pl-10"
            placeholder="Enter your email"
          />
          <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <div className="relative">
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            type="tel"
            className="input pl-10"
            placeholder="Enter your phone number"
          />
          <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <div className="relative">
            <input
              {...register('city', {
                required: 'City is required'
              })}
              type="text"
              className="input pl-10"
              placeholder="Your city"
            />
            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <div className="relative">
            <input
              {...register('country', {
                required: 'Country is required'
              })}
              type="text"
              className="input pl-10"
              placeholder="Your country"
            />
            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
        </div>
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
        <p className="text-sm text-gray-600">Your qualifications and expertise</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Highest Qualification *
        </label>
        <div className="relative">
          <input
            {...register('qualification', {
              required: 'Qualification is required'
            })}
            type="text"
            className="input pl-10"
            placeholder="e.g., Master's in Nutrition Science"
          />
          <GraduationCap className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Certification or License
        </label>
        <div className="relative">
          <input
            {...register('certification')}
            type="text"
            className="input pl-10"
            placeholder="e.g., Registered Dietitian (RD)"
          />
          <Award className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <div className="relative">
          <input
            {...register('experience', {
              required: 'Experience is required',
              min: { value: 0, message: 'Experience cannot be negative' },
              pattern: {
                value: /^\d+$/,
                message: 'Please enter a valid number'
              }
            })}
            type="number"
            min="0"
            className="input pl-10"
            placeholder="0"
          />
          <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Area of Specialization *
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {specializations.map((spec) => (
            <label key={spec} className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('specializations', {
                  required: 'Please select at least one specialization'
                })}
                type="checkbox"
                value={spec}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{spec}</span>
            </label>
          ))}
        </div>
        {errors.specializations && <p className="mt-1 text-sm text-red-600">{errors.specializations.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Bio
        </label>
        <textarea
          {...register('bio', {
            maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' }
          })}
          rows={4}
          className="input"
          placeholder="Tell patients about your approach and experience (optional)"
        />
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
      </div>
    </div>
  )

  const renderAccountSetup = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Setup</h3>
        <p className="text-sm text-gray-600">Secure your account</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            type={showPassword ? 'text' : 'password'}
            className="input pl-10 pr-10"
            placeholder="Create a strong password"
          />
          <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match'
            })}
            type={showConfirmPassword ? 'text' : 'password'}
            className="input pl-10 pr-10"
            placeholder="Confirm your password"
          />
          <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Optional Document Upload</h3>
            <p className="mt-1 text-sm text-blue-700">
              You can upload your certificates or license documents later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAgreements = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Terms & Agreements</h3>
        <p className="text-sm text-gray-600">Please review and accept</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            {...register('terms', {
              required: 'You must agree to the Terms & Conditions'
            })}
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500 underline">
              Terms & Conditions
            </Link>{' '}
            and understand my responsibilities as a nutritionist on this platform.
          </label>
        </div>
        {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}

        <div className="flex items-start space-x-3">
          <input
            {...register('privacy', {
              required: 'You must consent to the Privacy Policy'
            })}
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm text-gray-700">
            I consent to data use as per the{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.privacy && <p className="mt-1 text-sm text-red-600">{errors.privacy.message}</p>}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <Check className="h-5 w-5 text-green-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Account Verification</h3>
            <p className="mt-1 text-sm text-green-700">
              Your account will be reviewed and verified by our team. You'll receive an email once approved to start consulting with patients.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">NV</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Join as a Nutritionist
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/nutritionist/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i + 1 <= step
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`h-1 w-8 mx-2 ${
                        i + 1 < step ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
              )}

              <div className="ml-auto">
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link to="/register" className="text-sm text-gray-600 hover:text-gray-900">
                Looking to join as a patient instead?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionistRegister