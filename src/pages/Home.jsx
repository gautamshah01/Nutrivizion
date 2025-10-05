import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Brain, BarChart3, Target, Zap, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/landing.css'
import '../styles/logo.css'

// Custom CSS for additional animations
const heroAnimationStyle = {
  animation: 'fadeInUp 1s ease-out'
}

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized meal suggestions based on your goals, preferences, and dietary restrictions using advanced AI.'
    },
    {
      icon: Camera,
      title: 'Smart Food Recognition',
      description: 'Simply take a photo of your food and our computer vision technology will identify and calculate calories instantly.'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your nutrition journey with detailed analytics, charts, and insights to stay on track.'
    },
    {
      icon: Target,
      title: 'Goal-Oriented Planning',
      description: 'Set and achieve your health goals with customized meal plans that adapt to your lifestyle.'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Get instant nutrition analysis and health scores for your meals to make informed decisions.'
    },
    {
      icon: Users,
      title: 'Connect with Nutritionists',
      description: 'Book consultations with certified nutritionists and get personalized guidance for your health goals.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-white/60 to-orange-50/70 enhanced-blur-bg"></div>
          <img 
            src="/images/nutrition-bg.jpg" 
            alt="Fresh vegetables and fruits nutrition background"
            className="w-full h-full object-cover opacity-40 blur-sm"
            onError={(e) => {
              e.target.style.display = 'none'
              // Fallback pattern using CSS gradients with more blur
              e.target.parentElement.style.background = `
                linear-gradient(135deg, 
                  rgba(34, 197, 94, 0.1) 0%, 
                  rgba(255, 255, 255, 0.7) 25%, 
                  rgba(249, 115, 22, 0.1) 50%,
                  rgba(34, 197, 94, 0.1) 75%,
                  rgba(255, 255, 255, 0.7) 100%
                ),
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(34, 197, 94, 0.05) 20px,
                  rgba(34, 197, 94, 0.05) 40px
                )`
              e.target.parentElement.style.backdropFilter = 'blur(15px)'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" style={heroAnimationStyle}>
            {/* NutriVizion Logo */}
            <div className="flex justify-center mb-8">
              <div className="nutrivision-hero-logo bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-4 rounded-2xl text-4xl md:text-5xl font-bold shadow-2xl transform hover:scale-105 transition-transform duration-300" 
                   style={{
                     backgroundImage: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                     fontFamily: 'system-ui, -apple-system, sans-serif',
                     letterSpacing: '-0.02em'
                   }}>
                nutrivizion
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 drop-shadow-lg">
              <span className="typing-text text-primary-600 inline-block">Your AI-Powered Nutrition Partner</span>
            </h1>
            <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto drop-shadow-md hero-content-bg rounded-xl p-6 font-medium">
              Transform your health journey with personalized meal recommendations, 
              smart food recognition, and comprehensive progress tracking powered by cutting-edge AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Get Started Free
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/login" className="btn btn-outline text-lg px-8 py-3 shadow-md hover:shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
                      Sign In
                    </Link>

                  </div>
                </>
              )}
            </div>
            
            {/* Floating Icons for Visual Enhancement */}
            <div className="absolute top-20 left-10 opacity-20 animate-bounce">
              <div className="w-8 h-8 bg-green-400 rounded-full"></div>
            </div>
            <div className="absolute top-32 right-16 opacity-20 animate-pulse">
              <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-20 left-20 opacity-20 animate-bounce delay-1000">
              <div className="w-5 h-5 bg-red-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-32 right-12 opacity-20 animate-pulse delay-500">
              <div className="w-7 h-7 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Health Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed nutrition decisions and achieve your health goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
              Built with cutting-edge AI and machine learning technologies for accurate and reliable results.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                name: 'TensorFlow', 
                description: 'Deep Learning',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#FF6F00">
                    <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168-1.747zm21.416 5.856L12.46 24V0l4.095 2.378v14.019l6.168 1.747z"/>
                  </svg>
                )
              },
              { 
                name: 'OpenCV', 
                description: 'Computer Vision',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#5C3EE8">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 3.6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 2.4c1.99 0 3.6 1.61 3.6 3.6s-1.61 3.6-3.6 3.6-3.6-1.61-3.6-3.6S10.01 8.4 12 8.4z"/>
                  </svg>
                )
              },
              { 
                name: 'Llama 3.1', 
                description: 'Language Model',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#4F46E5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )
              },
              { 
                name: 'React', 
                description: 'Frontend Framework',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#61DAFB">
                    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89c-1.03 0-1.87-.84-1.87-1.89s.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26S20.07 10.37 17.97 9.74c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26z"/>
                  </svg>
                )
              },
              { 
                name: 'Node.js', 
                description: 'Backend Runtime',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#339933">
                    <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.890V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.274-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
                  </svg>
                )
              },
              { 
                name: 'MongoDB', 
                description: 'Database',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#47A248">
                    <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/>
                  </svg>
                )
              },
              { 
                name: 'Ollama', 
                description: 'Local AI',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#000000">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                )
              },
              { 
                name: 'Nutritionix API', 
                description: 'Nutrition Data',
                logo: (
                  <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="#FF6B35">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="8" cy="8" r="2" fill="#4CAF50"/>
                    <circle cx="16" cy="8" r="2" fill="#2196F3"/>
                    <circle cx="12" cy="16" r="2" fill="#FF9800"/>
                  </svg>
                )
              }
            ].map((tech, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl mb-3 border border-gray-100 group-hover:border-primary-200">
                  <div className="mb-3">
                    {tech.logo}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{tech.name}</h4>
                </div>
                <p className="text-sm text-gray-700 font-medium">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with Nutritionists Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect with Expert Nutritionists
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get personalized guidance from certified nutrition professionals. Book consultations, 
              get custom meal plans, and achieve your health goals with expert support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1-on-1 Consultations</h3>
              <p className="text-gray-600">Personal video consultations with certified nutritionists</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Meal Plans</h3>
              <p className="text-gray-600">Personalized nutrition plans tailored to your goals</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your health journey with professional guidance</p>
            </div>
          </div>
          
          <div className="text-center">
            {isAuthenticated ? (
              <Link to="/nutritionists" className="btn btn-primary text-lg px-8 py-3 shadow-md hover:shadow-lg">
                Browse Nutritionists
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Sign up to connect with our network of certified nutritionists</p>
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3 shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already achieving their health goals with <span className="text-white font-semibold">nutrivizion</span>.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-3">
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home