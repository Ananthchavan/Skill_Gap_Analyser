export default function WelcomeCard({ user }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
        Welcome Back, {user.name}!
      </h2>

      {/* Target Role Badge */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-fit">
        <svg
          className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Target Role: {user.targetRole}
        </span>
      </div>
    </div>
  )
}
