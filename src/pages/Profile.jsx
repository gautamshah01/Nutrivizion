import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Camera, Bell, Shield, Heart, Target, Save, Edit3, AlertTriangle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import { userService } from '../services'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [editing, setEditing] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [accountDeleted, setAccountDeleted] = useState(false)
  const { user, logout } = useAuth()
  const { updateProfile, preferences, goals, updatePreferences, updateGoals } = useUser()
  const navigate = useNavigate()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: user?.profile?.age || '',
      gender: user?.profile?.gender || '',
      height: user?.profile?.height || '',
      weight: user?.profile?.weight || '',
      activityLevel: user?.profile?.activityLevel || 'moderate'
    }
  })

  const onSubmit = async (data) => {
    try {
      await updateProfile(data)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handlePreferencesSubmit = async (data) => {
    try {
      await updatePreferences(data)
      toast.success('Preferences updated successfully!')
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
    }
  }

  const handleGoalsSubmit = async (data) => {
    try {
      await updateGoals(data)
      toast.success('Goals updated successfully!')
    } catch (error) {
      console.error('Error updating goals:', error)
      toast.error('Failed to update goals')
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await userService.deleteAccount()
      setAccountDeleted(true)
      toast.success('Account deleted successfully')
      
      // Log out the user and redirect to home page after a short delay
      setTimeout(() => {
        logout()
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { value: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extra', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ]

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 
    'Low Carb', 'Low Fat', 'Gluten Free', 'Dairy Free'
  ]

  const healthConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
    'Food Allergies', 'Celiac Disease', 'IBS', 'PCOS'
  ]

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'health', label: 'Health & Goals', icon: Heart },
    { id: 'preferences', label: 'Preferences', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-outline"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 inline mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      disabled={!editing}
                      className="input"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      disabled={!editing}
                      type="email"
                      className="input"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      {...register('age', { required: 'Age is required', min: 1, max: 120 })}
                      disabled={!editing}
                      type="number"
                      className="input"
                      placeholder="Enter your age"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select {...register('gender')} disabled={!editing} className="input">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      {...register('height', { required: 'Height is required' })}
                      disabled={!editing}
                      type="number"
                      className="input"
                      placeholder="Enter your height"
                    />
                    {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      {...register('weight', { required: 'Weight is required' })}
                      disabled={!editing}
                      type="number"
                      step="0.1"
                      className="input"
                      placeholder="Enter your weight"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <div className="space-y-3">
                    {activityLevels.map((level) => (
                      <label key={level.value} className="flex items-start">
                        <input
                          {...register('activityLevel')}
                          disabled={!editing}
                          type="radio"
                          value={level.value}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{level.label}</div>
                          <div className="text-sm text-gray-600">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Health & Goals Tab */}
            {activeTab === 'health' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Goal
                      </label>
                      <select className="input">
                        <option>Weight Loss</option>
                        <option>Weight Gain</option>
                        <option>Muscle Building</option>
                        <option>Maintenance</option>
                        <option>General Health</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Weight (kg)
                      </label>
                      <input type="number" step="0.1" className="input" placeholder="Enter target weight" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Calorie Goal
                      </label>
                      <input type="number" className="input" placeholder="Auto-calculated" readOnly />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekly Weight Change Goal
                      </label>
                      <select className="input">
                        <option>-1.0 kg/week (Aggressive)</option>
                        <option>-0.5 kg/week (Moderate)</option>
                        <option>-0.25 kg/week (Conservative)</option>
                        <option>Maintain current weight</option>
                        <option>+0.25 kg/week (Lean gain)</option>
                        <option>+0.5 kg/week (Moderate gain)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Conditions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {healthConditions.map((condition) => (
                      <label key={condition} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Calculated Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">BMI:</span>
                      <span className="font-medium ml-2">23.4</span>
                    </div>
                    <div>
                      <span className="text-blue-700">BMR:</span>
                      <span className="font-medium ml-2">1,680 cal</span>
                    </div>
                    <div>
                      <span className="text-blue-700">TDEE:</span>
                      <span className="font-medium ml-2">2,184 cal</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Body Fat:</span>
                      <span className="font-medium ml-2">18%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dietaryOptions.map((diet) => (
                      <label key={diet} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Allergies & Restrictions</h3>
                  <textarea
                    className="input h-24"
                    placeholder="List any food allergies, intolerances, or specific foods you avoid..."
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Cuisine
                      </label>
                      <select className="input">
                        <option>No preference</option>
                        <option>Mediterranean</option>
                        <option>Asian</option>
                        <option>American</option>
                        <option>Mexican</option>
                        <option>Indian</option>
                        <option>Italian</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cooking Skill Level
                      </label>
                      <select className="input">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Cooking Time
                      </label>
                      <select className="input">
                        <option>15 minutes or less</option>
                        <option>15-30 minutes</option>
                        <option>30-60 minutes</option>
                        <option>1+ hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select className="input">
                        <option>Budget-friendly</option>
                        <option>Moderate</option>
                        <option>Premium</option>
                        <option>No limit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Meal Reminders</h4>
                      <p className="text-sm text-gray-600">Get notified when it's time to log your meals</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Goal Progress</h4>
                      <p className="text-sm text-gray-600">Weekly progress updates and achievements</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">AI Recommendations</h4>
                      <p className="text-sm text-gray-600">Personalized meal and nutrition suggestions</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                      <p className="text-sm text-gray-600">Detailed nutrition and progress reports</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Notification Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breakfast Reminder
                      </label>
                      <input type="time" className="input" defaultValue="08:00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lunch Reminder
                      </label>
                      <input type="time" className="input" defaultValue="12:30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dinner Reminder
                      </label>
                      <input type="time" className="input" defaultValue="19:00" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Data Analytics</h4>
                      <p className="text-sm text-gray-600">Help improve our AI by sharing anonymized data</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                      <p className="text-sm text-gray-600">Receive newsletters and product updates</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>

                {!accountDeleted ? (
                  <>
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
                      <div className="space-y-3">
                        <button className="btn btn-outline w-full md:w-auto">
                          Download My Data
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirmation(true)}
                          disabled={isDeleting}
                          className="btn btn-outline w-full md:w-auto text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <button className="btn btn-primary btn-sm">
                        Enable 2FA
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-green-900 mb-1">Account Deleted</h4>
                      <p className="text-sm text-green-700">
                        Your account has been successfully deleted. You will be redirected shortly.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Account
                </h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Your profile and personal information</li>
                <li>All meal plans and recommendations</li>
                <li>Progress tracking data</li>
                <li>Chat history with nutritionists</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile