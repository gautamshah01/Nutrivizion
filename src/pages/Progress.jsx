import { useState, useEffect } from 'react'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { Calendar, TrendingUp, Target, Award, Filter, Download } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { mealService, nutritionService } from '../services'
import '../utils/chartConfig.js' // Import Chart.js configuration

const Progress = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [progressData, setProgressData] = useState(null)
  const [nutritionTrends, setNutritionTrends] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Goal',
        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, goals } = useUser()

  useEffect(() => {
    loadProgressData()
  }, [timeRange])

  const loadProgressData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Import API service
      const { api } = await import('../services/api')
      
      // Fetch real progress data from backend
      const response = await api.get(`/progress/overview?timeRange=${timeRange}`)

      if (response.status === 200 && response.data) {
        const result = response.data
        setProgressData(result.data)
        
        // Format nutrition trends for chart
        const chartData = {
          labels: result.data.calorieIntake.map(day => {
            const date = new Date(day.date)
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric' 
            })
          }),
          datasets: [
            {
              label: 'Calories',
              data: result.data.calorieIntake.map(day => day.calories),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Goal',
              data: result.data.calorieIntake.map(day => day.goal),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderDash: [5, 5],
              tension: 0.4
            }
          ]
        }
        setNutritionTrends(chartData)
      } else {
        console.log('API response not successful, using empty data')
        // Set empty/zero data when API is not available
        const today = new Date()
        const weekData = []
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          weekData.push({
            date: date.toISOString().split('T')[0],
            calories: 0,
            goal: user?.profile?.targetCalories || 2000
          })
        }
        
        setProgressData({
          currentWeight: user?.profile?.weight || null,
          weightProgress: [],
          calorieIntake: weekData,
          avgDailyCalories: 0,
          mealsLogged: 0,
          achievements: 0,
          newAchievements: 0,
          macroDistribution: {
            protein: 0,
            carbs: 0,
            fat: 0
          },
          goalProgress: {
            weightLoss: 0,
            dailyCalorie: 0,
            proteinTarget: 0,
            exerciseGoal: 0
          },
          insights: [
            'Start logging your meals to see your progress here',
            'Track your nutrition to get personalized insights',
            'Set your goals to see your progress trends',
            'Your data will appear here once you begin tracking'
          ]
        })

        setNutritionTrends({
          labels: weekData.map(day => {
            const date = new Date(day.date)
            return date.toLocaleDateString('en-US', { 
              weekday: 'short'
            })
          }),
          datasets: [
            {
              label: 'Calories',
              data: weekData.map(day => day.calories),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Goal',
              data: weekData.map(day => day.goal),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderDash: [5, 5],
              tension: 0.4
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error loading progress data:', error)
      setError('Unable to load progress data. Using default values.')
      
      // Set fallback data on error
      const today = new Date()
      const weekData = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        weekData.push({
          date: date.toISOString().split('T')[0],
          calories: 0,
          goal: user?.profile?.targetCalories || 2000
        })
      }
      
      setProgressData({
        currentWeight: user?.profile?.weight || null,
        weightProgress: [],
        calorieIntake: weekData,
        avgDailyCalories: 0,
        mealsLogged: 0,
        achievements: 0,
        newAchievements: 0,
        macroDistribution: {
          protein: 0,
          carbs: 0,
          fat: 0
        },
        goalProgress: {
          weightLoss: 0,
          dailyCalorie: 0,
          proteinTarget: 0,
          exerciseGoal: 0
        },
        insights: [
          'Unable to load progress data. Please check your connection.',
          'Your data will appear here once the service is available.'
        ]
      })

      setNutritionTrends({
        labels: weekData.map(day => {
          const date = new Date(day.date)
          return date.toLocaleDateString('en-US', { 
            weekday: 'short'
          })
        }),
        datasets: [
          {
            label: 'Calories',
            data: weekData.map(day => day.calories),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Goal',
            data: weekData.map(day => day.goal),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      })
    }
    setLoading(false)
  }

  const macroChartData = {
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    datasets: [
      {
        data: progressData && progressData.macroDistribution ? [
          Math.max(0, progressData.macroDistribution.protein || 0),
          Math.max(0, progressData.macroDistribution.carbs || 0),
          Math.max(0, progressData.macroDistribution.fat || 0)
        ] : [25, 50, 25], // Default distribution instead of all zeros
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const weightChartData = {
    labels: progressData && progressData.weightProgress ? progressData.weightProgress.map(w => 
      new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) : [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: progressData && progressData.weightProgress ? progressData.weightProgress.map(w => w.weight) : [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0
      }
    }
  }

  const timeRanges = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600 mt-2">
              Monitor your nutrition journey and achievements
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button className="btn btn-outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData?.currentWeight ? `${progressData.currentWeight} kg` : 'N/A kg'}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">-0.4 kg this week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Daily Calories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData?.avgDailyCalories ? progressData.avgDailyCalories.toLocaleString() : '0'}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">Goal: 2,000</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meals Logged</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData?.mealsLogged || 0}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">+2 from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData?.achievementCount || 0}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">{progressData?.newAchievements || 0} new this week</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
            <div className="h-64">
              {weightChartData && weightChartData.labels && weightChartData.datasets ? (
                <Line data={weightChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No weight data available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Calorie Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorie Intake</h3>
            <div className="h-64">
              {nutritionTrends && nutritionTrends.labels && nutritionTrends.datasets ? (
                <Line data={nutritionTrends} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No data available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Macro Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              {macroChartData && macroChartData.labels && macroChartData.datasets ? (
                <div className="w-48 h-48">
                  <Doughnut data={macroChartData} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <div className="text-gray-500">
                  <p>No macro data available yet</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Protein {progressData?.macroDistribution?.protein || 0}%
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Carbs {progressData?.macroDistribution?.carbs || 0}%
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                Fat {progressData?.macroDistribution?.fat || 0}%
              </div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Weight Loss</span>
                  <span>{progressData?.goalProgress?.weightLoss || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressData?.goalProgress?.weightLoss || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Daily Calorie Goal</span>
                  <span>{progressData?.goalProgress?.dailyCalorie || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progressData?.goalProgress?.dailyCalorie || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Protein Target</span>
                  <span>{progressData?.goalProgress?.proteinTarget || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progressData?.goalProgress?.proteinTarget || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Exercise Goal</span>
                  <span>{progressData?.goalProgress?.exerciseGoal || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${progressData?.goalProgress?.exerciseGoal || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {Array.isArray(progressData?.achievements) && progressData.achievements.length > 0 ? (
                progressData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.earned ? (
                      <p className="text-xs text-green-600 mt-1">
                        Earned {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet. Keep tracking your meals to earn your first achievement!</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {progressData?.achievementCount ? 
                      `You have ${progressData.achievementCount} achievements total` : 
                      'Start logging your meals to see achievements here'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
            <div className="space-y-4">
              {progressData?.insights.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm">{insight}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">💡 This Week's Focus</h4>
              <p className="text-purple-700 text-sm">
                Based on your progress, we recommend focusing on increasing your vegetable intake 
                and maintaining your current protein levels. You're doing great with consistency!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress