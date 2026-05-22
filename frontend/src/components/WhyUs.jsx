const features = [
  {
    title: 'Interactive Daily Tracking',
    description:
      "Don't just read a list. Check off completed days, star important concepts for revision, and attach your own YouTube tutorial links.",
  },
  {
    title: 'AI-Powered Quizzes',
    description:
      'Prove your knowledge. Every daily task comes with an AI-generated micro-quiz to ensure you actually understand the concepts.',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Visualize your interview readiness with completion rings and accuracy trend lines.',
  },
]

export default function WhyUs() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why SGA.ai?</h2>
          <p className="text-slate-600 text-base">
            Not a generic AI wrapper. A purpose-built placement engine.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
