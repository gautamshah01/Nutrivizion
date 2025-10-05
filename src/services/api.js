import axios from 'axios'

// Environment-based API URLs with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8002'
const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:8003'

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
  const formData = new FormData()
  formData.append('file', imageFile)
  
  const response = await aiApi.post('/recognize-food', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
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