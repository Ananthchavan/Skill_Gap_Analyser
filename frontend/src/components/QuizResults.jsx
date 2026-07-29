import React from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

export default function QuizResults({ questions, userAnswers, score, onBackToRoadmap }) {

    // Quick SVG Circular Progress Ring
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="w-full max-w-4xl mx-auto py-8 animate-fade-in-up">

            {/* Header & Score Ring */}
            <div className="flex flex-col items-center mb-12">
                <div className="relative flex items-center justify-center mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                        {/* Background Circle */}
                        <circle
                            cx="64" cy="64" r={radius}
                            className="stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="8" fill="transparent"
                        />
                        {/* Score Circle */}
                        <circle
                            cx="64" cy="64" r={radius}
                            className={`${score >= 80 ? 'stroke-emerald-500' : score >= 50 ? 'stroke-amber-500' : 'stroke-red-500'}`}
                            strokeWidth="8" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{score}%</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assessment Complete</h2>
                <p className="text-slate-500 dark:text-slate-400">Review your answers and the AI explanations below.</p>
            </div>

            {/* Questions Review List */}
            <div className="space-y-8 mb-12">
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswer;

                    return (
                        <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">

                            <div className="flex items-start gap-3 mb-6">
                                <div className="mt-1">
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1 block">Question {index + 1}</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{q.questionText}</h3>
                                </div>
                            </div>

                            {/* Read-Only Options Map */}
                            <div className="flex flex-col gap-2 mb-6 ml-9">
                                {q.options.map((opt, i) => {
                                    let optionStyle = "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"; // Default

                                    if (opt === q.correctAnswer) {
                                        optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-500/50 dark:text-emerald-400 font-bold";
                                    } else if (opt === userAnswer && opt !== q.correctAnswer) {
                                        optionStyle = "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-400";
                                    }

                                    return (
                                        <div key={i} className={`p-3 rounded-xl border ${optionStyle} flex items-center`}>
                                            <span className="w-6 font-bold opacity-50">{String.fromCharCode(65 + i)}</span>
                                            <span>{opt}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* The Golden Nugget: AI Explanation */}
                            <div className="ml-9 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex gap-3 items-start">
                                <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                                    <span className="font-bold block mb-1">Why this is the answer:</span>
                                    {q.explanation}
                                </p>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Back to Roadmap CTA */}
            <div className="flex justify-center">
                <button
                    onClick={onBackToRoadmap}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Roadmap
                </button>
            </div>

        </div>
    );
}