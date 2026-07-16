import { create } from 'zustand';

const useRoadmapStore = create((set, get) => ({
    analysisId: null,
    data: null,
    completedTaskIds: [],
    isLoading: true,
    error: null,

    // Derived Data
    progressData: { overallProgress: 0, missingSkillsProgress: [], trueOverallMatch: 0 },

    //called by analysisDetail
    fetchAnalysis: async (id) => {
        //prevent re-fetching of data  
        if (get().analysisId === id && get().data) {
            get().calculateProgress();
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`http://localhost:8080/api/analysis/${id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const result = await res.json();

            // Ensure we load any previously saved completed tasks from MongoDB
            const fetchedCompletedTasks = result.completedTaskIds || [];

            set({
                analysisId: id,
                data: result,
                completedTaskIds: fetchedCompletedTasks,
                isLoading: false,
            });

            get().calculateProgress();
        } catch (error) {
            console.error("Fetch error:", error);
            set({ error: error.message, isLoading: false });
        }
    },

    // 2. The Interaction (Called by Roadmap Timeline checkboxes)
    toggleTask: async (taskId) => {
        const state = get();
        const newCompletedTaskIds = state.completedTaskIds.includes(taskId)
            ? state.completedTaskIds.filter(id => id !== taskId)
            : [...state.completedTaskIds, taskId];

        // OPTIMISTIC UI: Instantly update state and recalculate math
        set({ completedTaskIds: newCompletedTaskIds });
        get().calculateProgress();

        // SILENT BACKGROUND SYNC: Fire and forget
        try {
            await fetch(`http://localhost:8080/api/analysis/${state.analysisId}/progress`, {
                method: 'PATCH', // Assumes you make a PATCH route on your backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedTaskIds: newCompletedTaskIds }),
                credentials: 'include'
            });
        } catch (error) {
            console.error("Silent background sync failed:", error);
        }
    },

    // Math Engine
    calculateProgress: () => {
        const { data, completedTaskIds } = get();
        if (!data || !data.aiRoadmap || !data.aiAnalysis) return;

        let totalTasks = 0;
        const skillTaskCounts = {};

        // Map all tasks to count totals and completions
        data.aiRoadmap.weeks.forEach((week) => {
            week.days.forEach((day) => {
                day.tasks.forEach((task, taskIndex) => {
                    totalTasks++;
                    const taskId = `w${week.weekNumber}-d${day.dayNumber}-t${taskIndex}`;
                    const skill = task.associatedSkill;

                    if (!skillTaskCounts[skill]) skillTaskCounts[skill] = { total: 0, completed: 0 };
                    skillTaskCounts[skill].total++;
                    if (completedTaskIds.includes(taskId)) skillTaskCounts[skill].completed++;
                });
            });
        });

        const overallProgress = totalTasks === 0 ? 0 : (completedTaskIds.length / totalTasks) * 100;

        // Calculate dynamic missing skills progress for the Banner
        const missingSkillsProgress = (data.aiAnalysis.criticalMissingSkills || []).map(skill => {
            const stats = skillTaskCounts[skill.skillName];
            if (!stats || stats.total === 0) return { ...skill, currentLevel: skill.currentLevel };

            const gap = skill.targetLevel - skill.currentLevel;
            const completionRatio = stats.completed / stats.total;
            const newCurrentLevel = skill.currentLevel + (gap * completionRatio);

            return {
                ...skill,
                currentLevel: Math.round(newCurrentLevel)
            };
        });

        // Re-calculate true overall match for the donut chart
        const assessedSkills = data.aiAnalysis.assessedSkills || [];
        let totalScore = 0;
        const totalSkills = assessedSkills.length + missingSkillsProgress.length;

        [...assessedSkills, ...missingSkillsProgress].forEach(skill => {
            if (skill.currentLevel >= skill.targetLevel) {
                totalScore += 100;
            } else {
                totalScore += (skill.currentLevel / skill.targetLevel) * 100;
            }
        });

        const trueOverallMatch = totalSkills === 0 ? 0 : Math.round(totalScore / totalSkills);

        set({ progressData: { overallProgress, missingSkillsProgress, trueOverallMatch } });
    }
}));

export default useRoadmapStore;