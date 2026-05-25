import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnalysisCard from '../components/AnalysisCard'

/* ── Mock Data ── */
const mockAnalyses = [
  {
    id: 1,
    role: 'Senior Frontend Engineer',
    matchPercent: 88,
    date: 'May 15, 2026',
    status: 'active',
    planLink: '/dashboard',
  },
  {
    id: 2,
    role: 'Fullstack Developer',
    matchPercent: 76,
    date: 'Mar 01, 2026',
    status: 'completed',
    planLink: '/dashboard',
  },
  {
    id: 3,
    role: 'Backend Specialist',
    matchPercent: 63,
    date: 'Apr 10, 2026',
    status: 'completed',
    planLink: '/dashboard',
  },
  {
    id: 4,
    role: 'Data Engineer',
    matchPercent: 76,
    date: 'May 15, 2026',
    status: 'outdated',
    planLink: '/dashboard',
  },
  {
    id: 5,
    role: 'UI/UX Designer Engineer',
    matchPercent: 83,
    date: 'May 28, 2026',
    status: 'outdated',
    planLink: '/dashboard',
  },
  {
    id: 6,
    role: 'Target Role Developer',
    matchPercent: 76,
    date: 'Apr 00, 2026',
    status: 'outdated',
    planLink: '/dashboard',
  },
]

const FILTER_OPTIONS = ['All', 'Active', 'Completed', 'Outdated']

/* ── Stats Summary ── */
function StatBadge({ label, count, color }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${color} bg-white dark:bg-slate-900`}>
      <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{count}</span>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}

export default function YourAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? mockAnalyses
      : mockAnalyses.filter(
          (a) => a.status === activeFilter.toLowerCase()
        )

  const stats = {
    total: mockAnalyses.length,
    active: mockAnalyses.filter((a) => a.status === 'active').length,
    completed: mockAnalyses.filter((a) => a.status === 'completed').length,
    outdated: mockAnalyses.filter((a) => a.status === 'outdated').length,
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">
            Skill-Gap Analyzer
          </p>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            /analysis-history
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Track all your skill gap analyses in one place.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="flex flex-wrap gap-3 mb-7">
          <StatBadge
            label="Total Analyses"
            count={stats.total}
            color="border-slate-200 dark:border-slate-700"
          />
          <StatBadge
            label="Active"
            count={stats.active}
            color="border-blue-300 dark:border-blue-700"
          />
          <StatBadge
            label="Completed"
            count={stats.completed}
            color="border-green-300 dark:border-green-700"
          />
          <StatBadge
            label="Outdated"
            count={stats.outdated}
            color="border-gray-300 dark:border-slate-600"
          />
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-150
                ${
                  activeFilter === opt
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ── Card Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
            <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-sm font-semibold">No analyses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}

        {/* ── New Analysis CTA ── */}
        <div className="mt-10 flex justify-center">
          <a
            href="/NewAnalysis"
            className="
              inline-flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              text-white text-sm font-semibold
              px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg
              transition-all duration-200
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Start New Analysis
          </a>
        </div>

      </main>

      <Footer />
    </div>
  )
}
