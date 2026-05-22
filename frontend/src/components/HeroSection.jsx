import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="bg-gray-50 py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
          Stop guessing what to learn.{' '}
          <span className="text-indigo-600">Start building</span> what they want.
        </h1>

        {/* below Headline */}
        <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          The ultimate placement tool for final-year CSE students. We analyze your actual
          GitHub code against real-world job descriptions to generate a personalized,
          day-by-day learning roadmap.
        </p>

        {/* Button */}
        <Link
          to="/signup"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base px-8 py-3 rounded-lg transition-colors"
        >
          Get Started Free
        </Link>

      </div>
    </section>
  )
}
