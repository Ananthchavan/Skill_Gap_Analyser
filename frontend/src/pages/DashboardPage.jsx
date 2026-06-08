import { useParams, Navigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WelcomeCard from '../components/WelcomeCard'
import SkillsChart from '../components/SkillsChart'
import MissingSkillsCard from '../components/MissingSkillsCard'
import ActiveRoadmap from '../components/ActiveRoadmap'
import QuizScores from '../components/QuizScores'
import { mockAnalyses } from '../data/MockData'

export default function DashboardPage() {
  const { analysisId } = useParams()

  // Find the specific analysis by URL param (IDs are strings like "analysis-1")
  const analysis = mockAnalyses.find((a) => a.id === analysisId)

  // If ID doesn't match any record → redirect to history page
  if (!analysis) {
    return <Navigate to="/YourAnalysis" replace />
  }

  // Build the user object that WelcomeCard expects
  const user = {
    name: 'Alex',
    targetRole: analysis.targetRole,
    skillMatch: analysis.matchPercentage,
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10">

        {/* ── Back breadcrumb ── */}
        <Link
          to="/YourAnalysis"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Analysis History
        </Link>

        {/* ── Grid: 2/3 left + 1/3 right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <WelcomeCard user={user} />
            <SkillsChart type="radar" data={analysis.radarData} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SkillsChart type="overall" overallScore={analysis.matchPercentage} />
            <SkillsChart type="proficiency" data={analysis.skillsBreakdown} />
          </div>

        </div>

        {/* ── Bottom Section: Missing Skills + Active Roadmap ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MissingSkillsCard skills={analysis.missingSkills} />
          </div>
          <div className="lg:col-span-3">
            <ActiveRoadmap />
          </div>
        </div>

        {/* Quiz Scores */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <QuizScores />
        </div>

      </main>

      <Footer />
    </div>
  )
}

