import api from './api'

// AI Service endpoints
const AI_BASE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8002'

export const aiService = {
  // Food image recognition
  analyzeFood: async (imageFile) => {
    console.log('🍔 analyzeFood called with:', imageFile)
    console.log('File type:', typeof imageFile)
    console.log('File instanceof File:', imageFile instanceof File)
    console.log('File name:', imageFile?.name)
    console.log('File size:', imageFile?.size)
    
    const formData = new FormData()
    formData.append('file', imageFile)
    
    console.log('FormData created, entries:')
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value, typeof value)
    }
    
    const response = await fetch(`${AI_BASE_URL}/analyze-food`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to analyze food image')
    }
    
    return response.json()
  },

  // Meal recommendations using Ollama
  getMealRecommendations: async (preferences, goals, restrictions, mealType) => {
    const response = await api.post('/ai/meal-recommendations', {
      preferences,
      goals,
      restrictions,
      mealType,
    })
    return response.data
  },

  // Nutrition analysis
  analyzeNutrition: async (foodItems) => {
    const response = await api.post('/ai/nutrition-analysis', {
      foodItems,
    })
    return response.data
  },

  // Health score calculation
  calculateHealthScore: async (mealData) => {
    const response = await api.post('/ai/health-score', {
      mealData,
    })
    return response.data
  }
}

export const nutritionService = {
  // Get nutrition data from Edamam API
  searchFood: async (query) => {
    const response = await api.get(`/nutrition/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Get detailed nutrition information
  getNutritionDetails: async (foodId) => {
    const response = await api.get(`/nutrition/details/${foodId}`)
    return response.data
  },

  // Calculate recipe nutrition
  analyzeRecipe: async (ingredients) => {
    const response = await api.post('/nutrition/analyze-recipe', { ingredients })
    return response.data
  }
}

export const mealService = {
  // Get meal plans
  getMealPlans: async (startDate, endDate) => {
    const response = await api.get(`/meals/plans?start=${startDate}&end=${endDate}`)
    return response.data
  },

  // Create meal plan
  createMealPlan: async (mealPlanData) => {
    const response = await api.post('/meals/plans', mealPlanData)
    return response.data
  },

  // Log a meal
  logMeal: async (mealData) => {
    const response = await api.post('/meals/log', mealData)
    return response.data
  },

  // Get meal logs
  getMealLogs: async (startDate, endDate) => {
    const response = await api.get(`/meals/logs?start=${startDate}&end=${endDate}`)
    return response.data
  },

  // Update meal log
  updateMealLog: async (logId, updates) => {
    const response = await api.put(`/meals/logs/${logId}`, updates)
    return response.data
  },

  // Delete meal log
  deleteMealLog: async (logId) => {
    const response = await api.delete(`/meals/logs/${logId}`)
    return response.data
  }
}

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile')
    return response.data
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData)
    return response.data
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await api.get('/user/preferences')
    return response.data
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/user/preferences', preferences)
    return response.data
  },

  // Get user goals
  getGoals: async () => {
    const response = await api.get('/user/goals')
    return response.data
  },

  // Update user goals
  updateGoals: async (goals) => {
    const response = await api.put('/user/goals', goals)
    return response.data
  },

  // Get progress data
  getProgress: async (startDate, endDate) => {
    const response = await api.get(`/user/progress?start=${startDate}&end=${endDate}`)
    return response.data
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account')
    return response.data
  }
}