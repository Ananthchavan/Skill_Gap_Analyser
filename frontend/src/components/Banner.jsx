import { Link } from 'react-router-dom'

export default function Banner() {
  return (
    <section className="bg-indigo-600 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Your dream job requires specific skills.{' '}
          <span className="text-indigo-200">Don't waste time learning the wrong ones.</span>
        </h2>

        <Link
          to="/signup"
          className="inline-block bg-white hover:bg-gray-100 text-indigo-600 font-semibold text-base px-8 py-3 rounded-lg transition-colors"
        >
          Start Your 30-Day Plan Now
        </Link>

      </div>
    </section>
  )
}
