import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WelcomeCard from '../components/WelcomeCard'

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

        <WelcomeCard user={mockUser} />

      </main>

      <Footer />
    </div>
  )
}
