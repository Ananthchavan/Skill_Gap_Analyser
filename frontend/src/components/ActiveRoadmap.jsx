import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'

/* Default mock data — swap with backend response via props */
const defaultRoadmap = {
  title: '30-Day Frontend Masterplan',
  percent: 60,
  currentDay: 18,
  totalDays: 30,
}

export default function ActiveRoadmap({ roadmap = defaultRoadmap }) {
  const { title, percent, currentDay, totalDays } = roadmap

  /* Recharts needs an array even for a single horizontal bar */
  const chartData = [{ name: 'Progress', done: percent, remaining: 100 - percent }]

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
        Active Roadmap
      </p>

      {/* Subtitle */}
      <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium mb-4">
        {title} – {percent}% Complete (Day {currentDay})
      </p>

      {/* ── Dynamic Recharts progress bar ── */}
      <div className="h-8 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barSize={16}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />

            {/* Filled (done) portion */}
            <Bar
              dataKey="done"
              stackId="progress"
              fill="url(#progressGrad)"
              radius={[8, 0, 0, 8]}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </Bar>

            {/* Remaining (gap) portion */}
            <Bar
              dataKey="remaining"
              stackId="progress"
              fill="#f1f5f9"
              radius={[0, 8, 8, 0]}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day markers below the bar */}
      <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-5 px-0.5">
        <span>Day 1</span>
        <span>Day {Math.round(totalDays / 2)}</span>
        <span>Day {totalDays}</span>
      </div>

      {/* Go to Planner */}
      <Link
        to="/planner"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95
                   text-white text-sm font-semibold px-5 py-2.5 rounded-xl
                   transition-all duration-200 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
      >
        Go to Planner
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  )
}
