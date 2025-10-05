import { createContext, useContext, useReducer } from 'react'
import api from '../services/api'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } }
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload }
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } }
    case 'SET_GOALS':
      return { ...state, goals: action.payload }
    case 'UPDATE_GOALS':
      return { ...state, goals: { ...state.goals, ...action.payload } }
    case 'ADD_MEAL_LOG':
      return { 
        ...state, 
        mealLogs: [...state.mealLogs, action.payload] 
      }
    case 'SET_MEAL_LOGS':
      return { ...state, mealLogs: action.payload }
    case 'UPDATE_DAILY_STATS':
      return { ...state, dailyStats: action.payload }
    default:
      return state
  }
}

const initialState = {
  profile: null,
  preferences: {
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    mealsPerDay: 3,
    caloriesTolerance: 50
  },
  goals: {
    weightGoal: 'maintain',
    activityLevel: 'moderate',
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 70
  },
  mealLogs: [],
  dailyStats: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const setProfile = (profile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  const updateProfile = async (updates) => {
    try {
      // Get userType from localStorage to determine which endpoint to use
      const userType = localStorage.getItem('userType') || 'patient'
      const endpoint = userType === 'nutritionist' ? '/nutritionist/profile' : '/user/profile'
      
      // Format data for backend - user endpoint expects nested profile structure
      let formattedData = updates
      if (userType === 'patient') {
        const { name, email, ...profileData } = updates
        formattedData = {
          name,
          email,
          profile: profileData
        }
      }
      
      const response = await api.put(endpoint, formattedData)
      
      // Handle different response structures
      const userData = userType === 'nutritionist' 
        ? response.data.nutritionist 
        : response.data.user
        
      dispatch({ type: 'UPDATE_PROFILE', payload: userData })
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const setPreferences = (preferences) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences })
  }

  const updatePreferences = (updates) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: updates })
  }

  const setGoals = (goals) => {
    dispatch({ type: 'SET_GOALS', payload: goals })
  }

  const updateGoals = (updates) => {
    dispatch({ type: 'UPDATE_GOALS', payload: updates })
  }

  const addMealLog = (mealLog) => {
    dispatch({ type: 'ADD_MEAL_LOG', payload: mealLog })
  }

  const setMealLogs = (mealLogs) => {
    dispatch({ type: 'SET_MEAL_LOGS', payload: mealLogs })
  }

  const updateDailyStats = (stats) => {
    dispatch({ type: 'UPDATE_DAILY_STATS', payload: stats })
  }

  return (
    <UserContext.Provider value={{
      ...state,
      setProfile,
      updateProfile,
      setPreferences,
      updatePreferences,
      setGoals,
      updateGoals,
      addMealLog,
      setMealLogs,
      updateDailyStats
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}