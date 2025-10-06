import axios from 'axios'

// Environment-based API URLs with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutri-vision-backend-production.up.railway.app/api'
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://nutri-vision-backend-production.up.railway.app/api'
const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'https://nutri-vision-backend-production.up.railway.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AI Services API instance
const aiApi = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Food recognition and nutrition analysis functions
export const recognizeFood = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    console.log('Calling food recognition API:', AI_API_URL + '/recognize-food')
    
    const response = await aiApi.post('/recognize-food', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000
    })
    
    console.log('Food recognition response:', response.data)
    return response.data
  } catch (error) {
    console.error('Food recognition API error:', error)
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    })
    throw error
  }
}

export const analyzeNutrition = async (foodName) => {
  const response = await aiApi.post('/analyze-nutrition', {
    food_name: foodName
  })
  return response.data
}

export const getAIHealth = async () => {
  const response = await aiApi.get('/health')
  return response.data
}

export const getFoodClasses = async () => {
  const response = await aiApi.get('/classes')
  return response.data
}

// Ollama/LLM API for meal recommendations
const ollamaApi = axios.create({
  baseURL: OLLAMA_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const generateMealPlan = async (preferences) => {
  const response = await ollamaApi.post('/generate-meal-plan', preferences)
  return response.data
}

export const getMealRecommendations = async (userProfile, foodPreferences) => {
  const response = await ollamaApi.post('/recommend-meals', {
    user_profile: userProfile,
    preferences: foodPreferences
  })
  return response.data
}

export { aiApi, ollamaApi }
export default api