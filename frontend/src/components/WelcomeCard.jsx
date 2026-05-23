export default function WelcomeCard({ user }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        Welcome Back, {user.name}!
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        Target Role: {user.targetRole}
        <span className="mx-2 text-gray-300 dark:text-slate-600">|</span>
        Skill Match: <span className="text-indigo-600 font-semibold">{user.skillMatch}%</span>.
      </p>
    </div>
  )
}
