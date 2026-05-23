import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Side */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
              SGA.ai
            </Link>

            {/* Nav Links - hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Home
              </Link>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                About
              </a>
              <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/YourAnalysis" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Your Analysis
              </Link>
              <Link to="/planner" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Your Planner
              </Link>
              <Link to="/NewAnalysis" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                New Analysis
              </Link>
            </div>
          </div>

          {/* Right Side - hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
            <ThemeToggle />
            <Link
              to="/profile"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-2 rounded-lg"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            <a href="#hero-section" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              Home
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              About
            </a>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              Dashboard
            </Link>
            <Link to="/planner" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              Your Planner
            </Link>
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 text-sm font-medium py-2">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors"
              >
                Sign Up
              </Link>
              <div className="py-1">
                <ThemeToggle />
              </div>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 text-sm font-medium py-2">
                Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
