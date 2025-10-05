import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, Camera, BarChart3, Calendar, Home, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/logo.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, userType, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, protected: true, userTypes: ['patient'] },
    { name: 'Meal Planner', href: '/meal-planner', icon: Calendar, protected: true, userTypes: ['patient'] },
    { name: 'Food Scanner', href: '/food-scanner', icon: Camera, protected: true, userTypes: ['patient'] },
    { name: 'Appointments', href: '/appointments', icon: Users, protected: true, userTypes: ['patient', 'nutritionist'] },
    { name: 'Progress', href: '/progress', icon: BarChart3, protected: true, userTypes: ['patient'] },
    { name: 'Profile', href: '/profile', icon: User, protected: true, userTypes: ['nutritionist'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.public || (item.protected && isAuthenticated && (!item.userTypes || item.userTypes.includes(userType)))
  )

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center logo-container">
              <div className="nutrivision-navbar-logo bg-gradient-to-r from-emerald-600 to-green-500 text-white px-3 py-1 rounded-lg text-lg font-bold shadow-lg" 
                   style={{
                     backgroundImage: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                     fontFamily: 'system-ui, -apple-system, sans-serif',
                     letterSpacing: '-0.01em'
                   }}>
                nutrivizion
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full btn btn-outline text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full btn btn-primary text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar