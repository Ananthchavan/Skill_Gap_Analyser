/* ─────────────────────────────────────────────
   WhyUs.jsx  –  "Why SGA.ai?" section
   Matches the reference design with SVG visuals
   ───────────────────────────────────────────── */

/* ══════════════════════════════════════
   Card 1 – Interactive Daily Tracking
   Checklist + star + YouTube link
══════════════════════════════════════ */
function TrackingVisual() {
  return (
    <div className="flex flex-col gap-3 w-full px-4 py-2">
      {/* Checked row 1 */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 h-2.5 bg-slate-200 rounded-full" />
      </div>

      {/* Checked row 2 */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 h-2.5 bg-slate-200 rounded-full" />
      </div>

      {/* Star + unchecked row 3 */}
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0" />
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full" />
      </div>

      {/* YouTube link pill */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-fit mt-1">
        <svg className="w-5 h-4 flex-shrink-0" viewBox="0 0 24 17" fill="none">
          <rect width="24" height="17" rx="3.5" fill="#FF0000"/>
          <path d="M9.5 12V5l7 3.5-7 3.5z" fill="white"/>
        </svg>
        <span className="text-xs text-slate-600 font-medium">YouTube tutorial link</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   Card 3 – Analytics Dashboard
   Line chart + donut ring 82%
══════════════════════════════════════ */
function AnalyticsVisual() {
  /* SVG donut for 82% */
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - 0.82)

  /* Simple rising line chart points */
  const pts = '10,58 30,50 50,42 70,30 90,20 110,15 130,10'

  return (
    <div className="flex items-center gap-3 w-full px-2 py-1">

      {/* Left: trend chart card */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-1 mb-2">
          <p className="text-[10px] font-semibold text-slate-700">Accuracy Trend</p>
          {/* trending up icon */}
          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        {/* Chart area */}
        <svg viewBox="0 0 140 70" className="w-full">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* filled area */}
          <polygon
            points={`10,58 30,50 50,42 70,30 90,20 110,15 130,10 130,65 10,65`}
            fill="url(#areaGrad)"
          />
          {/* line */}
          <polyline
            points={pts}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Right: readiness donut */}
      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke="url(#readyGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="readyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-base font-extrabold text-slate-900 leading-none">82%</p>
          <p className="text-[8px] text-slate-400 font-medium leading-tight">Ready for<br/>interview</p>
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════
   Main WhyUs section
══════════════════════════════════════ */
const features = [
  {
    title: 'Interactive Daily Tracking',
    description:
      "Don't just read a list. Check off completed days, star important concepts for revision, and attach your own YouTube tutorial links.",
    Visual: TrackingVisual,
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Visualize your interview readiness with completion rings and accuracy trend lines.',
    Visual: AnalyticsVisual,
  },
]

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="bg-slate-100 dark:bg-slate-950 py-20 px-4"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            Why SGA.ai?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Not a generic AI wrapper. A purpose-built placement engine.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map(({ title, description, Visual }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                         rounded-2xl p-6 flex flex-col gap-5
                         shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Illustration */}
              <div className="min-h-[160px] flex items-center justify-center">
                <Visual />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-center">
                  {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-center">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
