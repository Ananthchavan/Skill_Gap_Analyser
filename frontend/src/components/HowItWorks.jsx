function Step1Visual() {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* GitHub icon */}
      <div className="bg-white border border-gray-200 rounded-full p-3 shadow-sm">
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-slate-900" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </div>

      {/* Resume input mockup */}
      <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between shadow-sm">
        <span className="text-xs text-slate-400">Paste Resume...</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Code / analysis icon */}
      <div className="flex items-center gap-2">
        <div className="bg-indigo-100 rounded-lg p-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        {/* small dots */}
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-1">
              <div className={`h-1 rounded-full bg-indigo-${i === 1 ? '500' : i === 2 ? '300' : '200'}`}
                style={{ width: `${28 - i * 6}px` }} />
            </div>
          ))}
        </div>
        {/* target icon */}
        <div className="bg-purple-100 rounded-full p-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
            <circle cx="12" cy="12" r="4" strokeWidth={2} />
            <line x1="12" y1="3" x2="12" y2="6" strokeWidth={2} />
            <line x1="12" y1="18" x2="12" y2="21" strokeWidth={2} />
            <line x1="3" y1="12" x2="6" y2="12" strokeWidth={2} />
            <line x1="18" y1="12" x2="21" y2="12" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Step2Visual() {
  return (
    <div className="flex flex-col gap-2 py-2">
      {/* LinkedIn search bar */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        {/* LinkedIn logo */}
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 text-blue-700" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-xs text-slate-400 flex-1">Search...</span>
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Job description input */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 text-blue-700" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-xs text-slate-400 flex-1">Paste job description...</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* AI analysis flow */}
      <div className="flex items-center justify-center gap-3 mt-1">
        {/* Person icon */}
        <div className="bg-indigo-100 rounded-full p-2">
          <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        {/* Arrow */}
        <svg width="32" height="10" viewBox="0 0 32 10" fill="none">
          <line x1="0" y1="5" x2="24" y2="5" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 2" />
          <polygon points="24,2 32,5 24,8" fill="#6366f1" />
        </svg>
        {/* Target / bullseye */}
        <div className="bg-purple-100 rounded-full p-2">
          <svg className="w-7 h-7 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
            <circle cx="12" cy="12" r="5" strokeWidth={1.8} />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Step3Visual() {
  const days = [
    { label: 'Day 1', x: 10 },
    { label: 'Day 15', x: 110 },
    { label: 'Day 30', x: 210 },
  ]
  return (
    <div className="flex flex-col items-center gap-3 py-2 w-full">
      {/* SVG timeline */}
      <svg viewBox="0 0 240 70" className="w-full max-w-[240px]">
        {/* track line */}
        <line x1="10" y1="30" x2="230" y2="30" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        {/* filled progress */}
        <line x1="10" y1="30" x2="175" y2="30" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />

        {/* Day nodes */}
        {days.map((d, i) => (
          <g key={d.label}>
            <circle
              cx={d.x + 10} cy="30" r="8"
              fill={i < 2 ? '#6366f1' : '#e2e8f0'}
              stroke="white" strokeWidth="2"
            />
            {i < 2 && (
              <path
                d={`M${d.x + 6},30 l3,3 l5,-6`}
                fill="none" stroke="white" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
              />
            )}
            {i === 2 && (
              <circle cx={d.x + 10} cy="30" r="3" fill="#94a3b8" />
            )}
            <text x={d.x + 10} y="55" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">
              {d.label}
            </text>
          </g>
        ))}

        {/* Skill box left */}
        <rect x="0" y="40" width="52" height="18" rx="4" fill="#ede9fe" />
        <text x="26" y="52" textAnchor="middle" fontSize="7.5" fill="#7c3aed" fontFamily="sans-serif" fontWeight="600">
          Current Skills
        </text>

        {/* Skill box right */}
        <rect x="188" y="40" width="46" height="18" rx="4" fill="#ede9fe" />
        <text x="211" y="52" textAnchor="middle" fontSize="7.5" fill="#7c3aed" fontFamily="sans-serif" fontWeight="600">
          Target Job
        </text>
      </svg>

      {/* mini roadmap cards */}
      <div className="flex gap-2 w-full justify-center flex-wrap">
        {[
          { day: 'Day 1', task: 'Data Structures', done: true },
          { day: 'Day 2', task: 'Algorithms', done: true },
          { day: 'Day 3', task: 'System Design', done: false },
        ].map((item) => (
          <div key={item.day}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center
              ${item.done ? 'bg-indigo-500' : 'bg-gray-200'}`}>
              {item.done && (
                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-[8px] font-semibold text-slate-700 leading-none">{item.day}</p>
              <p className="text-[7px] text-slate-400 leading-none mt-0.5">{item.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const steps = [
  {
    number: '01',
    title: 'Connect your reality.',
    description:
      'Securely link your GitHub and paste your current resume. We analyze your public repos to see what you actually know, not just what you claim.',
    Visual: Step1Visual,
  },
  {
    number: '02',
    title: 'Set your target.',
    description:
      'Paste the exact LinkedIn or tech job description you want to land. Our AI maps your current tech stack against their strict requirements.',
    Visual: Step2Visual,
  },
  {
    number: '03',
    title: 'Bridge the gap.',
    description:
      'Get a highly structured, interactive 30-day curriculum. Take daily quizzes, track your momentum, and walk into your interview fully prepared.',
    Visual: Step3Visual,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 dark:bg-slate-900 py-20 px-4"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            How it Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Three steps from where you are to where you want to be.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ number, title, description, Visual }) => (
            <div
              key={number}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                         rounded-2xl p-6 flex flex-col gap-4
                         shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Step number */}
              <span className="text-4xl font-extrabold text-indigo-600">{number}</span>

              {/* Visual illustration */}
              <div className="flex-1 min-h-[140px] flex items-center justify-center">
                <Visual />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
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
