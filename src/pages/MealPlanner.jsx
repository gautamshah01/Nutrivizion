import { useState, useEffect } from 'react'
import { Calendar, ChefHat, Clock, Users, Star, Bookmark } from 'lucide-react'
import { aiService, mealService } from '../services'
import { useUser } from '../contexts/UserContext'
import toast from 'react-hot-toast'

const MealPlanner = () => {
  const [activeTab, setActiveTab] = useState('recommendations')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMealType, setSelectedMealType] = useState('lunch')
  const [recommendations, setRecommendations] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const { preferences, goals } = useUser()

  useEffect(() => {
    loadMealPlans()
  }, [selectedDate])

  const loadMealPlans = async () => {
    try {
      const plans = await mealService.getMealPlans(selectedDate, selectedDate)
      setMealPlans(plans)
    } catch (error) {
      console.error('Error loading meal plans:', error)
    }
  }

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const result = await aiService.getMealRecommendations(
        preferences,
        goals,
        preferences.dietaryRestrictions,
        selectedMealType
      )
      setRecommendations(result.recommendations || [])
      toast.success('New recommendations generated!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error('Failed to generate recommendations')
      // Fallback mock data
      setRecommendations([
        {
          name: 'Grilled Chicken Salad',
          description: 'Fresh mixed greens with grilled chicken, avocado, and light vinaigrette',
          ingredients: [
            { name: 'Chicken breast', quantity: 150, unit: 'g' },
            { name: 'Mixed greens', quantity: 100, unit: 'g' },
            { name: 'Avocado', quantity: 50, unit: 'g' },
            { name: 'Cherry tomatoes', quantity: 100, unit: 'g' }
          ],
          instructions: [
            'Season and grill chicken breast',
            'Prepare mixed greens',
            'Slice avocado and tomatoes',
            'Combine all ingredients and serve'
          ],
          prep_time: 10,
          cook_time: 15,
          difficulty: 'easy',
          health_score: 85,
          estimated_nutrition: {
            calories: 420,
            protein: 35,
            carbs: 12,
            fat: 18,
            fiber: 8
          },
          tags: ['high-protein', 'low-carb', 'gluten-free']
        }
      ])
    }
    setLoading(false)
  }

  const saveMealToPlan = async (meal) => {
    try {
      await mealService.createMealPlan({
        name: `${selectedMealType} - ${meal.name}`,
        startDate: selectedDate,
        endDate: selectedDate,
        meals: [{
          date: selectedDate,
          mealType: selectedMealType,
          recipe: {
            name: meal.name,
            description: meal.description,
            instructions: meal.instructions,
            prepTime: meal.prep_time,
            cookTime: meal.cook_time,
            difficulty: meal.difficulty
          },
          ingredients: meal.ingredients,
          totalNutrition: meal.estimated_nutrition,
          healthScore: meal.health_score,
          tags: meal.tags
        }]
      })
      toast.success('Meal added to your plan!')
      loadMealPlans()
    } catch (error) {
      console.error('Error saving meal:', error)
      toast.error('Failed to save meal')
    }
  }

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
          <p className="text-gray-600 mt-2">
            Get AI-powered meal recommendations and plan your nutrition
          </p>
        </div>

        {/* Date and Meal Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input pl-10"
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedMealType(type.value)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedMealType === type.value
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'recommendations'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChefHat className="h-4 w-4 inline mr-2" />
                AI Recommendations
              </button>
              <button
                onClick={() => setActiveTab('planned')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'planned'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Planned Meals
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'recommendations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Recommendations
                  </h2>
                  <button
                    onClick={generateRecommendations}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      'Get New Recommendations'
                    )}
                  </button>
                </div>

                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600">
                      Click "Get New Recommendations" to generate personalized meal suggestions
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recommendations.map((meal, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(meal.difficulty)}`}>
                                {meal.difficulty}
                              </span>
                              <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {meal.health_score}/100
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{meal.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {meal.prep_time + meal.cook_time} min
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              1 serving
                            </div>
                          </div>

                          {/* Nutrition Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Nutrition</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Calories: {meal.estimated_nutrition.calories}</div>
                              <div>Protein: {meal.estimated_nutrition.protein}g</div>
                              <div>Carbs: {meal.estimated_nutrition.carbs}g</div>
                              <div>Fat: {meal.estimated_nutrition.fat}g</div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {meal.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => saveMealToPlan(meal)}
                              className="flex-1 btn btn-primary text-sm"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Plan
                            </button>
                            <button className="btn btn-outline text-sm">
                              <Bookmark className="h-4 w-4 mr-2" />
                              Save Recipe
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'planned' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Planned Meals for {new Date(selectedDate).toLocaleDateString()}
                </h2>

                {mealPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No meals planned</h3>
                    <p className="text-gray-600">
                      Add meals from the recommendations tab or create custom meal plans
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mealPlans.map((plan, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            <p className="text-gray-600">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {plan.meals?.length || 0} meals
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealPlanner