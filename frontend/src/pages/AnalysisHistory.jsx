import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnalysisCard from '../components/AnalysisCard'

// ─────────────────────────────────────────────
// Data: array of analysis objects
// Each object matches the AnalysisCard prop shape
// ─────────────────────────────────────────────
const analyses = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    matchPercentage: 88,
    status: 'active',
    date: 'May 15, 2026',
    planLink: '/dashboard',
  },
  {
    id: 2,
    title: 'Fullstack Developer',
    matchPercentage: 76,
    status: 'completed',
    date: 'Mar 01, 2026',
    planLink: '/dashboard',
  },
  {
    id: 3,
    title: 'Backend Specialist',
    matchPercentage: 63,
    status: 'completed',
    date: 'Apr 10, 2026',
    planLink: '/dashboard',
  },
  {
    id: 4,
    title: 'Data Engineer',
    matchPercentage: 76,
    status: 'outdated',
    date: 'May 15, 2026',
    planLink: '/dashboard',
  },
  {
    id: 5,
    title: 'UI/UX Designer Engineer',
    matchPercentage: 83,
    status: 'outdated',
    date: 'May 28, 2026',
    planLink: '/dashboard',
  },
  {
    id: 6,
    title: 'Target Role Developer',
    matchPercentage: 76,
    status: 'outdated',
    date: 'Apr 10, 2026',
    planLink: '/dashboard',
  },
]

const FILTERS = ['All', 'Active', 'Completed', 'Outdated']

export default function AnalysisHistory() {
  const [items, setItems] = useState(analyses)
  const [activeFilter, setActiveFilter] = useState('All')

  const handleDelete = (id) => setItems((prev) => prev.filter((a) => a.id !== id))

  // Filter the array based on the selected tab
  const filtered =
    activeFilter === 'All'
      ? items
      : items.filter((a) => a.status === activeFilter.toLowerCase())

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">
            Skill-Gap Analyzer
          </p>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            /analysis-history
          </h1>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-150
                ${
                  activeFilter === f
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Card grid: 1 col → 2 col → 3 col ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              title={analysis.title}
              matchPercentage={analysis.matchPercentage}
              status={analysis.status}
              date={analysis.date}
              planLink={analysis.planLink}
              onDelete={() => handleDelete(analysis.id)}
            />
          ))}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
            <svg className="w-14 h-14 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-sm font-semibold">No analyses found for "{activeFilter}"</p>
          </div>
        )}

        {/* ── New analysis CTA ── */}
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
