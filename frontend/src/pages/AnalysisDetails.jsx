import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis
} from 'recharts';

export default function AnalysisDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/analysis/${id}`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch data');
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data || !data.aiAnalysis) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <Navbar />
            <div className="p-10 text-slate-600 dark:text-slate-400">Analysis not found or still processing.</div>
        </div>
    );

    const overallMatch = data.aiAnalysis?.overallMatch || 0;
    const assessedSkills = data.aiAnalysis?.assessedSkills || [];

    const radarData = assessedSkills.map(skill => ({
        subject: skill.skillName,
        Level: skill.currentLevel,
        fullMark: 100,
    }));

    const pieColors = ['#4F46E5', '#E5E7EB'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">

                {/* Header */}
                <div>
                    <Link to="/dashboard" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2 inline-block font-medium">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Analysis Details</h1>
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Target Role: {data.targetRole}
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Radar Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 flex flex-col min-h-[320px]">
                        <h2 className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-2">Skill Gap Radar</h2>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 13 }} />
                                    <Radar name="Proficiency" dataKey="Level" stroke="#6366F1" fill="#818CF8" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">

                        {/* Semi-circle gauge */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 flex flex-col items-center justify-center min-h-[190px]">
                            <div className="relative flex flex-col items-center justify-center w-full max-w-[200px] pt-2">
                                <svg viewBox="0 0 200 110" className="w-full overflow-visible">
                                    <path
                                        d="M 20 100 A 80 80 0 0 1 180 100"
                                        fill="none"
                                        stroke="#E2E8F0"
                                        strokeWidth="16"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 20 100 A 80 80 0 0 1 180 100"
                                        fill="none"
                                        stroke="#4F46E5"
                                        strokeWidth="16"
                                        strokeLinecap="round"
                                        strokeDasharray="251.3"
                                        strokeDashoffset={251.3 - (251.3 * overallMatch) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute bottom-1 flex flex-col items-center">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 leading-none tracking-tight">
                                        {overallMatch}%
                                    </span>
                                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-0.5">
                                        Overall Skill Match
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-[10px] font-semibold px-4 py-1 rounded-full">
                                Gap: {100 - overallMatch}%
                            </div>
                        </div>

                        {/* Skill Bars */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
                            <h2 className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-3">Skill Proficiency &amp; Gaps</h2>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                                {assessedSkills.map((skill, idx) => {
                                    const gap = 100 - skill.currentLevel;
                                    const barData = [{ name: 'Skill', level: skill.currentLevel, gap: gap }];

                                    return (
                                        <div key={idx} className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs font-semibold text-gray-900 dark:text-slate-200 truncate pr-1">{skill.skillName}</span>
                                                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{skill.currentLevel}%</span>
                                            </div>

                                            <div className="h-3 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                        <XAxis type="number" hide domain={[0, 100]} />
                                                        <YAxis type="category" hide dataKey="name" />
                                                        <Bar dataKey="level" stackId="a" fill="#6366F1" radius={[4, 0, 0, 4]} isAnimationActive={false} />
                                                        <Bar dataKey="gap" stackId="a" fill="#334155" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                                <span>Level</span>
                                                <span>Gap: {gap}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}