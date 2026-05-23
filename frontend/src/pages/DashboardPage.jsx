import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Welcome Back, {mockUser.name}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Target Role: {mockUser.targetRole}
            <span className="mx-2 text-gray-300 dark:text-slate-600">|</span>
            Skill Match: <span className="text-indigo-600 font-semibold">{mockUser.skillMatch}%</span>.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
