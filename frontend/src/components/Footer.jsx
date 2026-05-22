export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left Side */}
        <div>
          <p className="text-slate-900 font-semibold text-sm">Skill-Gap</p>
          <p className="text-slate-600 text-xs mt-1">© 2026 Chandra Shekar Chavan</p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <span className="text-slate-600 text-sm">Contact</span>
          <span className="text-slate-600 text-sm">GitHub</span>
        </div>

      </div>
    </footer>
  )
}
