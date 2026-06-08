import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

/* ── No fallback data here — all data comes from MockData.js ── */

/* ── Radar Chart Subcomponent ── */
function RadarWidget({ data = [] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[420px]">
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
        Skill Gap Radar
      </p>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: '500' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickCount={5}
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
              name="Proficiency"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Overall Match Semi-Donut Subcomponent ── */
function OverallMatchWidget({ score = 76 }) {
  const chartData = [
    { value: score },
    { value: Math.max(0, 100 - score) },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
      {/* Explicit parent sizing guarantees accurate absolute overlay alignment */}
      <div className="relative w-[240px] h-[160px] flex items-center justify-center overflow-hidden">
        
        {/* Concentric grid rings behind the chart matching the 2nd photo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-40" viewBox="0 0 240 160">
          <circle cx="120" cy="144" r="115" fill="none" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="120" cy="144" r="95" fill="none" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" />
          <circle cx="120" cy="144" r="75" fill="none" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" />
          
          {/* Radial division lines */}
          <line x1="120" y1="20" x2="120" y2="144" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="30" y1="54" x2="210" y2="234" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="210" y1="54" x2="30" y2="234" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>

        {/* Semi-donut Chart using fixed dimensions for pixel-perfect stability */}
        <PieChart width={240} height={160} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={75}
            outerRadius={95}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="url(#matchGrad)" />
            <Cell fill="#f1f5f9" className="dark:fill-slate-800" />
          </Pie>
        </PieChart>

        {/* Center Labels - perfectly placed in the middle of the hollow center beneath the curve */}
        <div className="absolute top-[52%] left-0 right-0 text-center flex flex-col items-center justify-center">
          <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 leading-none">
            {score}%
          </p>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Overall Skill Match
          </p>
        </div>

      </div>
    </div>
  )
}

/* ── Individual horizontal bar widget ── */
/* Expects MockData skillsBreakdown shape: { name, proficiency, gap } */
function SkillBarRow({ item }) {
  const chartData = [{ name: item.name, val: item.proficiency }]
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{item.proficiency}%</span>
      </div>

      {/* Dynamic Recharts Bar */}
      <div className="h-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="val"
              fill="#6366f1"
              radius={[6, 6, 6, 6]}
              background={{ fill: '#f1f5f9', radius: [6, 6, 6, 6] }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold text-slate-400">
        <span>Proficiency</span>
        <span>Gap: {item.gap}%</span>
      </div>
    </div>
  )
}

/* ── Gaps & Proficiency Grid Subcomponent ── */
function ProficiencyWidget({ data = [] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-bold text-slate-800 dark:text-slate-100">
        Skill Proficiency & Gaps
      </p>
      <div className="grid grid-cols-2 gap-4">
        {data.map((item) => (
          <SkillBarRow key={item.name} item={item} />
        ))}
      </div>
    </div>
  )
}

/* ── Main SkillsChart Selector ── */
export default function SkillsChart({ type, data = [], overallScore = 76 }) {
  if (type === 'radar') {
    return <RadarWidget data={data} />
  }
  if (type === 'overall') {
    return <OverallMatchWidget score={overallScore} />
  }
  if (type === 'proficiency') {
    return <ProficiencyWidget data={data} />
  }

  /* Default unified layout if type isn't specified (fallback/safety) */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RadarWidget data={data} />
      </div>
      <div className="lg:col-span-1 flex flex-col gap-6">
        <OverallMatchWidget score={overallScore} />
        <ProficiencyWidget data={data} />
      </div>
    </div>
  )
}
