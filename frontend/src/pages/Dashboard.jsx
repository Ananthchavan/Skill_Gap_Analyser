import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnalysisCard from '../components/AnalysisCard';

export default function Dashboard() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-10 text-center">Loading your career data...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Career Analyses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.map((analysis) => (
                    <AnalysisCard key={analysis._id} data={analysis} />
                ))}

                <Link
                    to="/NewAnalysis"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors bg-white min-h-[250px]"
                >
                    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Start New Career Analysis</h3>
                    <p className="text-sm text-gray-500 mt-1">Compare your skills against 500+ job roles</p>
                </Link>
            </div>
        </div>
    );
}