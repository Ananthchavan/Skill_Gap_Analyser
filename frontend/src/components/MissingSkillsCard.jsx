const missingSkills = [
  { name: 'GraphQL', level: 'Critical', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { name: 'Docker',  level: 'High',     color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { name: 'Testing', level: 'Med',      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
]

export default function MissingSkillsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Top Missing Skills (Gap)
      </p>
      <div className="flex flex-col gap-3">
        {missingSkills.map((skill) => (
          <div key={skill.name} className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300 text-sm">{skill.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${skill.color}`}>
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
