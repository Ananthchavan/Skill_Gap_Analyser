const steps = [
  {
    number: '01',
    title: 'Connect your reality.',
    description:
      'Securely link your GitHub and paste your current resume. We analyze your public repos to see what you actually know, not just what you claim.',
  },
  {
    number: '02',
    title: 'Set your target.',
    description:
      'Paste the exact LinkedIn or tech job description you want to land. Our AI maps your current tech stack against their strict requirements.',
  },
  {
    number: '03',
    title: 'Bridge the gap.',
    description:
      'Get a highly structured, interactive 30-day curriculum. Take daily quizzes, track your momentum, and walk into your interview fully prepared.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">How it works</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Three steps from where you are to where you want to be.</p>
        </div>

        {/* 3 Column Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">

              {/* Step Number */}
              <span className="text-4xl font-bold text-indigo-600 mb-4 block">{step.number}</span>

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
