import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WelcomeCard from '../components/WelcomeCard'
import SkillsChart from '../components/SkillsChart'
import MissingSkillsCard from '../components/MissingSkillsCard'
import ActiveRoadmap from '../components/ActiveRoadmap'
import QuizScores from '../components/QuizScores'

// Mock data
const mockUser = {
  name: 'Alex',
  targetRole: 'Senior Frontend Engineer',
  skillMatch: 76,
}

export default function DashboardPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10">
        
        {/* ── Grid matching the layout in the reference photo ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
          
          {/* Left Column (Occupies 2/3 width on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <WelcomeCard user={mockUser} />
            <SkillsChart type="radar" />
          </div>

          {/* Right Column (Occupies 1/3 width on desktop) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SkillsChart type="overall" />
            <SkillsChart type="proficiency" />
          </div>

        </div>

        {/* ── Bottom Section: Missing Skills + Active Roadmap ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MissingSkillsCard />
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
