import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Calendar, Ruler, Scale } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  console.log('Register component rendering')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [validating, setValidating] = useState(false)
  const { register: registerUser, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  
  console.log('Register component state:', { step, loading, error, validating })
  
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async (data) => {
    clearError()
    
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      profile: {
        age: parseInt(data.age),
        gender: data.gender,
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        activityLevel: data.activityLevel
      }
    }
    
    const result = await registerUser(userData)
    
    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  const nextStep = async () => {
    console.log('nextStep called')
    try {
      setValidating(true)
      // Validate step 1 fields before proceeding
      const step1Fields = ['name', 'email', 'password', 'confirmPassword']
      console.log('Validating fields:', step1Fields)
      const isValid = await trigger(step1Fields)
      console.log('Validation result:', isValid)
      
      if (isValid) {
        console.log('Moving to step 2')
        setStep(step + 1)
      } else {
        console.log('Validation failed')
        toast.error('Please fill in all required fields correctly')
      }
    } catch (error) {
      console.error('Validation error:', error)
      toast.error('An error occurred during validation')
    } finally {
      setValidating(false)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">NV</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Account</span>
              <span className="text-xs text-gray-500">Profile</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
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
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
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
                      placeholder="Create a password"
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === password || 'Passwords do not match'
                      })}
                      type="password"
                      className="input pl-10"
                      placeholder="Confirm your password"
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading || validating}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating ? 'Validating...' : loading ? 'Please wait...' : 'Continue to Profile Setup'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('age', {
                          required: 'Age is required',
                          min: { value: 13, message: 'Must be at least 13' },
                          max: { value: 120, message: 'Must be less than 120' }
                        })}
                        type="number"
                        className="input pl-10"
                        placeholder="25"
                      />
                      <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      {...register('gender', { required: 'Gender is required' })}
                      className="mt-1 input"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Height (cm)
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('height', {
                          required: 'Height is required',
                          min: { value: 100, message: 'Height must be at least 100cm' },
                          max: { value: 300, message: 'Height must be less than 300cm' }
                        })}
                        type="number"
                        step="0.1"
                        className="input pl-10"
                        placeholder="170"
                      />
                      <Ruler className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.height && (
                      <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('weight', {
                          required: 'Weight is required',
                          min: { value: 30, message: 'Weight must be at least 30kg' },
                          max: { value: 500, message: 'Weight must be less than 500kg' }
                        })}
                        type="number"
                        step="0.1"
                        className="input pl-10"
                        placeholder="70"
                      />
                      <Scale className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                    Activity Level
                  </label>
                  <select
                    {...register('activityLevel', { required: 'Activity level is required' })}
                    className="mt-1 input"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                    <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                    <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                    <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
                  </select>
                  {errors.activityLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 btn btn-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register