import { useState, useEffect } from 'react'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { Calendar, Target, TrendingUp, Apple, Camera, Plus, Users, MessageCircle, Video } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import SafeNutritionistDirectory from '../components/patient/SafeNutritionistDirectory'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const Dashboard = () => {
  const { user } = useAuth()
  const { goals, dailyStats } = useUser()
  const [weeklyData, setWeeklyData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Fetch weekly data
    // For demo, using mock data
    setWeeklyData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      calories: [1850, 2100, 1950, 2200, 1980, 2050, 1900],
      protein: [120, 140, 135, 150, 130, 145, 125],
      weight: [70.2, 70.1, 70.0, 69.9, 69.8, 69.9, 69.7]
    })
  }, [])

  const calorieProgressData = {
    labels: ['Consumed', 'Remaining'],
    datasets: [
      {
        data: [dailyStats.calories, Math.max(0, goals.targetCalories - dailyStats.calories)],
        backgroundColor: ['#22c55e', '#e5e7eb'],
        borderColor: ['#16a34a', '#d1d5db'],
        borderWidth: 1,
      },
    ],
  }

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [dailyStats.protein, dailyStats.carbs, dailyStats.fat],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#dc2626'],
        borderWidth: 1,
      },
    ],
  }

  const weeklyCaloriesData = weeklyData ? {
    labels: weeklyData.labels,
    datasets: [
      {
        label: 'Daily Calories',
        data: weeklyData.calories,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Target',
        data: new Array(7).fill(goals.targetCalories),
        borderColor: '#ef4444',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
      },
    ],
  } : null

  const quickActions = [
    {
      title: 'Scan Food',
      description: 'Take a photo to log your meal',
      icon: Camera,
      link: '/food-scanner',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Plan Meals',
      description: 'Get AI meal recommendations',
      icon: Calendar,
      link: '/meal-planner',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'View Progress',
      description: 'Check your nutrition trends',
      icon: TrendingUp,
      link: '/progress',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Log Food',
      description: 'Manually add food items',
      icon: Plus,
      link: '/food-scanner',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Find Nutritionist',
      description: 'Connect with certified nutritionists',
      icon: Users,
      action: () => setActiveTab('nutritionists'),
      color: 'bg-indigo-100 text-indigo-600'
    }
  ]

  const todayGoals = [
    {
      label: 'Calories',
      current: dailyStats.calories,
      target: goals.targetCalories,
      unit: 'kcal',
      color: 'text-green-600'
    },
    {
      label: 'Protein',
      current: dailyStats.protein,
      target: goals.targetProtein,
      unit: 'g',
      color: 'text-blue-600'
    },
    {
      label: 'Carbs',
      current: dailyStats.carbs,
      target: goals.targetCarbs,
      unit: 'g',
      color: 'text-yellow-600'
    },
    {
      label: 'Fat',
      current: dailyStats.fat,
      target: goals.targetFat,
      unit: 'g',
      color: 'text-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your nutrition overview for today
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nutritionists')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'nutritionists'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline-block mr-2" />
              Nutritionists
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                
                if (action.link) {
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="card hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                } else {
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="card hover:shadow-md transition-shadow cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                }
              })}
            </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Goals */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Progress</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {todayGoals.map((goal, index) => {
                  const percentage = Math.min(100, (goal.current / goal.target) * 100)
                  return (
                    <div key={index} className="text-center">
                      <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
                            className={goal.color}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-sm font-semibold text-gray-900">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{goal.label}</h3>
                      <p className="text-sm text-gray-600">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Calorie Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calorie Breakdown</h2>
            <div className="relative h-48">
              <Doughnut
                data={calorieProgressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Calories */}
              {weeklyCaloriesData && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Calories</h2>
                  <div className="h-64">
                    <Line
                      data={weeklyCaloriesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Macro Distribution */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Macros</h2>
                <div className="h-64">
                  <Doughnut
                    data={macroData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'nutritionists' && (
          <SafeNutritionistDirectory currentUser={user} />
        )}
      </div>
    </div>
  )
}

export default Dashboard