import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function AnalysisCard({ data }) {
    const isProcessing = data.status === 'processing';
    const matchScore = data.aiAnalysis?.overallMatch || 0;

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">

            <div className="flex justify-between items-start mb-4">
                <div>
                    {isProcessing ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                            Processing Analysis
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Active
                        </span>
                    )}
                    <h2 className="text-lg font-semibold text-gray-900 mt-3">{data.targetRole}</h2>
                    <p className="text-sm text-gray-500">{dateFormatted}</p>
                </div>

                <div className="w-24 h-24 absolute top-4 right-4 opacity-80">
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
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {skill.skillName}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
                {isProcessing ? (
                    <div className="text-sm text-gray-500 italic">AI is analyzing your profile...</div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 w-24">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${matchScore}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">{matchScore}% Match Proficiency</span>
                        </div>
                        <Link
                            to={`/dashboard/${data._id}`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}