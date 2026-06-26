import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis,
    ComposedChart, Line, Tooltip, Legend, CartesianGrid
} from 'recharts';

const calculateTrueMatch = (assessedSkills = [], missingSkills = []) => {
    let totalScore = 0;
    const totalSkills = assessedSkills.length + missingSkills.length;

    if (totalSkills === 0) return 0;

    assessedSkills.forEach(skill => {
        if (skill.currentLevel >= skill.targetLevel) {
            totalScore += 100;
        } else {
            totalScore += (skill.currentLevel / skill.targetLevel) * 100;
        }
    });

    return Math.round(totalScore / totalSkills);
};

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
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data || !data.aiAnalysis) return <div className="p-10">Analysis not found or still processing.</div>;

    const { assessedSkills, criticalMissingSkills } = data.aiAnalysis;

    const trueOverallMatch = calculateTrueMatch(assessedSkills, criticalMissingSkills || []);

    const radarData = assessedSkills.map(skill => ({
        subject: skill.skillName,
        Level: skill.currentLevel,
        fullMark: 100,
    }));

    const proficiencyData = assessedSkills.map(skill => ({
        name: skill.skillName,
        Proficiency: skill.currentLevel,
        Required: skill.targetLevel
    }));

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-4">

                {/* Header */}
                <div>
                    <Link to="/dashboard" className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2 inline-block hover:text-indigo-700 transition">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">/ analysis-details</p>
                            <h1 className="text-xl font-bold text-slate-900">Analysis Details</h1>
                        </div>
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Target Role: {data.targetRole}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left: Radar Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-[340px]">
                        <h2 className="text-sm font-bold text-slate-800 mb-3">Skill Gap Radar</h2>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid gridType="polygon" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Radar name="Proficiency" dataKey="Level" stroke="#6366F1" fill="#818CF8" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-5">

                        {/* Right Top: SVG Half-Donut */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col items-center justify-center min-h-[200px]">
                            <div className="relative flex flex-col items-center justify-center w-full max-w-[210px] pt-2">
                                <svg viewBox="0 0 200 110" className="w-full drop-shadow-sm overflow-visible">
                                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#F1F5F9" strokeWidth="18" strokeLinecap="round" />
                                    <path
                                        d="M 20 100 A 80 80 0 0 1 180 100"
                                        fill="none"
                                        stroke="#4F46E5"
                                        strokeWidth="18"
                                        strokeLinecap="round"
                                        strokeDasharray="251.3"
                                        strokeDashoffset={251.3 - (251.3 * trueOverallMatch) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute bottom-2 flex flex-col items-center">
                                    <span className="text-[34px] font-extrabold text-slate-900 leading-none tracking-tight">
                                        {trueOverallMatch}%
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 mt-1">Overall Skill Match</span>
                                </div>
                            </div>
                            <div className="mt-3 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-semibold px-4 py-1 rounded-full">
                                Gap: {100 - trueOverallMatch}%
                            </div>
                        </div>

                        {/* Right Bottom: Stacked Bars */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                            <h2 className="text-sm font-bold text-slate-800 mb-3">Skill Proficiency & Gaps</h2>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                                {assessedSkills.map((skill, idx) => {
                                    const current = skill.currentLevel;
                                    const target = skill.targetLevel;
                                    const trueGap = Math.max(0, target - current);
                                    const empty = 100 - current - trueGap;

                                    const barData = [{ name: 'Skill', current: current, gap: trueGap, empty: empty }];

                                    return (
                                        <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs font-semibold text-slate-900 truncate pr-2">{skill.skillName}</span>
                                                <span className="text-xs font-bold text-slate-700">{current}%</span>
                                            </div>

                                            <div className="h-3.5 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                        <XAxis type="number" hide domain={[0, 100]} />
                                                        <YAxis type="category" hide dataKey="name" />
                                                        <Bar dataKey="current" stackId="a" fill="#6366F1" radius={[4, 0, 0, 4]} isAnimationActive={false} />
                                                        <Bar dataKey="gap" stackId="a" fill="#A5B4FC" radius={[0, 0, 0, 0]} isAnimationActive={false} />
                                                        <Bar dataKey="empty" stackId="a" fill="#E2E8F0" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold uppercase tracking-wider">
                                                <span className="text-slate-400">Target: {target}%</span>
                                                <span className={trueGap > 0 ? "text-indigo-500" : "text-emerald-500"}>
                                                    {trueGap > 0 ? `Gap: ${trueGap}%` : 'Target Met'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <h2 className="text-sm font-bold text-slate-800 mb-3">Top Missing Skills (Gap)</h2>

                        {(!criticalMissingSkills || criticalMissingSkills.length === 0) ? (
                            <div className="flex items-center justify-center h-24 text-emerald-600 bg-emerald-50/50 border border-emerald-100 rounded-lg font-medium text-xs">
                                No critical skills missing!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {criticalMissingSkills.map((skill, idx) => {
                                    let badgeColor = "bg-slate-100 text-slate-600";
                                    if (skill.importance === 'High') badgeColor = "bg-red-50 text-red-600";
                                    if (skill.importance === 'Medium') badgeColor = "bg-amber-50 text-amber-600";
                                    if (skill.importance === 'Low') badgeColor = "bg-yellow-50 text-yellow-600";

                                    return (
                                        <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                                            <div className="pr-3">
                                                <div className="text-xs font-semibold text-slate-900">{skill.skillName}</div>
                                                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed" title={skill.reason}>
                                                    {skill.reason}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap mt-0.5 ${badgeColor}`}>
                                                {skill.importance}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-[280px]">
                        <h2 className="text-sm font-bold text-slate-800 mb-4">Proficiency vs. Required</h2>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={proficiencyData} margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
                                    <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />

                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                                    />

                                    <Tooltip
                                        cursor={{ fill: '#F8FAFC' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '11px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '10px', color: '#64748B' }} />

                                    <Bar dataKey="Proficiency" barSize={32} fill="#A5B4FC" radius={[4, 4, 0, 0]} />

                                    <Line type="monotone" dataKey="Required" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3.5, fill: '#fff', stroke: '#4F46E5', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}