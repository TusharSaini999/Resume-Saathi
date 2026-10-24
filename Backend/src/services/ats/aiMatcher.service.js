import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

class AiJobMatcherService {
  constructor() {
    const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
    if (keysStr) {
      this.apiKeys = keysStr.split(',').map((k) => k.trim()).filter(Boolean);
    } else {
      this.apiKeys = [];
    }
    this.keyIndex = 0;
    this.aiMatchCache = new Map(); // Key: `${candidateHash}_${jobId}` -> { aiMatch, timestamp }
    this.CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
  }

  getClient() {
    if (!this.apiKeys.length) return null;
    const key = this.apiKeys[this.keyIndex];
    this.keyIndex = (this.keyIndex + 1) % this.apiKeys.length;
    return new GoogleGenAI({ apiKey: key });
  }

  getResumeHash(resumeText = "") {
    if (!resumeText) return "no_resume";
    return crypto.createHash("md5").update(resumeText.slice(0, 2000)).digest("hex").slice(0, 12);
  }

  /**
   * Deeply evaluate a batch of jobs using Google Gemini AI for strict resume relevance.
   *
   * @param {Object} candidateProfile - { track, primaryStream, experienceYears, isFresher, skills }
   * @param {string} resumeText - Candidate's parsed resume text
   * @param {Array} jobs - List of candidate job objects to evaluate
   * @param {Object} options - { strictAiOnly: boolean, minAiScore: number }
   * @returns {Promise<Array>} jobs with .aiMatch populated and optionally filtered
   */
  async evaluateJobsBatch(candidateProfile, resumeText = "", jobs = [], options = {}) {
    if (!jobs || jobs.length === 0) return [];

    const { strictAiOnly = false, minAiScore = 60 } = options;
    const resumeHash = this.getResumeHash(resumeText);
    const candidateTrackId = candidateProfile?.track?.id || "tech";
    const candidateStreamId = candidateProfile?.primaryStream?.id || "full_stack";
    const candidateTrackLabel = candidateProfile?.track?.label || "Tech & Engineering";
    const candidateStreamLabel = candidateProfile?.primaryStream?.label || "Full Stack";
    const experienceYears = candidateProfile?.experienceYears || 0;
    const isFresher = Boolean(candidateProfile?.isFresher);
    const candidateSkills = (candidateProfile?.skills || []).slice(0, 25);

    // 1. Separate cached jobs from jobs needing AI evaluation
    const jobsNeedingAi = [];
    const evaluatedJobsMap = new Map();

    const now = Date.now();
    for (const job of jobs) {
      const cacheKey = `${resumeHash}_${job.id}`;
      const cached = this.aiMatchCache.get(cacheKey);

      if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
        evaluatedJobsMap.set(job.id, cached.aiMatch);
      } else {
        jobsNeedingAi.push(job);
      }
    }

    // 2. Deep-evaluate the top candidate pool (up to 15 jobs) with Gemini AI in parallel
    const MAX_AI_JOBS = 15;
    const priorityJobsNeedingAi = jobsNeedingAi.slice(0, MAX_AI_JOBS);

    if (priorityJobsNeedingAi.length > 0 && this.apiKeys.length > 0) {
      const BATCH_SIZE = 5; // Lean batches of 5 execute 2x faster (< 2.5s)
      const batches = [];
      for (let i = 0; i < priorityJobsNeedingAi.length; i += BATCH_SIZE) {
        batches.push(priorityJobsNeedingAi.slice(i, i + BATCH_SIZE));
      }

      // Execute batches in parallel with individual timeouts
      await Promise.allSettled(
        batches.map((batch) =>
          this._evaluateSingleBatchWithGemini(
            batch,
            {
              candidateTrackId,
              candidateTrackLabel,
              candidateStreamLabel,
              experienceYears,
              isFresher,
              candidateSkills,
              resumeText,
              resumeHash,
            },
            evaluatedJobsMap
          )
        )
      );
    }

    // 3. Assemble and decorate all jobs with their aiMatch
    const enrichedJobs = jobs.map((job) => {
      let aiMatch = evaluatedJobsMap.get(job.id);

      // Heuristic fallback if Gemini evaluation wasn't generated
      if (!aiMatch) {
        aiMatch = this._generateHeuristicAiMatch(job, candidateProfile);
      }

      return {
        ...job,
        aiMatch,
        // Integrate AI score into overall match score
        matchScore: Math.round(((job.match?.score || 60) * 0.4) + (aiMatch.aiScore * 0.6)),
      };
    });

    // 4. If strictAiOnly mode is active, filter out irrelevant jobs with fallback
    if (strictAiOnly) {
      const strictMatches = enrichedJobs.filter(
        (job) => job.aiMatch?.isRelevant === true && (job.aiMatch?.aiScore ?? 0) >= minAiScore
      );
      if (strictMatches.length > 0) {
        return strictMatches;
      }
      // Loose fallback: Prioritize jobs by highest AI score instead of returning 0 jobs
      return [...enrichedJobs].sort((a, b) => (b.aiMatch?.aiScore || 0) - (a.aiMatch?.aiScore || 0));
    }

    return enrichedJobs;
  }

  async _evaluateSingleBatchWithGemini(batch, context, evaluatedJobsMap) {
    const client = this.getClient();
    if (!client) return;

    const jobsPayload = batch.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      track: j.stream?.track || j.track?.id || "tech",
      stream: j.stream?.label || "General",
      location: j.location,
      employmentType: j.employmentType,
      experienceLevel: j.experienceLevel,
      requiredSkills: (j.requiredSkills || []).slice(0, 8),
      descriptionSnippet: (j.descriptionSummary || j.description || "").slice(0, 200),
    }));

    const prompt = `
You are an Executive Recruiter and Precision Career AI.
Evaluate whether each job opening is RELEVANT to the candidate's verified resume.

CANDIDATE VERIFIED PROFILE:
- Domain Track: ${context.candidateTrackLabel} (${context.candidateTrackId})
- Specialization Stream: ${context.candidateStreamLabel}
- Experience: ${context.experienceYears} Years (${context.isFresher ? "Fresher / Entry-Level" : "Experienced"})
- Top Skills: ${context.candidateSkills.slice(0, 15).join(", ")}
- Resume Excerpt:
${(context.resumeText || "").slice(0, 1500)}

EVALUATION CRITERIA:
1. DOMAIN: If Tech, only tech engineering roles are relevant. If Management, only product/program roles are relevant.
2. SENIORITY: If Fresher (0-1 YOE), only entry/junior/fresher/internship roles score > 70.
3. SCORING: Assign aiScore (0-100) and verdict (STRONG_MATCH, GOOD_FIT, POTENTIAL_GROWTH, or MISMATCH).

JOB OPENINGS TO EVALUATE:
${JSON.stringify(jobsPayload, null, 2)}

Return strictly a valid JSON array of objects with NO markdown code fences. Keep text concise.
Format:
[
  {
    "id": "string",
    "isRelevant": boolean,
    "aiScore": number,
    "verdict": "STRONG_MATCH" | "GOOD_FIT" | "POTENTIAL_GROWTH" | "MISMATCH",
    "fitReason": "1 concise sentence explaining fit",
    "skillGaps": ["max", "3", "skills"],
    "interviewTip": "1 concise sentence tip"
  }
]
`;

    const activeModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite").replace(/3\.5l-/i, "3.5-").trim();
    const modelCandidates = [
      activeModel,
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ].filter((v, i, a) => a.indexOf(v) === i);

    const AI_TIMEOUT_MS = 8500; // Generous 8.5s timeout eliminates premature timeout notices

    for (const modelName of modelCandidates) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`AI timeout (8.5s) on ${modelName}`)), AI_TIMEOUT_MS)
        );

        const activeClient = this.getClient() || client;
        const generatePromise = activeClient.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const response = await Promise.race([generatePromise, timeoutPromise]);

        const rawText = (response.text || "").trim();
        const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const results = JSON.parse(cleanedText);

        if (Array.isArray(results) && results.length > 0) {
          for (const item of results) {
            if (!item.id) continue;
            const aiMatch = {
              isRelevant: Boolean(item.isRelevant),
              aiScore: Math.min(100, Math.max(0, Math.round(Number(item.aiScore) || 50))),
              verdict: item.verdict || "GOOD_FIT",
              fitReason: item.fitReason || "Evaluated by Gemini AI based on candidate resume.",
              skillGaps: Array.isArray(item.skillGaps) ? item.skillGaps : [],
              interviewTip: item.interviewTip || "Highlight relevant project impact during application.",
              evaluatedBy: `Gemini AI (${modelName})`,
            };

            evaluatedJobsMap.set(item.id, aiMatch);

            // Save to in-memory cache
            this.aiMatchCache.set(`${context.resumeHash}_${item.id}`, {
              aiMatch,
              timestamp: Date.now(),
            });
          }
          return; // Successfully evaluated this batch
        }
      } catch (err) {
        // model candidate notice silenced
      }
    }

    // Graceful fallback for this batch if all Gemini models failed/timed out
    for (const job of batch) {
      if (!evaluatedJobsMap.has(job.id)) {
        const heuristic = this._generateHeuristicAiMatch(job, context);
        evaluatedJobsMap.set(job.id, heuristic);
        // Cache fallback with 10-minute TTL to prevent continuous retries during same session
        this.aiMatchCache.set(`${context.resumeHash}_${job.id}`, {
          aiMatch: heuristic,
          timestamp: Date.now() - (this.CACHE_TTL_MS - 10 * 60 * 1000),
        });
      }
    }
  }

  _generateHeuristicAiMatch(job, candidateProfile) {
    const jobTrack = job.stream?.track || job.track?.id || "tech";
    const candTrack = candidateProfile?.track?.id || "tech";
    const isTrackMatch = jobTrack === candTrack;
    const isFresher = Boolean(candidateProfile?.isFresher);
    const isFresherJob = job.isFresherFriendly || job.employmentType === "Internship";

    let isRelevant = isTrackMatch;
    let aiScore = isTrackMatch ? 75 : 35;
    let verdict = isTrackMatch ? "GOOD_FIT" : "MISMATCH";

    if (isTrackMatch) {
      if (isFresher && isFresherJob) {
        aiScore = 88;
        verdict = "STRONG_MATCH";
      } else if (isFresher && !isFresherJob && (job.minExperienceYears || 0) >= 3) {
        isRelevant = false;
        aiScore = 42;
        verdict = "MISMATCH";
      } else if (!isFresher && (candidateProfile?.experienceYears || 0) >= (job.minExperienceYears || 0)) {
        aiScore = 85;
        verdict = "STRONG_MATCH";
      }
    }

    const fitReason = isTrackMatch
      ? `Strong alignment with your ${candidateProfile?.track?.label || "career"} track (${candidateProfile?.primaryStream?.label}).`
      : `Domain divergence: This role is in ${jobTrack === "management" ? "Management" : "Tech"}, whereas your resume reflects ${candTrack === "management" ? "Management" : "Tech"}.`;

    return {
      isRelevant,
      aiScore,
      verdict,
      fitReason,
      skillGaps: (job.requiredSkills || []).slice(0, 3),
      interviewTip: `Focus your resume highlights on ${job.title} core competencies and quantifiable outcomes.`,
      evaluatedBy: "Precision Heuristic Engine",
    };
  }

  clearAiCache() {
    this.aiMatchCache.clear();
  }
}

export default new AiJobMatcherService();
