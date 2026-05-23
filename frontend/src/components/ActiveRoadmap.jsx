import { Link } from 'react-router-dom'

const roadmap = {
  title: '30-Day Frontend Masterplan',
  percent: 60,
  currentDay: 18,
}

export default function ActiveRoadmap() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Active Roadmap
      </p>
      <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
        {roadmap.title} – {roadmap.percent}% Complete (Day {roadmap.currentDay})
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${roadmap.percent}%` }}
        />
      </div>

      {/* Go to Planner Button */}
      <Link
        to="/planner"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
      >
        Go to Planner →
      </Link>
    </div>
  )
}
