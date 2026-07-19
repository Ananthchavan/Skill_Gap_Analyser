import { create } from 'zustand';

const useRoadmapStore = create((set, get) => ({
    analysisId: null,
    data: null,
    completedTaskIds: [],
    isLoading: true,
    error: null,

    //derived data
    progressData: {
        overallProgress: 0,
        missingSkillsProgress: [],
        dynamicAssessedSkills: [],
        trueOverallMatch: 0
    },

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

            //ensure we load any previously saved completed tasks from MongoDB
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

        //optimistic UI: instantly update state and recalculate math
        set({ completedTaskIds: newCompletedTaskIds });
        get().calculateProgress();

        //silent background sync: fire and forget
        try {
            await fetch(`http://localhost:8080/api/analysis/${state.analysisId}/progress`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedTaskIds: newCompletedTaskIds }),
                credentials: 'include'
            });
        } catch (error) {
            console.error("Silent background sync failed:", error);
        }
    },

    //math Engine
    calculateProgress: () => {
        const { data, completedTaskIds } = get();
        if (!data || !data.aiRoadmap || !data.aiAnalysis) return;

        let totalTasks = 0;
        const skillTaskCounts = {};

        //map all tasks to count totals and completions
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

        //calculate Overall Roadmap Progress
        const overallProgress = totalTasks === 0 ? 0 : (completedTaskIds.length / totalTasks) * 100;

        //calculate dynamic MISSING skills progress for the Bottom Banner
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

        //calculate dynamic ASSESSED skills progress for all the top charts
        const dynamicAssessedSkills = (data.aiAnalysis.assessedSkills || []).map(skill => {
            const stats = skillTaskCounts[skill.skillName];

            //if no tasks exist for this skill OR it's a refresher task (no gap), lock it.
            if (!stats || stats.total === 0 || skill.currentLevel >= skill.targetLevel) {
                return { ...skill, currentLevel: skill.currentLevel };
            }

            const gap = skill.targetLevel - skill.currentLevel;
            const completionRatio = stats.completed / stats.total;
            const newCurrentLevel = skill.currentLevel + (gap * completionRatio);

            return {
                ...skill,
                currentLevel: Math.round(newCurrentLevel)
            };
        });

        //re-calculate true overall match for the donut chart
        let totalScore = 0;

        //combine assessed skills and missing skills for the final math
        const allSkillsToScore = [...dynamicAssessedSkills, ...missingSkillsProgress];
        const totalSkillsToScore = allSkillsToScore.length;

        allSkillsToScore.forEach(skill => {
            //ensure targetLevel exists and isn't 0
            const target = skill.targetLevel || 100;

            if (skill.currentLevel >= target) {
                totalScore += 100; // Cap at 100% contribution if they meet or exceed target
            } else {
                totalScore += (skill.currentLevel / target) * 100;
            }
        });

        //calculate the exact match percentage based on the current state of ALL skills
        const trueOverallMatch = totalSkillsToScore === 0 ? 0 : Math.round(totalScore / totalSkillsToScore);

        //update the store
        set({
            progressData: {
                overallProgress,
                missingSkillsProgress,
                dynamicAssessedSkills,
                trueOverallMatch
            }
        });
    }
}));

export default useRoadmapStore;