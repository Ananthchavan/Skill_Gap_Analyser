import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Map, ArrowRight, Target, CircleDashed } from 'lucide-react';
import Navbar from '../components/Navbar';
import useThemeStore from '../store/useThemeStore';
import useRoadmapStore from '../store/useRoadmapStore';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis,
    ComposedChart, Line, Tooltip, Legend, CartesianGrid
} from 'recharts';

export default function AnalysisDetails() {
    const { id } = useParams();
    const { isDark } = useThemeStore();

    // Wire up Zustand
    const { data, isLoading, fetchAnalysis, progressData } = useRoadmapStore();

    useEffect(() => {
        fetchAnalysis(id);
    }, [id, fetchAnalysis]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data || !data.aiAnalysis) return (
        <div className="p-10 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 min-h-screen">
            Analysis not found or still processing.
        </div>
    );

    // Extract FULLY DYNAMIC data from Zustand for ALL UI elements
    const {
        overallProgress,
        missingSkillsProgress,
        dynamicAssessedSkills,
        trueOverallMatch
    } = progressData;

    // Use dynamic array for all charts
    const radarData = dynamicAssessedSkills.map(skill => ({
        subject: skill.skillName,
        Level: skill.currentLevel,
        fullMark: 100,
    }));

    const proficiencyData = dynamicAssessedSkills.map(skill => ({
        name: skill.skillName,
        Proficiency: skill.currentLevel,
        Required: skill.targetLevel
    }));

    // dynamic colors based on theme
    const radarTickColor = isDark ? '#94A3B8' : '#6B7280';
    const gridColor = isDark ? '#1E293B' : '#F1F5F9';
    const xAxisColor = isDark ? '#94A3B8' : '#64748B';
    const yAxisColor = isDark ? '#64748B' : '#94A3B8';
    const donutTrackColor = isDark ? '#1E293B' : '#F1F5F9';
    const tooltipBg = isDark ? '#1E293B' : '#ffffff';
    const tooltipBorder = isDark ? '#334155' : '#F1F5F9';
    const tooltipTextColor = isDark ? '#CBD5E1' : '#374151';
    const legendColor = isDark ? '#94A3B8' : '#64748B';
    const emptyBarColor = isDark ? '#334155' : '#E2E8F0';
    const cursorFill = isDark ? '#0F172A' : '#F8FAFC';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-4">

                {/* header */}
                <div>
                    <Link to="/dashboard" className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2 inline-block hover:text-indigo-400 transition">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm px-5 py-3 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">/ analysis-details</p>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis Details</h1>
                        </div>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Target Role: {data.targetRole}
                        </span>
                    </div>
                </div>

                {/* summary */}
                {data.aiAnalysis.executiveSummary && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 px-6 py-4 flex gap-4 items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest mb-1">Summary</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {data.aiAnalysis.executiveSummary}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* left: radar chart (DYNAMIC) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col min-h-[340px]">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Skill Gap Radar</h2>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid gridType="polygon" stroke={isDark ? '#1E293B' : '#e5e7eb'} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: radarTickColor, fontSize: 12 }} />
                                    <Radar name="Proficiency" dataKey="Level" stroke="#6366F1" fill="#818CF8" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-5">

                        {/* right top: svg half-donut (DYNAMIC) */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col items-center justify-center min-h-[200px]">
                            <div className="relative flex flex-col items-center justify-center w-full max-w-[210px] pt-2">
                                <svg viewBox="0 0 200 110" className="w-full drop-shadow-sm overflow-visible">
                                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={donutTrackColor} strokeWidth="18" strokeLinecap="round" />
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
                                    <span className="text-[34px] font-extrabold text-slate-900 dark:text-slate-100 leading-none tracking-tight">
                                        {trueOverallMatch}%
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Overall Skill Match</span>
                                </div>
                            </div>
                            <div className="mt-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold px-4 py-1 rounded-full transition-all">
                                Gap: {100 - trueOverallMatch}%
                            </div>
                        </div>

                        {/*right bottom: stacked bars (DYNAMIC) */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Skill Proficiency & Gaps</h2>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                                {dynamicAssessedSkills.map((skill, idx) => {
                                    const current = skill.currentLevel;
                                    const target = skill.targetLevel;
                                    const trueGap = Math.max(0, target - current);
                                    const empty = 100 - current - trueGap;

                                    const barData = [{ name: 'Skill', current: current, gap: trueGap, empty: empty }];

                                    return (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">{skill.skillName}</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{current}%</span>
                                            </div>

                                            <div className="h-3.5 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                        <XAxis type="number" hide domain={[0, 100]} />
                                                        <YAxis type="category" hide dataKey="name" />
                                                        <Bar dataKey="current" stackId="a" fill="#6366F1" radius={[4, 0, 0, 4]} isAnimationActive={false} />
                                                        <Bar dataKey="gap" stackId="a" fill="#A5B4FC" radius={[0, 0, 0, 0]} isAnimationActive={false} />
                                                        <Bar dataKey="empty" stackId="a" fill={emptyBarColor} radius={[0, 4, 4, 0]} isAnimationActive={false} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold uppercase tracking-wider">
                                                <span className="text-slate-400 dark:text-slate-500">Target: {target}%</span>
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

                    {/* missing skills (DYNAMIC THRESHOLDS) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Target Skills to Master</h2>

                        {(() => {
                            // Filter out skills that have reached or exceeded 100% completion relative to their target
                            const activeMissingSkills = (missingSkillsProgress || []).filter(skill => {
                                const percentage = (skill.currentLevel / skill.targetLevel) * 100;
                                return Math.round(percentage) < 100;
                            });

                            if (activeMissingSkills.length === 0) {
                                return (
                                    <div className="flex flex-col items-center justify-center h-32 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4 text-center transition-all duration-500">
                                        <svg className="w-8 h-8 mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-bold text-sm">Congratulations!</span>
                                        <span className="text-xs font-medium mt-1">You've successfully mastered all required skills for this role.</span>
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-3">
                                    {activeMissingSkills.map((skill, idx) => {
                                        const percentage = (skill.currentLevel / skill.targetLevel) * 100;

                                        let dynamicImportance = 'High';
                                        let badgeColor = "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";

                                        if (percentage >= 30 && percentage < 70) {
                                            dynamicImportance = 'Medium';
                                            badgeColor = "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
                                        } else if (percentage >= 70) {
                                            dynamicImportance = 'Low';
                                            badgeColor = "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
                                        }

                                        return (
                                            <div key={idx} className="flex justify-between items-start border-b border-slate-50 dark:border-slate-800 pb-2.5 last:border-0 last:pb-0 transition-all duration-300">
                                                <div className="pr-3">
                                                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{skill.skillName}</div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed" title={skill.reason}>
                                                        {skill.reason}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap mt-0.5 ${badgeColor}`}>
                                                        {dynamicImportance}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 mt-1">
                                                        {Math.round(percentage)}% Done
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Proficiency vs Required Chart (DYNAMIC) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col min-h-[280px]">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Proficiency vs. Required</h2>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={proficiencyData} margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
                                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />

                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        dy={10}
                                        tick={({ x, y, payload }) => {
                                            const full = payload.value;
                                            const short = full.length > 12 ? full.slice(0, 11) + '…' : full;
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{full}</title>
                                                    <text
                                                        textAnchor="middle"
                                                        fill={xAxisColor}
                                                        fontSize={10}
                                                        fontWeight={500}
                                                    >
                                                        {short}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: yAxisColor, fontSize: 10 }}
                                    />

                                    <Tooltip
                                        cursor={{ fill: cursorFill }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: `1px solid ${tooltipBorder}`,
                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                            fontSize: '11px',
                                            backgroundColor: tooltipBg,
                                            color: tooltipTextColor
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '10px', color: legendColor }} />

                                    <Bar dataKey="Proficiency" barSize={32} fill="#A5B4FC" radius={[4, 4, 0, 0]} />

                                    <Line type="monotone" dataKey="Required" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3.5, fill: isDark ? '#1E293B' : '#fff', stroke: '#4F46E5', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* <=================ROADMAP PROGRESS=============> */}
                <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                        {/* Left Side: Missing Skills Progress Tracker */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Skill Gap Closure</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Track your roadmap progress for missing requirements.</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between items-end mb-2.5">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Roadmap Progress</span>
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{Math.round(overallProgress)}%</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>

                                {/* Dynamic Missing Skills Targets */}
                                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                                        Target Skills to Master:
                                    </span>

                                    {(!missingSkillsProgress || missingSkillsProgress.length === 0) ? (
                                        <span className="text-xs font-medium text-emerald-500 mt-1">None! Ready for the interview.</span>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {missingSkillsProgress.map((skill, idx) => {
                                                const widthPercentage = (skill.currentLevel / skill.targetLevel) * 100;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate pr-2">
                                                                {skill.skillName}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                                                {Math.round(widthPercentage)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500"
                                                                style={{ width: `${widthPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Launch Roadmap Button */}
                        <div className="flex-shrink-0 md:pl-8 md:border-l border-gray-100 dark:border-slate-800 flex flex-col justify-center items-center">
                            <Link
                                to={`/dashboard/${id}/roadmap`}
                                className="
                                    w-full md:w-auto inline-flex items-center justify-center gap-2 
                                    px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl 
                                    shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 
                                    transition-all duration-200 active:scale-95 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                                "
                            >
                                <Map className="w-5 h-5" />
                                Open 30-Day Roadmap
                                <ArrowRight className="w-5 h-5 ml-1" />
                            </Link>
                            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                Your personalized curriculum is ready.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}