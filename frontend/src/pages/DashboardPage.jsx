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
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
          Dashboard
        </h1>

        {/* Welcome Card */}
        <WelcomeCard user={mockUser} />

        {/* Skills Radar Chart */}
        <SkillsChart />

        {/* Bottom Row: Missing Skills + Active Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <MissingSkillsCard />
          </div>
          <div className="md:col-span-3">
            <ActiveRoadmap />
          </div>
        </div>

        {/* Quiz Scores */}
        <QuizScores />

      </main>

      <Footer />
    </div>
  )
}
