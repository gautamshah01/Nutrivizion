import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, Heart } from 'lucide-react'
import '../../styles/logo.css'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="nutrivision-footer-logo bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-2 rounded-lg text-xl font-bold shadow-lg" 
                   style={{
                     backgroundImage: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                     fontFamily: 'system-ui, -apple-system, sans-serif',
                     letterSpacing: '-0.01em'
                   }}>
                nutrivizion
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI-powered nutrition planning made simple. Get personalized meal recommendations, 
              track your progress, and achieve your health goals with cutting-edge technology.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://github.com/gautamshah01" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/GautamShah05" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:gautamshah361@gmail.com" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">Get in touch with our team</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/meal-planner" className="text-gray-300 hover:text-white transition-colors">
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/food-scanner" className="text-gray-300 hover:text-white transition-colors">
                  Food Scanner
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-gray-300 hover:text-white transition-colors">
                  Progress Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 <span className="text-primary-400 font-semibold">nutrivizion</span>. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for better health
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer