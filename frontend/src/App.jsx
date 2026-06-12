import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingpage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AnalysisHistory from './pages/AnalysisHistory.jsx'
import Planner from './pages/Planner.jsx'
import NewAnalysis from './pages/NewAnalysis.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — requires GitHub session */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/YourAnalysis" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:analysisId"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/YourAnalysis"
          element={
            <ProtectedRoute>
              <AnalysisHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NewAnalysis"
          element={
            <ProtectedRoute>
              <NewAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner/:id"
          element={
            <ProtectedRoute>
              <Planner />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
