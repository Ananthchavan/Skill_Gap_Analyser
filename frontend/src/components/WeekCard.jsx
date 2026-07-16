import React from 'react';
import DayCard from './DayCard';

const WeekCard = ({ weekData, isActive, onExpand, completedTaskIds, onToggleTask }) => {
    const { weekNumber, weekFocus, days } = weekData;

    // Calculate local week-specific progress for the UI headers
    let totalWeekTasks = 0;
    let completedWeekTasks = 0;

    days.forEach(day => {
        day.tasks.forEach((_, index) => {
            totalWeekTasks++;
            if (completedTaskIds.includes(`w${weekNumber}-d${day.dayNumber}-t${index}`)) {
                completedWeekTasks++;
            }
        });
    });

    const weekProgress = totalWeekTasks === 0 ? 0 : Math.round((completedWeekTasks / totalWeekTasks) * 100);
    const isWeekComplete = totalWeekTasks > 0 && completedWeekTasks === totalWeekTasks;

    // RENDER: Collapsed (Inactive) State
    if (!isActive) {
        return (
            <div
                onClick={() => onExpand(weekNumber)}
                className={`flex-[1] min-w-[60px] sm:min-w-[80px] h-full rounded-2xl cursor-pointer flex flex-col items-center py-6 transition-all duration-500 ease-in-out relative overflow-hidden group border
          ${isWeekComplete
                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/50 dark:hover:bg-emerald-900/20'
                        : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700/80'
                    }`}
            >
                <div className="flex flex-col items-center h-full justify-between">
                    <div className="text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                        W{weekNumber}
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="transform -rotate-90 whitespace-nowrap text-xl sm:text-2xl font-black text-slate-300 group-hover:text-indigo-400 dark:text-slate-600 dark:group-hover:text-indigo-500 transition-colors tracking-widest">
                            WEEK {weekNumber}
                        </div>
                    </div>

                    <div className={`text-xs font-bold ${isWeekComplete ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                        {weekProgress}%
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Expanded (Active) State
    return (
        <div className="flex-[8] sm:flex-[10] h-full bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col">

            {/* Sticky Week Header */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sticky top-0 z-10 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold">Week {weekNumber}</h2>
                        {isWeekComplete && (
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                Completed
                            </span>
                        )}
                    </div>
                    <p className="text-slate-300 text-sm">{weekFocus}</p>
                </div>

                <div className="flex flex-col sm:items-end gap-1 min-w-[140px]">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Week Progress</div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isWeekComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${weekProgress}%` }}
                        />
                    </div>
                    <div className="text-xs font-medium text-slate-300 mt-1">{completedWeekTasks} / {totalWeekTasks} tasks</div>
                </div>
            </div>

            {/* Scrollable Days Container */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {days.map((day) => (
                    <DayCard
                        key={`w${weekNumber}-d${day.dayNumber}`}
                        weekNumber={weekNumber}
                        dayNumber={day.dayNumber}
                        topics={day.topics}
                        tasks={day.tasks}
                        completedTaskIds={completedTaskIds}
                        onToggleTask={onToggleTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default WeekCard;