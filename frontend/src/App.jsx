import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingpage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AnalysisHistory from './pages/AnalysisHistory.jsx'
import Planner from './pages/Planner.jsx'
import NewAnalysis from './pages/NewAnalysis.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/:analysisId" element={<DashboardPage />} />
        <Route path="/YourAnalysis" element={<AnalysisHistory />} />
        <Route path="/NewAnalysis" element={<NewAnalysis />} />
        <Route path="/planner/:id" element={<Planner />} />
      </Routes>
    </BrowserRouter>
  )
}
