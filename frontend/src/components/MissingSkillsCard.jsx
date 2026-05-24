import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts'

const defaultMissingSkills = [
  { name: 'GraphQL', gap: 70, level: 'Critical', color: '#ef4444' },
  { name: 'Docker',  gap: 60, level: 'High',     color: '#f59e0b' },
  { name: 'Testing', gap: 50, level: 'Medium',   color: '#eab308' },
]

export default function MissingSkillsCard({ skills = defaultMissingSkills }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full">
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">
        Top Missing Skills
      </p>

      <div className="flex flex-col gap-5">
        {skills.map((skill) => {
          const chartData = [{ name: skill.name, gap: skill.gap }]
          return (
            <div key={skill.name}>
              {/* Label row */}
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {skill.name}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: skill.color + '20',
                    color: skill.color,
                  }}
                >
                  {skill.level} · {skill.gap}% gap
                </span>
              </div>

              {/* Dynamic Recharts gap bar */}
              <div className="h-3.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    barSize={12}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f1f5f9',
                        fontSize: '11px',
                      }}
                      formatter={(val) => [`Gap: ${val}%`, skill.name]}
                    />
                    <Bar
                      dataKey="gap"
                      radius={[6, 6, 6, 6]}
                      background={{ fill: '#f1f5f9', radius: [6, 6, 6, 6] }}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      <Cell fill={skill.color} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
