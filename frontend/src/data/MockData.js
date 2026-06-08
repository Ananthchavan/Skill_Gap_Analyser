// frontend/src/lib/mockData.js

export const mockAnalyses = [
    {
        id: "analysis-1",
        status: "ACTIVE",
        targetRole: "Senior Frontend Engineer",
        matchPercentage: 88,
        dateGenerated: "May 15, 2026",

        radarData: [
            { skill: "React", value: 90 },
            { skill: "TypeScript", value: 80 },
            { skill: "CSS", value: 85 },
            { skill: "Testing", value: 60 },
            { skill: "Node.js", value: 70 },
            { skill: "GraphQL", value: 40 }
        ],

        skillsBreakdown: [
            { name: "React", proficiency: 90, gap: 10 },
            { name: "TypeScript", proficiency: 80, gap: 20 },
            { name: "CSS", proficiency: 85, gap: 15 },
            { name: "Testing", proficiency: 60, gap: 40 },
            { name: "Node.js", proficiency: 70, gap: 30 },
            { name: "GraphQL", proficiency: 40, gap: 60 }
        ],

        missingSkills: [
            { name: "GraphQL", level: "Critical", gapPercentage: 60 },
            { name: "Testing", level: "High", gapPercentage: 40 },
            { name: "Node.js", level: "Medium", gapPercentage: 30 }
        ],

        roadmapSummary: {
            title: "30-Day Frontend Masterplan",
            percentComplete: 60,
            currentDay: 18
        },

        quizScores: [
            { day: 5, topic: "React Hooks", skillImproved: "React", score: 95 },
            { day: 12, topic: "Async JavaScript", skillImproved: "Node.js", score: 88 },
            { day: 18, topic: "Docker Basics", skillImproved: "Docker", score: 80 }
        ],

        plannerSteps: [
            { day: 1, topic: "Vite Configuration & Asset Optimization", completed: true, resource: "React Docs" },
            { day: 2, topic: "Advanced Tailwind Architecture", completed: true, resource: "Tailwind UI" },
            { day: 3, topic: "Component Composition Patterns", completed: true, resource: "Frontend Masters" },
            { day: 18, topic: "Docker Basics & Containerization", completed: false, resource: "Docker Docs" },
            { day: 19, topic: "GraphQL Queries & Mutations", completed: false, resource: "Apollo GraphQL" },
            { day: 20, topic: "Jest & React Testing Library", completed: false, resource: "Kent C. Dodds" }
        ]
    },
    {
        id: "analysis-2",
        status: "OUTDATED",
        targetRole: "UI/UX Developer",
        matchPercentage: 92,
        dateGenerated: "March 01, 2026",

        radarData: [
            { skill: "Figma", value: 95 },
            { skill: "CSS", value: 90 },
            { skill: "Framer Motion", value: 85 },
            { skill: "React", value: 70 }
        ],

        skillsBreakdown: [
            { name: "Figma", proficiency: 95, gap: 5 },
            { name: "CSS", proficiency: 90, gap: 10 },
            { name: "Framer Motion", proficiency: 85, gap: 15 },
            { name: "React", proficiency: 70, gap: 30 }
        ],

        missingSkills: [
            { name: "React", level: "Medium", gapPercentage: 30 }
        ],

        roadmapSummary: {
            title: "Motion & Interaction Deep Dive",
            percentComplete: 100,
            currentDay: 30
        },

        quizScores: [
            { day: 10, topic: "CSS Grid Auto-Fit", skillImproved: "CSS", score: 100 },
            { day: 25, topic: "Framer Variants", skillImproved: "Framer Motion", score: 92 }
        ],

        plannerSteps: [
            { day: 1, topic: "Figma Variables setup", completed: true, resource: "Figma Learn" },
            { day: 2, topic: "CSS Custom Properties mapping", completed: true, resource: "MDN" }
        ]
    }
];