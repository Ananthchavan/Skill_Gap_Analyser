const topQuizzes = [
  {
    day: 'Day 5',
    skill: 'React Hooks',
    score: 95,
    improved: 'React',
  },
  {
    day: 'Day 12',
    skill: 'Async JavaScript',
    score: 88,
    improved: 'Node.js',
  },
  {
    day: 'Day 18',
    skill: 'Docker Basics',
    score: 80,
    improved: 'Docker',
  },
]

export default function QuizScores() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mt-6">

      {/* Section Title */}
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Top Quiz Scores
      </p>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
        <span>Day</span>
        <span>Quiz Topic</span>
        <span>Skill Improved</span>
        <span className="text-right">Score</span>
      </div>

      {/* Quiz Rows */}
      <div className="flex flex-col gap-2">
        {topQuizzes.map((quiz, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-3"
          >
            {/* Day */}
            <span className="text-slate-600 dark:text-slate-400 text-sm">{quiz.day}</span>

            {/* Quiz Topic */}
            <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{quiz.skill}</span>

            {/* Skill Improved */}
            <span className="text-emerald-500 text-sm font-medium">↑ {quiz.improved}</span>

            {/* Score */}
            <span className="text-indigo-600 font-bold text-sm text-right">{quiz.score}%</span>
          </div>
        ))}
      </div>

    </div>
  )
}
