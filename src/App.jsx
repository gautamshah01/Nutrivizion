import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import './utils/chartConfig.js' // Configure Chart.js globally
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import MealPlanner from './pages/MealPlanner'
import FoodScanner from './pages/FoodScanner'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SignupSelection from './pages/auth/SignupSelection'
import NutritionistLogin from './pages/auth/NutritionistLogin'
import NutritionistRegister from './pages/auth/NutritionistRegister'
import NutritionistDashboard from './pages/NutritionistDashboard'
import DebugNutritionists from './pages/DebugNutritionists'
import ComprehensiveDebug from './pages/ComprehensiveDebug'
import AdminDashboard from './pages/admin/AdminDashboard'
import AppointmentsPage from './pages/appointments/AppointmentsPage'
import CallPage from './pages/CallPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignupSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={
                  <ErrorBoundary>
                    <Register />
                  </ErrorBoundary>
                } />

                {/* Nutritionist Routes */}
                <Route path="/nutritionist/login" element={<NutritionistLogin />} />
                <Route path="/nutritionist/register" element={<NutritionistRegister />} />
                <Route path="/nutritionist/dashboard" element={<NutritionistDashboard />} />
                <Route path="/debug/nutritionists" element={<DebugNutritionists />} />
                <Route path="/debug" element={<ComprehensiveDebug />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/meal-planner" element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                } />
                <Route path="/food-scanner" element={
                  <ProtectedRoute>
                    <FoodScanner />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/call/:appointmentId" element={
                  <ProtectedRoute>
                    <CallPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm',
              }}
            />
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  )
}

export default App