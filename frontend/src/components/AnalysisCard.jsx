import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';

export default function AnalysisCard({ data, onDelete }) {
    const isProcessing = data.status === 'processing';

    const { analysisId, progressData } = useRoadmapStore();

    //establish the base score from the database
    let matchScore = data.aiAnalysis?.overallMatch || 0;

    //if this card is the one actively loaded in the store,
    //pull its real-time progress calculations directly from Zustand.
    if (analysisId === data._id && progressData?.trueOverallMatch) {
        matchScore = progressData.trueOverallMatch;
    }
    //fallback:if its a different card and has the roadmap data populated, calculate locally
    else if (data.aiRoadmap?.weeks) {
        let totalTasks = 0;
        data.aiRoadmap.weeks.forEach((week) => {
            week.days?.forEach((day) => {
                totalTasks += (day.tasks?.length || 0);
            });
        });

        const completedCount = data.completedTaskIds?.length || 0;

        if (totalTasks > 0) {
            const overallProgressPercentage = completedCount / totalTasks;
            const remainingGap = 100 - (data.aiAnalysis?.overallMatch || 0);
            matchScore = Math.round((data.aiAnalysis?.overallMatch || 0) + (remainingGap * overallProgressPercentage));
        }
    }

    const dateFormatted = new Date(data.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const chartData = data.aiAnalysis?.assessedSkills?.map(skill => ({
        subject: skill.skillName,
        User: skill.currentLevel,
        Target: skill.targetLevel,
        fullMark: 100,
    })) || [];

    return (
        <Link
            to={`/dashboard/${data._id}`}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col relative overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 group"
        >

            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        {isProcessing ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                Processing Analysis
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Active
                            </span>
                        )}

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (window.confirm("Are you sure you want to delete this analysis?")) {
                                    onDelete(data._id);
                                }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors relative z-20"
                            title="Delete Analysis"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mt-3">{data.targetRole}</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{dateFormatted}</p>
                </div>

                <div className="w-24 h-24 absolute top-4 right-4 opacity-80 z-10">
                    {!isProcessing && chartData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid gridType="polygon" />
                                <PolarAngleAxis dataKey="subject" tick={false} />
                                <Radar name="Target" dataKey="Target" stroke="#E5E7EB" fill="#F3F4F6" fillOpacity={0.6} />
                                <Radar name="User" dataKey="User" stroke="#6366F1" fill="#818CF8" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 z-10">
                {data.aiAnalysis?.assessedSkills?.slice(0, 2).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs rounded-md">
                        {skill.skillName}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 z-10">
                {isProcessing ? (
                    <div className="text-sm text-gray-500 dark:text-slate-400 italic text-center">AI is analyzing your profile...</div>
                ) : (
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${matchScore}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">{matchScore}% Overall Match</span>
                    </div>
                )}
            </div>
        </Link>
    );
}