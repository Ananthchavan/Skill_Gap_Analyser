import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useRoadmapStore from '../store/useRoadmapStore';
import DayCard from '../components/DayCard';
import Navbar from '../components/Navbar';
import { Code } from 'lucide-react'; // Imported the code icon

// Helper to calculate week-specific progress for the tabs
const calculateWeekProgress = (week, completedTaskIds) => {
    let total = 0;
    let completed = 0;
    week.days.forEach(day => {
        day.tasks.forEach((_, idx) => {
            total++;
            if (completedTaskIds.includes(`w${week.weekNumber}-d${day.dayNumber}-t${idx}`)) completed++;
        });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
};

export default function RoadmapTimelinePage() {
    const { id } = useParams();
    const [activeWeekNum, setActiveWeekNum] = useState(1);
    const { data, isLoading, fetchAnalysis, completedTaskIds, toggleTask } = useRoadmapStore();

    useEffect(() => {
        fetchAnalysis(id);
    }, [id, fetchAnalysis]);

    if (isLoading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { aiRoadmap } = data;
    const activeWeekData = aiRoadmap.weeks.find(w => w.weekNumber === activeWeekNum) || aiRoadmap.weeks[0];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col font-sans">
            <Navbar />

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <Link to={`/dashboard/${id}`} className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 inline-flex items-center hover:text-indigo-600 transition-colors">
                            &larr; Back to Dashboard
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Course Journey</h1>
                    </div>
                    <div className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded-lg">
                        Target: {data.targetRole}
                    </div>
                </div>

                {/* Top Week Tabs - Updated Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {aiRoadmap.weeks.map((week) => {
                        const progress = calculateWeekProgress(week, completedTaskIds);
                        const isActive = week.weekNumber === activeWeekNum;

                        return (
                            <button
                                key={week.weekNumber}
                                onClick={() => setActiveWeekNum(week.weekNumber)}
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center
                  ${isActive
                                        ? 'bg-white border-indigo-500 shadow-sm dark:bg-slate-900 dark:border-indigo-500'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                                    }`}
                            >
                                {/* Left Icon (Always identical per requirement) */}
                                <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#4F46E5] shadow-md shadow-indigo-500/30 flex items-center justify-center mr-3 sm:mr-4">
                                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                                </div>

                                {/* Right Content Area */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500 dark:text-indigo-400/80'}`}>
                                            Week {week.weekNumber}
                                        </span>
                                        <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-indigo-800 dark:text-indigo-300' : 'text-indigo-700/80 dark:text-indigo-300/80'}`}>
                                            {progress}%
                                        </span>
                                    </div>

                                    <div className={`text-sm sm:text-[15px] font-medium truncate w-full mb-2 ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {week.weekFocus.split(' ')[0]} {/* Shortens the focus */}
                                    </div>

                                    <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Dark Hero Banner */}
                <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <span className="bg-indigo-600 text-[10px] font-extrabold px-3 py-1 rounded uppercase tracking-widest">
                            Current Module
                        </span>
                        <span className="text-slate-400 text-sm font-medium">
                            • Week {activeWeekNum}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold max-w-2xl leading-tight mb-8 relative z-10">
                        {activeWeekData.weekFocus}
                    </h2>

                    <div className="flex items-center gap-3 text-sm font-medium text-slate-300 relative z-10">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#0F172A] flex items-center justify-center text-xs font-bold">AI</div>
                        </div>
                        Your Personalized Curriculum
                    </div>
                </div>

                {/* Main Content Layout (Sidebar + Tasks) */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

                    {/* Left Sidebar (Schedule) */}
                    <div className="w-full md:w-48 flex-shrink-0">
                        <div className="sticky top-24">
                            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">
                                Schedule
                            </h4>
                            <ul className="space-y-3 mb-8">
                                {activeWeekData.days.map((day) => (
                                    <li key={day.dayNumber}>
                                        <button
                                            onClick={() => document.getElementById(`day-${day.dayNumber}`)?.scrollIntoView({ behavior: 'smooth' })}
                                            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors text-left"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                            Day {day.dayNumber}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Bonus Recap Card */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                <h5 className="text-[10px] font-extrabold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-2">Bonus Tips</h5>
                                <p className="text-xs text-indigo-900/70 dark:text-indigo-300/70 font-medium leading-relaxed">
                                    Complete all tasks to advance your overall skill gap closure on the dashboard.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area (Vertical Timeline) */}
                    <div className="flex-1 max-w-3xl">
                        {activeWeekData.days.map((day) => (
                            <DayCard
                                key={`w${activeWeekNum}-d${day.dayNumber}`}
                                weekNumber={activeWeekNum}
                                dayNumber={day.dayNumber}
                                topics={day.topics}
                                tasks={day.tasks}
                                completedTaskIds={completedTaskIds}
                                onToggleTask={toggleTask}
                            />
                        ))}

                        {/* End of week marker */}
                        <div className="py-8 text-center border-t border-gray-200 dark:border-slate-800 mt-8">
                            <p className="text-sm font-bold text-gray-400 dark:text-slate-500">End of Week {activeWeekNum}</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}