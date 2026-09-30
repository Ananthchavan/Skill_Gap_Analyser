import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { aiAnalysisSchema } from '../schemas/aiSchema.js';
import { groq } from '@ai-sdk/groq';

function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch (firstErr) {
        try {
            const stack = [];
            const pairs = { '{': '}', '[': ']' };
            const closes = new Set(['}', ']']);
            let inString = false;
            let escape = false;
            for (const ch of text) {
                if (escape) { escape = false; continue; }
                if (ch === '\\' && inString) { escape = true; continue; }
                if (ch === '"') { inString = !inString; continue; }
                if (inString) continue;
                if (pairs[ch]) stack.push(pairs[ch]);
                else if (closes.has(ch)) stack.pop();
            }
            // Remove trailing commas then close all open structures
            let repaired = text.trimEnd().replace(/,\s*$/, '');
            while (stack.length) repaired += stack.pop();
            return JSON.parse(repaired);
        } catch (secondErr) {
            // Re-throw the original, more descriptive error
            throw firstErr;
        }
    }
}

export async function generateAnalysis(analysisData) {
    try {
        const { output: aiAnalysisResult } = await generateText({
            model: google('gemini-2.5-flash'),
            output: Output.object({
                schema: aiAnalysisSchema
            }),

            system: `You are a brutally honest Senior Engineering Manager conducting a technical skill-gap analysis. 
            Your goal is to evaluate the user's current skills against their target role. 
            Do not be overly polite or give artificial high scores. If they lack critical skills, state it clearly.
            Analyze the provided GitHub repository data, resume text, and job description to determine their true proficiency levels.

            CRITICAL RULE ON SELF-ATTESTED SKILLS: The user will provide a list of 'Self-Attested Skills'. If a skill required by the Job Description conceptually matches or overlaps with ANY of these self-attested skills (e.g., 'Agile Development' overlaps with 'Agile / Scrum Methodologies'), you MUST consider the user proficient. You are STRICTLY FORBIDDEN from putting conceptually matching skills into the 'criticalMissingSkills' array.
            
            CRITICAL DATA INSTRUCTION: When analyzing the GitHub repository data, you are strictly forbidden from only looking at the top-level 'language' key (e.g., JavaScript, HTML, or TypeScript). You MUST deeply inspect the 'detectedFrameworks' array and the 'frameworkSignals' string for every repository. Modern frameworks (React, Express, Next.js, Angular, Vue) and libraries (Tailwind, Redux, Mongoose) will ONLY appear in these fields. If a framework or tool is listed in their framework signals or detected frameworks, you MUST credit them with full proficiency in that skill.

            IMPORTANT: For the 'criticalMissingSkills' array, you must determine the required 'targetLevel' (0-100) based on the job description. Because these skills are missing, you MUST hardcode the user's 'currentLevel' to 0 for every item in this array.`,
            prompt: `
                Target Role: ${analysisData.targetRole}
                Expected Experience Level: ${analysisData.experienceLevel}
                
                [Target Job Description]
                ${analysisData.jobDescription}
                
                [User's Resume Text]
                ${analysisData.resumeText}

                [User's Self-Attested Skills]
                ${analysisData.selfAttestedSkills && analysisData.selfAttestedSkills.length > 0 ? analysisData.selfAttestedSkills.join(', ') : 'None'}
                
                [User's Analyzed GitHub Portfolio Data]
                ${JSON.stringify(analysisData.githubData, null, 2)}
            `,
        });

        return aiAnalysisResult;
    } catch (error) {
        console.error('Error generating AI Executive Analysis:', error);
        throw new Error('AI Generation for Dashboard Metrics Failed.');
    }
}

export async function generateTechnicalRoadmap(analysisData) {
    try {
        const totalWeeklyHours = analysisData.studyHours * 7;
        const totalWeeks = analysisData.weeksDuration;

        // Shared system prompt — identical for every chunk call
        const systemPrompt = `You are an expert Technical Curriculum Engineer.
Generate a day-by-day learning schedule for ONLY the specific weeks you are asked for.

RULES:
1. Output ONLY the weeks requested — no more, no less.
2. Weekly budget: ${totalWeeklyHours} hrs/week (~${analysisData.studyHours} hrs/day).
   - Under 14 hrs/week → short, focused tasks only.
   - 28+ hrs/week → include architecture, testing, deployment tasks.
3. 80% of tasks address MISSING skills. 20% are interview prep / refreshers.
4. Every task MUST have "associatedSkill" matching a skill name from the profile exactly.
5. BREVITY (critical — keeps JSON small):
   - taskDescription: ≤ 12 words
   - weekFocus: ≤ 8 words
   - topics: exactly 2 strings
   - days per week: exactly 7
   - tasks per day: exactly 2

OUTPUT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation text.
Schema:
{
  "weeks": [
    {
      "weekNumber": 1,
      "weekFocus": "short focus",
      "days": [
        {
          "dayNumber": 1,
          "topics": ["Topic A", "Topic B"],
          "tasks": [
            { "taskDescription": "concise task", "estimatedHours": 2, "associatedSkill": "Skill Name" }
          ]
        }
      ]
    }
  ]
}`;

        // Shared context injected into every chunk prompt
        const contextBlock = `Target Role: ${analysisData.targetRole}
Level: ${analysisData.experienceLevel}
Weekly Budget: ${totalWeeklyHours} hrs/week | Total Plan: ${totalWeeks} weeks

[Skill Gap Profile]
${JSON.stringify(analysisData.aiAnalysis, null, 2)}

[Job Description]
${analysisData.jobDescription}`;

        // Generate 2 weeks per API call, stitch them together
        const CHUNK_SIZE = 2;
        const allWeeks = [];

        for (let startWeek = 1; startWeek <= totalWeeks; startWeek += CHUNK_SIZE) {
            const endWeek = Math.min(startWeek + CHUNK_SIZE - 1, totalWeeks);
            const numWeeks = endWeek - startWeek + 1;
            const chunkLabel = numWeeks === 1 ? `week ${startWeek}` : `weeks ${startWeek}–${endWeek}`;

            console.log(`[Roadmap] Generating ${chunkLabel} of ${totalWeeks}...`);

            const { text: chunkText } = await generateText({
                model: google('gemini-2.5-flash'),
                maxTokens: 8192,
                system: systemPrompt,
                prompt: `${contextBlock}

TASK: Generate ONLY ${chunkLabel} (weekNumber ${startWeek}${numWeeks > 1 ? ` through ${endWeek}` : ''}).
${startWeek > 1 ? `Continue progressively from week ${startWeek - 1}. Do not repeat earlier topics.` : 'Start from the most critical missing skills.'}
Return a JSON object with a "weeks" array containing exactly ${numWeeks} week object(s).`,
            });

            // Strip any accidental markdown fences
            const stripped = chunkText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const firstBrace = stripped.indexOf('{');
            const lastBrace = stripped.lastIndexOf('}');

            if (firstBrace === -1 || lastBrace === -1) {
                console.error(`[Roadmap] No JSON found in chunk ${chunkLabel}:`, chunkText);
                throw new Error(`No valid JSON in roadmap chunk ${chunkLabel}.`);
            }

            const parsed = safeJsonParse(stripped.slice(firstBrace, lastBrace + 1));
            const weeks = parsed?.weeks;

            if (!Array.isArray(weeks) || weeks.length === 0) {
                throw new Error(`Chunk ${chunkLabel} returned no week data.`);
            }

            // Correct weekNumbers in case model drifted
            weeks.forEach((w, i) => { w.weekNumber = startWeek + i; });
            allWeeks.push(...weeks);

            console.log(`[Roadmap] ✓ ${chunkLabel} complete (${weeks.length} week(s))`);
        }

        console.log(`[Roadmap] ✅ Done — ${allWeeks.length}/${totalWeeks} weeks generated.`);
        return { weeks: allWeeks };

    } catch (error) {
        console.error('Error generating AI Roadmap:', error);
        throw new Error('AI Generation for Roadmap Planner Failed.');
    }
}



export async function extractNonCodeableSkills(jobDescription) {
    try {
        const { text } = await generateText({
            model: groq('qwen/qwen3.8-27b'),
            system: `You are an expert technical recruiter.
            Your task is to analyze a Job Description and extract high-value non-code skills that cannot be auto-detected from repository code files.

            STRICT EXTRACTION RULES:
            1. ONLY extract:
               - Workflow & Methodologies (e.g., Agile/Scrum, CI/CD, TDD, Microservices)
               - Cloud & Infra Concepts (e.g., AWS Architecture, Containerization)
               - Management & Collaboration Tools (e.g., JIRA, Confluence)
               - Soft Skills & Engineering Practices (e.g., Code Reviews, Technical Writing)
            2. STRICTLY FORBIDDEN: Do NOT extract programming languages, frameworks, or databases (e.g., React, Node.js, Python, PostgreSQL).
            3. Return 5 to 10 concise, highly relevant skill names.

            OUTPUT FORMAT:
            You MUST output ONLY a valid JSON object. No conversational text. No markdown formatting. No backticks. 
            The JSON must have a single key "skills" containing an array of strings.
            Example:
            {
              "skills": ["Agile Methodology", "CI/CD Pipeline", "System Design"]
            }`,
            prompt: `Job Description:\n${jobDescription}`
        });

        const cleanJsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText);

        return parsedData.skills || [];

    } catch (error) {
        console.error('Error extracting skills with Groq:', error);
        throw new Error('Failed to scan Job Description for non-code skills.');
    }
}

export async function generateMilestoneQuiz(targetRole, curriculumData, isFinal = false) {
    try {
        const promptText = isFinal
            ? `Generate a comprehensive final mock technical assessment (15 questions) for a ${targetRole} covering this entire roadmap:\n${JSON.stringify(curriculumData)}`
            : `Generate a milestone technical quiz (5-8 questions) for a ${targetRole} based SPECIFICALLY on the topics and tasks covered in this week:\n${JSON.stringify(curriculumData)}`;

        const { text } = await generateText({
            model: groq('qwen/qwen3.8-27b'),
            system: `You are an expert Senior Technical Interviewer and Engineering Manager. 
            Your task is to generate a strict, multiple-choice quiz based on the curriculum provided.
            
            OUTPUT FORMAT:
            You MUST return ONLY a valid JSON object. No conversational text, no markdown blocks, no backticks.
            The JSON must perfectly match this exact structure:
            {
                "questions": [
                    {
                        "questionText": "What is the primary purpose of...",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctAnswer": "Option B",
                        "explanation": "Option B is correct because..."
                    }
                ]
            }
            
            RULES:
            1. Provide exactly 4 options per question.
            2. The 'correctAnswer' MUST be an exact string match to one of the 4 items in the 'options' array.
            3. Provide a clear, educational explanation for WHY the answer is correct and why the others are wrong.
            4. Ensure questions actually test the specific coding skills and concepts taught in the provided curriculum data.`,
            prompt: promptText
        });

        //strip markdown formatting to guarantee safe JSON parsing
        const cleanJsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedQuiz = JSON.parse(cleanJsonText);

        return parsedQuiz.questions || [];

    } catch (error) {
        console.error('Error generating quiz with Groq:', error);
        throw new Error('Failed to generate milestone quiz.');
    }
}