import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnalysisCard from '../components/AnalysisCard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/analysis/dashboard', {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setAnalyses(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const filtered = analyses.filter((a) =>
        a.targetRole?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
                            / analysis-history
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Career Analyses
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Track and manage your professional growth trajectories.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                    <div className="relative flex-1 min-w-[220px] max-w-sm">
                        <svg
                            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search roles or technologies..."
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:border-indigo-400 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2" />
                        </svg>
                        Status
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:border-indigo-400 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2" />
                        </svg>
                        Recent
                    </button>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 h-64 animate-pulse"
                            >
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mb-8" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mt-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {filtered.map((analysis) => (
                            <AnalysisCard key={analysis._id} data={analysis} />
                        ))}

                        <Link
                            to="/NewAnalysis"
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all bg-white dark:bg-slate-900 min-h-[250px] group"
                        >
                            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors ring-1 ring-indigo-100 dark:ring-indigo-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                Start New Career Analysis
                            </h3>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center">
                                Compare your skills against 500+ job roles
                            </p>
                        </Link>
                    </div>
                )}

                {!loading && filtered.length === 0 && search && (
                    <div className="text-center py-16">
                        <p className="text-slate-400 dark:text-slate-500 text-sm">
                            No analyses match "<span className="font-medium text-slate-600 dark:text-slate-300">{search}</span>"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}