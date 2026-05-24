import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Home',     to: '/'           },
  { label: 'About Us', to: '#how-it-works' },
  { label: 'Features', to: '#why-us'     },
  { label: 'Pricing',  to: '#'           },
]

const supportLinks = [
  { label: 'Help Center', to: '#' },
  { label: 'Contact',     to: '#' },
  { label: 'Terms',       to: '#' },
  { label: 'Privacy',     to: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-10">

        {/* ── Brand (col 1) ── */}
        <div className="sm:col-span-1">
          <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            SGA.ai
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
            © 2026 Chandra Shekar Chavan.<br />All rights reserved.
          </p>
        </div>

        {/* ── Navigation (col 2) ── */}
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-3">Navigation</p>
          <ul className="flex flex-col gap-2">
            {navLinks.map(l => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Support (col 3) ── */}
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-3">Support</p>
          <ul className="flex flex-col gap-2">
            {supportLinks.map(l => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Social (col 4) ── */}
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-3">Social</p>
          <ul className="flex flex-col gap-3">

            {/* GitHub */}
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </li>

            {/* Contact / Email */}
            <li>
              <a
                href="mailto:contact@sga.ai"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            </li>

            {/* LinkedIn + Twitter row */}
            <li className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </li>

          </ul>
        </div>

      </div>
    </footer>
  )
}
