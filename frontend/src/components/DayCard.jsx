import React from 'react';
import TaskCard from './TaskCard';
import SmartSpace from './SmartSpace';

const DayCard = ({ weekNumber, dayNumber, topics, tasks, completedTaskIds, onToggleTask }) => {
    const dayId = `w${weekNumber}-d${dayNumber}`;
    return (
        <div id={`day-${dayNumber}`} className="mb-12 relative flex gap-4 sm:gap-6">

            {/* Circular Day Indicator */}
            <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm z-10">
                    {dayNumber}
                </div>
                {/* Vertical connector line (optional, adds flow) */}
                <div className="w-0.5 h-full bg-gray-100 dark:bg-slate-800/50 absolute top-10 left-5 -z-0"></div>
            </div>

            {/* Day Content */}
            <div className="flex-1 pt-2 pb-6">
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center flex-wrap gap-2">
                        {topics && topics.length > 0 ? topics.join(' • ') : `Day ${dayNumber} Focus`}
                    </h3>
                </div>

                <div className="flex flex-col">
                    {tasks.map((task, index) => {
                        const taskId = `w${weekNumber}-d${dayNumber}-t${index}`;
                        const isCompleted = completedTaskIds.includes(taskId);

                        return (
                            <TaskCard
                                key={taskId}
                                taskId={taskId}
                                taskDescription={task.taskDescription}
                                associatedSkill={task.associatedSkill}
                                estimatedHours={task.estimatedHours}
                                isCompleted={isCompleted}
                                onToggle={onToggleTask}
                            />
                        );
                    })}
                </div>

                <SmartSpace dayId={dayId} />
            </div>
        </div>
    );
};

export default DayCard;