import { Link } from 'react-router-dom'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

// ─────────────────────────────────────────────
// Status → styling mapping object
// ─────────────────────────────────────────────
const STATUS_MAP = {
  active: {
    label: 'ACTIVE',
    borderClass: 'border-blue-400 dark:border-blue-500',
    badgeClass:
      'bg-blue-50 text-blue-600 border border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    radarStroke: '#3b82f6',
    radarFill: '#3b82f6',
    progressClass: 'bg-blue-500',
    actionLabel: 'Resume Plan',
    actionClass:
      'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 dark:bg-transparent dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/30',
    actionIsLink: true,
  },
  completed: {
    label: 'COMPLETED',
    borderClass: 'border-green-400 dark:border-green-600',
    badgeClass:
      'bg-green-50 text-green-600 border border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
    radarStroke: '#22c55e',
    radarFill: '#22c55e',
    progressClass: 'bg-green-500',
    actionLabel: 'COMPLETED',
    actionClass:
      'bg-green-500 text-white border border-green-500 cursor-default dark:bg-green-600 dark:border-green-600',
    actionIsLink: false,
  },
  outdated: {
    label: 'OUTDATED',
    borderClass: 'border-gray-300 dark:border-slate-600',
    badgeClass:
      'bg-gray-100 text-gray-500 border border-gray-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600',
    radarStroke: '#9ca3af',
    radarFill: '#9ca3af',
    progressClass: 'bg-gray-400',
    actionLabel: 'ACTIVE PLAN',
    actionClass:
      'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700',
    actionIsLink: true,
  },
}

// ─────────────────────────────────────────────
// Spark-Radar: tiny Recharts RadarChart with all
// axes and labels hidden — decorative only
// ─────────────────────────────────────────────
const SPARK_DATA = [
  { axis: 'A', value: 80 },
  { axis: 'B', value: 55 },
  { axis: 'C', value: 70 },
  { axis: 'D', value: 45 },
  { axis: 'E', value: 90 },
]

function SparkRadar({ stroke, fill }) {
  return (
    <ResponsiveContainer width={90} height={90}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="70%"
        data={SPARK_DATA}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {/* Grid lines only — no labels */}
        <PolarGrid stroke="#e5e7eb" radialLines={true} />
        {/* Axes exist but labels are hidden */}
        <PolarAngleAxis dataKey="axis" tick={false} axisLine={false} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        {/* The radar shape itself */}
        <Radar
          dataKey="value"
          stroke={stroke}
          fill={fill}
          fillOpacity={0.3}
          strokeWidth={1.5}
          dot={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// ─────────────────────────────────────────────
// AnalysisCard — main export
// Props: title, matchPercentage, status, date, planLink
// ─────────────────────────────────────────────
export default function AnalysisCard({
  title,
  matchPercentage,
  status = 'active',
  date,
  planLink = '/dashboard',
  onDelete,
}) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.active

  return (
    <div
      className={`
        group relative bg-white dark:bg-slate-900
        border-2 ${cfg.borderClass}
        rounded-2xl p-5 shadow-sm
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
        flex flex-col gap-3 min-h-[190px]
      `}
    >
      {/* ── Row 1: Status badge + Spark Radar + Delete ── */}
      <div className="flex items-start justify-between">
        <span
          className={`text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-md ${cfg.badgeClass}`}
        >
          {cfg.label}
        </span>

        <div className="flex items-start gap-1">
          {/* Trash button — visible on card hover */}
          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete analysis"
              className="
                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50
                dark:hover:text-red-400 dark:hover:bg-red-900/30
              "
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
              </svg>
            </button>
          )}

          <div className="shrink-0 -mt-1 -mr-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <SparkRadar stroke={cfg.radarStroke} fill={cfg.radarFill} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Title ── */}
      <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 leading-snug max-w-[58%] -mt-2">
        {title}
      </h3>

      {/* ── Row 3: Progress bar + match % ── */}
      <div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full ${cfg.progressClass} transition-all duration-500`}
            style={{ width: `${matchPercentage}%` }}
          />
        </div>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Match: {matchPercentage}%
        </p>
      </div>

      {/* ── Row 4: Date + Action button ── */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {date}
        </span>

        {cfg.actionIsLink ? (
          <Link
            to={planLink}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${cfg.actionClass}`}
          >
            {cfg.actionLabel}
          </Link>
        ) : (
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${cfg.actionClass}`}>
            {cfg.actionLabel}
          </span>
        )}
      </div>
    </div>
  )
}
