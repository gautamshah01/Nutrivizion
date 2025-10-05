import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        userType: action.payload.userType || 'patient',
        isAuthenticated: true 
      }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { 
        user: null, 
        token: null, 
        userType: 'patient',
        isAuthenticated: false, 
        loading: false, 
        error: null 
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    userType: localStorage.getItem('userType') || 'patient',
    isAuthenticated: false,
    loading: true,
    error: null
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token)
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const userType = localStorage.getItem('userType') || 'patient'
      const endpoint = userType === 'nutritionist' ? '/nutritionist/auth/verify' : '/auth/verify'
      
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const userData = userType === 'nutritionist' ? response.data.nutritionist : response.data.user
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: userData, token, userType } 
      })
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (email, password, userType = 'patient') => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const endpoint = userType === 'nutritionist' ? '/nutritionist/auth/login' : '/auth/login'
      const response = await api.post(endpoint, { email, password })
      const { user, nutritionist, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userType', userType)
      
      const userData = userType === 'nutritionist' ? nutritionist : user
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token, userType } })
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'LOGIN_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}