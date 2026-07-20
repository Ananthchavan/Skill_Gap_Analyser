import React from 'react';
import { Check } from 'lucide-react';

const TaskCard = ({ taskId, taskDescription, associatedSkill, estimatedHours, isCompleted, onToggle }) => {
    return (
        <div
            className={`p-5 mb-4 rounded-xl border transition-all duration-200 flex gap-4 items-start group cursor-pointer
      ${isCompleted
                    ? 'bg-slate-50 border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50 opacity-75'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:hover:border-indigo-500'
                }`}
            onClick={() => onToggle(taskId)}
        >

            {/* Checkbox Area */}
            <div className="pt-1 flex-shrink-0">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200
          ${isCompleted
                        ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                        : 'bg-transparent border-gray-300 dark:border-slate-600 group-hover:border-indigo-400'
                    }`}
                >
                    {isCompleted && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-2 items-center text-[10px] sm:text-xs font-bold">
                    <span className={`px-2 py-0.5 rounded-md ${isCompleted ? 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-500' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                        {associatedSkill}
                    </span>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed font-medium transition-colors duration-200 ${isCompleted ? 'text-gray-400 dark:text-slate-500 line-through decoration-gray-300' : 'text-gray-800 dark:text-slate-200'}`}>
                    {taskDescription}
                </p>
            </div>

            {/* Right Action Text (Optional, mimicking "Start Lesson") */}
            <div className="hidden sm:flex flex-col items-center justify-center pl-4 border-l border-gray-100 dark:border-slate-800 min-w-[80px]">
                <span className={`text-xs font-bold transition-colors ${isCompleted ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700'}`}>
                    {isCompleted ? 'Done' : 'Mark Done'}
                </span>
            </div>

        </div>
    );
};

export default TaskCard;