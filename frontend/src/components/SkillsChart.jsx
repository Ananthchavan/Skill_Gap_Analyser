import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// Mock skill gap data
const skillData = [
  { skill: 'React',      score: 85 },
  { skill: 'Node.js',    score: 70 },
  { skill: 'GraphQL',    score: 30 },
  { skill: 'Docker',     score: 40 },
  { skill: 'Testing',    score: 50 },
  { skill: 'TypeScript', score: 65 },
]

export default function SkillsChart() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Skill Gap Radar
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={skillData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '12px',
            }}
          />
          <Radar
            name="Your Skills"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Skill Percentages Below Chart */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
        {skillData.map((item) => (
          <div key={item.skill} className="flex flex-col items-center">
            <span className="text-indigo-600 font-semibold text-sm">{item.score}%</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{item.skill}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
