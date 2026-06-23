import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleHomeClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate('/')
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handleWhyClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate('/')
    setTimeout(() => {
      document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Side */}
          <div className="flex items-center gap-8">
            <a href="/" onClick={handleHomeClick} className="text-xl font-bold text-indigo-600 tracking-tight">
              SGA.ai
            </a>

            {/* Nav Links - hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              <a href="/" onClick={handleHomeClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="/#how-it-works" onClick={handleAboutClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                About
              </a>
              <a href="/#why-us" onClick={handleWhyClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                Why SGA.ai?
              </a>
              {user && (
                <>
                  <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/NewAnalysis" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors">
                    Add New Analysis
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side - hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {!loading && (
              user ? (
                /* ── Logged-in: avatar + dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="user-menu-button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-white dark:bg-slate-900"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.username?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {user.username}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{user.username}</p>
                        {user.email && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        to="/NewAnalysis"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Analysis
                      </Link>
                      <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          id="logout-button"
                          onClick={() => { setDropdownOpen(false); logout(); }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Logged-out: login button ── */
                <Link
                  id="login-button"
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Login with GitHub
                </Link>
              )
            )}
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
            <a href="/" onClick={handleHomeClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              Home
            </a>
            <a href="/#how-it-works" onClick={handleAboutClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              About
            </a>
            <a href="/#why-us" onClick={handleWhyClick} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
              Why SGA.ai?
            </a>

            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
                  Dashboard
                </Link>
                <Link to="/NewAnalysis" onClick={() => setMenuOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium py-2">
                  Add New Analysis
                </Link>
              </>
            )}

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
              <div className="py-1">
                <ThemeToggle />
              </div>

              {!loading && (
                user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.username?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.username}</span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); logout(); }}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium py-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors"
                  >
                    Login with GitHub
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
