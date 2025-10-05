import { Link } from 'react-router-dom'
import { User, Stethoscope, ArrowRight, Check } from 'lucide-react'

const SignupSelection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">NV</span>
          </div>
        </div>
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-4">
          Join <span className="text-primary-600 font-bold">nutrivizion</span>
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Choose how you'd like to get started with us
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* User Signup Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                I'm a Patient
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Looking to improve your nutrition and get personalized meal plans
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">AI-powered food recognition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Personalized meal planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Track nutrition progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Connect with nutritionists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Health goal tracking</span>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group"
              >
                Get Started as Patient
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have a patient account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Nutritionist Signup Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-primary-200">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6 mx-auto">
                <Stethoscope className="h-8 w-8 text-primary-600" />
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  I'm a Nutritionist
                </h2>
                <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                  Professional
                </span>
              </div>
              
              <p className="text-gray-600 text-center mb-6">
                Join our platform to help patients achieve their nutrition goals
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Build your client base</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Video & chat consultations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Patient management tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Earnings tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Professional dashboard</span>
                </div>
              </div>

              <Link
                to="/nutritionist/register"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center group"
              >
                Join as Nutritionist
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already registered as nutritionist?{' '}
                <Link to="/nutritionist/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupSelection