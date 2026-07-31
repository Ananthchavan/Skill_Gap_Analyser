import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, BrainCircuit } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';
import QuestionCard from '../components/QuestionCard';
import QuizResults from '../components/QuizResults';

export default function QuizPage() {
    const { id, weekId } = useParams();
    const navigate = useNavigate();

    const { saveQuizScore } = useRoadmapStore();

    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [finalScore, setFinalScore] = useState(null);

    // Format weekId properly for the backend/Zustand ('final' vs Number)
    const formattedWeekId = weekId === 'final' ? 'final' : parseInt(weekId, 10);

    // Fetch Quiz on Mount
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/analysis/${id}/quiz/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ weekNumber: formattedWeekId }),
                    credentials: 'include'
                });

                if (!res.ok) throw new Error('Failed to generate quiz. Please try again.');

                const data = await res.json();
                setQuestions(data.quiz);
                setUserAnswers(new Array(data.quiz.length).fill(null));
                setIsGenerating(false);
            } catch (err) {
                setError(err.message);
                setIsGenerating(false);
            }
        };

        fetchQuiz();
    }, [id, formattedWeekId]);

    const handleSelectOption = (option) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentIndex] = option;
        setUserAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            //FINISH QUIZ - Calculate Score
            let correctCount = 0;
            questions.forEach((q, idx) => {
                if (userAnswers[idx] === q.correctAnswer) correctCount++;
            });

            const calculatedScore = Math.round((correctCount / questions.length) * 100);

            //save to Zustand (Now passing questions and userAnswers!)
            saveQuizScore(formattedWeekId, calculatedScore, questions, userAnswers);

            //reveal Results
            setFinalScore(calculatedScore);
        }
    };

    const handleQuit = () => {
        navigate(`/dashboard/${id}/roadmap`);
    };

    // UI: Loading State
    if (isGenerating) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <BrainCircuit className="w-16 h-16 text-indigo-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Generating Assessment...</h2>
                <p className="text-slate-400 text-center max-w-sm mb-8">
                    Our AI is analyzing your specific curriculum to generate a custom mock technical screen.
                </p>
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    // UI: Error State
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800 text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Generation Failed</h2>
                    <p className="text-red-600 dark:text-red-300 text-sm mb-6">{error}</p>
                    <button onClick={handleQuit} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold">
                        Return to Roadmap
                    </button>
                </div>
            </div>
        );
    }

    // UI: Results State (Quiz Complete)
    if (finalScore !== null) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
                <QuizResults
                    questions={questions}
                    userAnswers={userAnswers}
                    score={finalScore}
                    onBackToRoadmap={handleQuit}
                />
            </div>
        );
    }

    // UI: Active Quiz State
    const currentQuestion = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;
    const isNextDisabled = userAnswers[currentIndex] === null;
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

            {/* Minimal Quiz Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-4 w-full max-w-4xl mx-auto">
                    <button onClick={handleQuit} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Quit Assessment">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {formattedWeekId === 'final' ? 'Final Assessment' : `Week ${formattedWeekId} Mastery`}
                            </span>
                            <span className="text-xs font-bold text-indigo-500">
                                {currentIndex + 1} of {questions.length}
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Quiz Body */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <QuestionCard
                    question={currentQuestion}
                    selectedOption={userAnswers[currentIndex]}
                    onSelect={handleSelectOption}
                />

                <div className="w-full max-w-3xl mx-auto mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className={`
                            px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg active:scale-95 text-sm sm:text-base
                            ${isNextDisabled
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 shadow-none'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'}
                        `}
                    >
                        {isLastQuestion ? 'Submit Assessment' : 'Next Question'}
                    </button>
                </div>
            </main>

        </div>
    );
}