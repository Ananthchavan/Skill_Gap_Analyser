import { create } from 'zustand';

const useRoadmapStore = create((set, get) => ({
    analysisId: null,
    data: null,
    completedTaskIds: [],
    savedResources: {},
    quizScores: [],
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
            const fetchedSavedResources = result.savedResources || {};
            const fetchedQuizScores = result.quizScores || [];

            set({
                analysisId: id,
                data: result,
                completedTaskIds: fetchedCompletedTasks,
                savedResources: fetchedSavedResources,
                quizScores: fetchedQuizScores,
                isLoading: false,
            });

            get().calculateProgress();
        } catch (error) {
            console.error("Fetch error:", error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Task Toggle
    toggleTask: async (taskId) => {
        const state = get();
        const newCompletedTaskIds = state.completedTaskIds.includes(taskId)
            ? state.completedTaskIds.filter(id => id !== taskId)
            : [...state.completedTaskIds, taskId];

        set({ completedTaskIds: newCompletedTaskIds });
        get().calculateProgress();

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

    // Add Smart Space Resource
    addResource: async (dayId, resourceData) => {
        const state = get();
        const currentList = state.savedResources[dayId] || [];

        const newResource = {
            id: Date.now().toString(),
            type: resourceData.type,
            value: resourceData.value,
            createdAt: new Date().toISOString()
        };

        const updatedList = [...currentList, newResource];
        const updatedResources = {
            ...state.savedResources,
            [dayId]: updatedList
        };

        set({ savedResources: updatedResources });

        try {
            await fetch(`http://localhost:8080/api/analysis/${state.analysisId}/resources`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, resources: updatedList }),
                credentials: 'include'
            });
        } catch (error) {
            console.error("Failed to sync new resource:", error);
        }
    },

    // Remove Smart Space Resource
    removeResource: async (dayId, resourceId) => {
        const state = get();
        const currentList = state.savedResources[dayId] || [];
        const updatedList = currentList.filter(item => item.id !== resourceId);

        const updatedResources = {
            ...state.savedResources,
            [dayId]: updatedList
        };

        set({ savedResources: updatedResources });

        try {
            await fetch(`http://localhost:8080/api/analysis/${state.analysisId}/resources`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, resources: updatedList }),
                credentials: 'include'
            });
        } catch (error) {
            console.error("Failed to sync removed resource:", error);
        }
    },

    //Save Quiz Score
    saveQuizScore: async (weekNumber, score) => {
        const state = get();

        const existingIndex = state.quizScores.findIndex(q => q.weekNumber === weekNumber);
        let updatedQuizScores = [...state.quizScores];

        if (existingIndex !== -1) {
            updatedQuizScores[existingIndex].score = score;
        } else {
            updatedQuizScores.push({ weekNumber, score });
        }

        set({ quizScores: updatedQuizScores });

        //silent background sync
        try {
            await fetch(`http://localhost:8080/api/analysis/${state.analysisId}/quiz-score`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weekNumber, score }),
                credentials: 'include'
            });
        } catch (error) {
            console.error("Failed to sync quiz score:", error);
        }
    },

    // Math Engine
    calculateProgress: () => {
        const { data, completedTaskIds } = get();
        if (!data || !data.aiRoadmap || !data.aiAnalysis) return;

        let totalTasks = 0;
        const skillTaskCounts = {};

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

        const dynamicAssessedSkills = (data.aiAnalysis.assessedSkills || []).map(skill => {
            const stats = skillTaskCounts[skill.skillName];

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

        const aiBaseScore = data.aiAnalysis.overallMatch || 0;
        const remainingGap = 100 - aiBaseScore;
        const progressMultiplier = overallProgress / 100;

        const trueOverallMatch = Math.round(aiBaseScore + (remainingGap * progressMultiplier));

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