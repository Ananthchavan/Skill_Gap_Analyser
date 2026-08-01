import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ── GitHub SVG ──────────────────────────────────────────────────
const GitHubIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);

// ── Eye icons ───────────────────────────────────────────────────
const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

// ── Check icon ──────────────────────────────────────────────────
const CheckIcon = () => (
    <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── GitHub signup (redirect flow) ───────────────────────────
    const handleGitHubSignup = () => {
        window.location.href = `${API}/auth/github`;
    };

    // ── Email/password registration ─────────────────────────────
    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.');
                return;
            }

            // Registered + session established — same callback flow
            navigate('/auth/callback', { replace: true });
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // ── Password strength indicator ──────────────────────────────
    const getPasswordStrength = () => {
        if (!password) return null;
        if (password.length < 8) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/4' };
        if (password.length < 10) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
        const hasUpper = /[A-Z]/.test(password);
        const hasNum = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        const score = [hasUpper, hasNum, hasSymbol].filter(Boolean).length;
        if (score === 3) return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
        if (score >= 1) return { label: 'Good', color: 'bg-yellow-400', width: 'w-3/4' };
        return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
    };
    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
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

                    {/* Feature list */}
                    <ul className="space-y-2.5 mb-6">
                        {[
                            'AI-powered skill gap analysis',
                            'Personalised 30-day learning roadmap',
                            'Track progress across multiple roles',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <CheckIcon />
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* GitHub button */}
                    <button
                        id="github-signup-button"
                        onClick={handleGitHubSignup}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 active:scale-[0.98]"
                    >
                        <GitHubIcon />
                        Sign up with GitHub — it&apos;s free
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 uppercase tracking-wider">
                                or sign up with email
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Registration form */}
                    <form onSubmit={handleEmailSignup} className="space-y-4" noValidate>

                        {/* Username */}
                        <div>
                            <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Username
                            </label>
                            <input
                                id="signup-username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="johndoe"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Password
                                <span className="ml-1 text-xs font-normal text-slate-400">(min 8 characters)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {strength && (
                                <div className="mt-2">
                                    <div className="h-1 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                    </div>
                                    <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    id="signup-confirm-password"
                                    type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
                                        bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                                        ${confirmPassword && confirmPassword !== password
                                            ? 'border-red-400 dark:border-red-600'
                                            : 'border-gray-300 dark:border-slate-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match.</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="email-signup-button"
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account…
                                </>
                            ) : 'Create account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            Sign in
                        </a>
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
                        By signing up you agree to our{' '}
                        <span className="underline cursor-pointer hover:text-indigo-500">Terms</span>{' '}
                        and{' '}
                        <span className="underline cursor-pointer hover:text-indigo-500">Privacy Policy</span>.
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
}
