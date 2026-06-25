import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const decideRedirect = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/analysis/dashboard', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    navigate('/login', { replace: true });
                    return;
                }

                const analyses = await res.json();

                if (analyses.length === 0) {
                    navigate('/NewAnalysis', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            } catch {
                navigate('/login', { replace: true });
            }
        };

        decideRedirect();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <span className="absolute inset-0 rounded-2xl ring-4 ring-indigo-400/40 animate-ping" />
            </div>

            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />

            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Signing you in…
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Setting up your workspace, just a moment.
            </p>
        </div>
    );
}
