import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

const defaultQuizzes = [
  { day: 'Day 5',  skill: 'React Hooks',      score: 95, improved: 'React'   },
  { day: 'Day 12', skill: 'Async JavaScript', score: 88, improved: 'Node.js' },
  { day: 'Day 18', skill: 'Docker Basics',    score: 80, improved: 'Docker'  },
]

/* Color based on score */
function scoreColor(score) {
  if (score >= 90) return '#22c55e'  // green
  if (score >= 75) return '#6366f1'  // indigo
  return '#f59e0b'                   // amber
}

export default function QuizScores({ quizzes = defaultQuizzes }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">
        Top Quiz Scores
      </p>

      <div className="flex flex-col gap-4">
        {quizzes.map((quiz, i) => {
          const chartData = [{ name: quiz.skill, score: quiz.score }]
          return (
            <div key={i} className="flex flex-col gap-1.5">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5">
                    {quiz.day}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {quiz.skill}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 text-xs font-semibold">↑ {quiz.improved}</span>
                  <span className="text-sm font-extrabold" style={{ color: scoreColor(quiz.score) }}>
                    {quiz.score}%
                  </span>
                </div>
              </div>

              {/* Dynamic Recharts score bar */}
              <div className="h-3 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    barSize={10}
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
                      formatter={(val) => [`Score: ${val}%`, quiz.skill]}
                    />
                    <Bar
                      dataKey="score"
                      radius={[6, 6, 6, 6]}
                      background={{ fill: '#f1f5f9', radius: [6, 6, 6, 6] }}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      <Cell fill={scoreColor(quiz.score)} />
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
