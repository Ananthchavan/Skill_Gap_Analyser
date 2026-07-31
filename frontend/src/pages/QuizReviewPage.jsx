import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
            <QuizResults
                questions={quizData.questions}
                userAnswers={quizData.userAnswers}
                score={quizData.score}
                onBackToRoadmap={() => navigate(`/dashboard/${id}`)}
            />
        </div>
    );
}