export default function Signup() {
    const handleSignup = () => {
        // GitHub OAuth handles both signup & login — new users are auto-created
        window.location.href = 'http://localhost:8080/auth/github';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Create your free account
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Join thousands of developers closing their skill gaps.
                </p>
            </div>

            {/* Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-800">

                    {/* What you get */}
                    <ul className="space-y-3 mb-7">
                        {[
                            'AI-powered skill gap analysis',
                            'Personalised 30-day learning roadmap',
                            'Track progress across multiple roles',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* GitHub OAuth button */}
                    <button
                        id="github-signup-button"
                        onClick={handleSignup}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:scale-[0.98]"
                    >
                        {/* GitHub SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        Sign up with GitHub — it's free
                    </button>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Already have an account?</span>
                        </div>
                    </div>

                    <a
                        href="/login"
                        className="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    >
                        Sign in instead
                    </a>

                    {/* Fine print */}
                    <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
                        By signing up you agree to our{' '}
                        <span className="underline cursor-pointer hover:text-indigo-500">Terms</span>{' '}
                        and{' '}
                        <span className="underline cursor-pointer hover:text-indigo-500">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
