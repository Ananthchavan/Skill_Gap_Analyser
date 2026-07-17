import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

/* ─── tiny animated flow-line SVG ─── */
function FlowArrow() {
  return (
    <svg width="48" height="16" viewBox="0 0 48 16" fill="none" className="mx-1 flex-shrink-0">
      <line x1="0" y1="8" x2="40" y2="8" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="40,4 48,8 40,12" fill="#6366f1" />
    </svg>
  )
}

/* ─── Job card chip ─── */
function SkillChip({ label, color }) {
  const colors = {
    python: 'bg-blue-100 text-blue-700',
    ml: 'bg-yellow-100 text-yellow-700',
    react: 'bg-cyan-100  text-cyan-700',
    keyword: 'bg-green-100 text-green-700',
    aws: 'bg-orange-100 text-orange-700',
  }
  return (
    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${colors[color] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  )
}

/* ─── Job listing card ─── */
function JobCard({ company, title, skills, delay = '0s' }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md px-3 py-2 w-56 border border-gray-100"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {/* Company logo placeholder */}
        <div className="w-4 h-4 rounded-sm flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-[6px] font-bold">
            {company === 'Google' ? 'G' : company === 'Microsoft' ? 'M' : 'D'}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-700">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {skills.map((s) => <SkillChip key={s.label} {...s} />)}
      </div>
    </div>
  )
}

/* ─── Roadmap day pill ─── */
function DayPill({ label, checked, color = 'indigo' }) {
  const bg = color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : 'bg-green-500'
  return (
    <div className={`flex items-center gap-1 text-[9px] font-medium text-white ${bg} rounded-full px-2 py-0.5 whitespace-nowrap`}>
      {label}
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  )
}

export default function HeroSection() {
  const [progressWidth, setProgressWidth] = useState(0)
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  /* animate the progress bar once on mount */
  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(72), 300)
    return () => clearTimeout(t)
  }, [])

  const handleGetStarted = async () => {
    if (authLoading) return
    if (!user) {
      navigate('/signup')
      return
    }
    // User is logged in – check if they already have analyses
    try {
      const res = await fetch('http://localhost:8080/api/analysis/dashboard', {
        credentials: 'include',
      })
      const data = res.ok ? await res.json() : []
      navigate(data.length > 0 ? '/dashboard' : '/NewAnalysis')
    } catch {
      navigate('/NewAnalysis')
    }
  }

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-[520px] flex items-center"
    >
      {/* ── Purple diagonal background (right side) ── */}
      <div
        className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800"
        style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-12">

        {/* ── LEFT: Text block ── */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-[1.15] mb-5">
            Stop guessing what to<br />
            learn.{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Start building</span>
            <br />what they want.
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-md">
            The ultimate placement tool for final-year CSE students. We analyze
            your actual GitHub code against real-world job descriptions to generate
            a personalized, day-by-day learning roadmap.
          </p>

          <button
            onClick={handleGetStarted}
            disabled={authLoading}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 disabled:opacity-60 disabled:cursor-wait"
          >
            Get Started
          </button>
        </div>

        {/* ── RIGHT: Visual mockup ── */}
        <div className="flex-1 flex justify-center items-center relative">

          {/* Floating card container */}
          <div className="relative flex flex-col items-center gap-5 w-full max-w-md">

            {/* ── Row 1: GitHub → Gears (analysis flow) ── */}
            <div className="flex items-center gap-0">
              {/* GitHub card */}
              <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-col items-center gap-1 w-20 h-20 justify-center border border-gray-100 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-slate-900" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <div className="w-8 h-1 bg-slate-200 rounded-full" />
              </div>

              <FlowArrow />

              {/* Gears icon */}
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4 flex items-center justify-center w-20 h-20 border border-white/60 flex-shrink-0">
                <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
                  {/* Big gear */}
                  <circle cx="22" cy="38" r="11" fill="none" stroke="#6366f1" strokeWidth="3" />
                  <circle cx="22" cy="38" r="4" fill="#6366f1" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <rect
                      key={i}
                      x="20" y="24"
                      width="4" height="5"
                      rx="1"
                      fill="#6366f1"
                      transform={`rotate(${deg} 22 38)`}
                    />
                  ))}
                  {/* Small gear */}
                  <circle cx="42" cy="24" r="8" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                  <circle cx="42" cy="24" r="3" fill="#a855f7" />
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <rect
                      key={i}
                      x="40.5" y="13"
                      width="3" height="4"
                      rx="1"
                      fill="#a855f7"
                      transform={`rotate(${deg} 42 24)`}
                    />
                  ))}
                </svg>
              </div>

              <FlowArrow />

              {/* Job cards stack */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <JobCard
                  company="Google"
                  title="Software Engineer at Google"
                  skills={[
                    { label: 'Python', color: 'python' },
                    { label: 'Machine Learning', color: 'ml' },
                    { label: 'React', color: 'react' },
                  ]}
                  delay="0s"
                />
                <JobCard
                  company="Microsoft"
                  title="Data Scientist at Microsoft"
                  skills={[
                    { label: 'Python', color: 'python' },
                    { label: 'Machine Learning', color: 'ml' },
                    { label: 'React', color: 'react' },
                  ]}
                  delay="0.1s"
                />
                <JobCard
                  company="Data"
                  title="Data Scientist at Microsoft"
                  skills={[
                    { label: 'Python', color: 'python' },
                    { label: 'Keyword', color: 'keyword' },
                    { label: 'React', color: 'react' },
                  ]}
                  delay="0.2s"
                />
              </div>
            </div>

            {/* ── Row 2: Generating Roadmap progress bar ── */}
            <div className="bg-white rounded-xl shadow-lg px-4 py-3 w-full max-w-sm border border-gray-100">
              <p className="text-[11px] font-semibold text-slate-700 mb-2">Generating Personalized Roadmap</p>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-[1800ms] ease-out"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>

            {/* ── Row 3: Personalized Roadmap calendar ── */}
            <div className="bg-white rounded-xl shadow-lg px-4 py-3 w-full max-w-sm border border-gray-100">
              <p className="text-[11px] font-bold text-slate-800 mb-2">Personalized Roadmap</p>
              {/* Calendar header */}
              <div className="grid grid-cols-7 gap-1 text-[8px] font-semibold text-slate-400 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              {/* Week row */}
              <div className="grid grid-cols-7 gap-1 items-start">
                <div className="col-span-2 flex flex-col gap-1">
                  <DayPill label="Day 1: Master Data Structures" checked color="indigo" />
                  <DayPill label="Day 2: Pandas and Skills" color="purple" />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <DayPill label="Day 3: Build API with Flask" checked color="indigo" />
                  <DayPill label="Day 4: Developing Skills" checked color="green" />
                </div>
                <div />
                <div className="col-span-2 flex flex-col gap-1">
                  <DayPill label="Day 7: Deploy to AWS" checked color="indigo" />
                  <DayPill label="Day 6: Sharpen Modules" checked color="purple" />
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* ── end RIGHT ── */}

      </div>
    </section>
  )
}
