import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';
import QuizResults from '../components/QuizResults';

export default function QuizReviewPage() {
    const { id, weekId } = useParams();
    const navigate = useNavigate();

    const { quizScores, fetchAnalysis, isLoading } = useRoadmapStore();

    // Format weekId properly for comparison ('final' vs Number)
    const formattedWeekId = weekId === 'final' ? 'final' : parseInt(weekId, 10);

    // Ensure data is loaded (if user refreshed the page directly on this URL)
    useEffect(() => {
        fetchAnalysis(id);
    }, [id, fetchAnalysis]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Find the specific quiz data
    const quizData = quizScores.find(q => q.weekNumber === formattedWeekId);

    if (!quizData || !quizData.questions || !quizData.userAnswers) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Not Available</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't find the detailed data for this assessment.</p>
                <button onClick={() => navigate(`/dashboard/${id}`)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const score = quizData.score;
    const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
    const scoreBg   = score >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' : score >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    const isWeekly  = weekId !== 'final';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

            {/* ── Sticky top navbar ─────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">

                    {/* Left: back button */}
                    <button
                        onClick={() => navigate(`/dashboard/${id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    {/* Centre: title */}
                    <span className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide">
                        {isWeekly ? `Week ${weekId} Assessment` : 'Final Assessment'}
                    </span>

                    {/* Right: score pill */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${scoreBg} ${scoreColor}`}>
                        <Award className="w-4 h-4" />
                        {score}%
                    </div>
                </div>
            </nav>

            {/* ── Page body ─────────────────────────────────────────────────── */}
            <main className="flex-1 px-4 sm:px-8 py-8">
                <QuizResults
                    questions={quizData.questions}
                    userAnswers={quizData.userAnswers}
                    score={score}
                    onBackToRoadmap={() => navigate(`/dashboard/${id}`)}
                />
            </main>
        </div>
    );
}