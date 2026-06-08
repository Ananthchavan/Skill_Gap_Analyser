import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnalysisCard from '../components/AnalysisCard'
import { mockAnalyses } from '../data/MockData'


const FILTERS = ['All', 'Active', 'Completed', 'Outdated']

export default function AnalysisHistory() {
  // Read deleted IDs from localStorage on first render
  const [deletedIds, setDeletedIds] = useState(
    () => JSON.parse(localStorage.getItem('deletedAnalyses') || '[]')
  )
  const [activeFilter, setActiveFilter] = useState('All')

  const handleDelete = (id) => {
    const updated = [...deletedIds, id]
    setDeletedIds(updated)
    localStorage.setItem('deletedAnalyses', JSON.stringify(updated))
  }

  // Filter out deleted items, then apply tab filter
  const visible = mockAnalyses.filter((a) => !deletedIds.includes(a.id))
  const filtered =
    activeFilter === 'All'
      ? visible
      : visible.filter((a) => a.status.toLowerCase() === activeFilter.toLowerCase())

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
                ${activeFilter === f
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
              id={analysis.id}
              title={analysis.targetRole}
              matchPercentage={analysis.matchPercentage}
              status={analysis.status.toLowerCase()}
              date={analysis.dateGenerated}
              onDelete={() => handleDelete(analysis.id)}
            />
          ))}

          {/* Dotted border card to start new analysis */}
          <a
            href="/NewAnalysis"
            className="
              border-2 border-dashed border-slate-300 dark:border-slate-700
              rounded-2xl p-5 flex flex-col items-center justify-center text-center
              hover:border-indigo-500 dark:hover:border-indigo-400
              hover:bg-slate-100/50 dark:hover:bg-slate-900/50
              transition-all duration-200 cursor-pointer
              min-h-[200px] gap-2 group
            "
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mt-2">
              Start New Career Analysis
            </span>
            <span className="text-[12px] text-slate-400 dark:text-slate-500 font-medium">
              Compare your skills against 500+ job roles
            </span>
          </a>
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

      </main>

      <Footer />
    </div>
  )
}
