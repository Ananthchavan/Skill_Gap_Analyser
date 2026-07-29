import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function QuestionCard({ question, selectedOption, onSelect }) {
    if (!question) return null;

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            {/* Question Text */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-8">
                {question.questionText}
            </h2>

            {/* Options List */}
            <div className="flex flex-col gap-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const letter = String.fromCharCode(65 + index); // A, B, C, D

                    return (
                        <button
                            key={index}
                            onClick={() => onSelect(option)}
                            className={`
                                group relative w-full flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 text-left
                                ${isSelected
                                    ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-md shadow-indigo-500/10'
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-700/50 dark:hover:bg-slate-800'}
                            `}
                        >
                            {/* Option Letter Bubble */}
                            <div className={`
                                flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm mr-4 transition-colors
                                ${isSelected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400'}
                            `}>
                                {letter}
                            </div>

                            {/* Option Text */}
                            <span className={`flex-1 text-base font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                {option}
                            </span>

                            {/* Selected Checkmark (Only visible if selected) */}
                            {isSelected && (
                                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute right-4 sm:right-5 animate-in zoom-in" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}