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

    // 2. Deep-evaluate the top candidate pool (up to 20 jobs) with Gemini AI in parallel
    const MAX_AI_JOBS = 20;
    const priorityJobsNeedingAi = jobsNeedingAi.slice(0, MAX_AI_JOBS);

    if (priorityJobsNeedingAi.length > 0 && this.apiKeys.length > 0) {
      const BATCH_SIZE = 10;
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

    const modelName = (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite").replace(/3\.5l-/i, "3.5-").trim();

    const jobsPayload = batch.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      track: j.stream?.track || j.track?.id || "tech",
      stream: j.stream?.label || "General",
      location: j.location,
      employmentType: j.employmentType,
      experienceLevel: j.experienceLevel,
      requiredSkills: j.requiredSkills || [],
      descriptionSnippet: (j.descriptionSummary || j.description || "").slice(0, 300),
    }));

    const prompt = `
You are an Executive Recruiter and Precision Career AI.
Your job is to strictly evaluate whether each job opening is RELEVANT to the candidate's verified resume.

CANDIDATE VERIFIED PROFILE:
- Domain Track: ${context.candidateTrackLabel} (${context.candidateTrackId})
- Specialization Stream: ${context.candidateStreamLabel}
- Experience: ${context.experienceYears} Years (${context.isFresher ? "Fresher / Entry-Level" : "Experienced"})
- Top Skills: ${context.candidateSkills.join(", ")}
- Resume Excerpt:
${(context.resumeText || "").slice(0, 2500)}

EVALUATION CRITERIA (STRICT RELEVANCE):
1. DOMAIN ALIGNMENT:
   - If Candidate is TECH: Only technical roles (Software Engineer, Full Stack, Frontend, Backend, AI/ML, DevOps, Systems) are relevant. Disqualify sales, customer service, or pure administrative roles (isRelevant = false).
   - If Candidate is MANAGEMENT: Only management & leadership roles (Product Manager, Technical Program Manager, Scrum Master, Business Analyst, Delivery Lead) are relevant. Disqualify pure junior coding roles or irrelevant fields (isRelevant = false).
2. SENIORITY ALIGNMENT:
   - If Candidate is a Fresher (0-1 YOE): Only fresher-friendly, internship, junior, or entry-level roles can score > 70. Do not mark 5+ YOE Senior/Staff roles as relevant.
   - If Candidate is Experienced: Target roles matching or expanding their YOE.
3. SKILL OVERLAP & GROWTH:
   - Calculate precision aiScore (0 - 100).
   - Assign verdict:
     * "STRONG_MATCH" (80 - 100): Direct domain + high skill alignment.
     * "GOOD_FIT" (65 - 79): Same domain, adjacent specialization or slight skill gaps.
     * "POTENTIAL_GROWTH" (50 - 64): Relevant domain but stretch role or new sub-field.
     * "MISMATCH" (< 50): Different domain, wrong seniority, or completely mismatched skillset.

JOB OPENINGS TO EVALUATE:
${JSON.stringify(jobsPayload, null, 2)}

Return strictly a valid JSON array of objects with NO markdown code fences and NO surrounding commentary.
Format:
[
  {
    "id": "string (job id matching input)",
    "isRelevant": boolean,
    "aiScore": number (0-100),
    "verdict": "STRONG_MATCH" | "GOOD_FIT" | "POTENTIAL_GROWTH" | "MISMATCH",
    "fitReason": "2 sentences explaining why this job matches the candidate's resume or where it diverges",
    "skillGaps": ["list", "of", "missing", "skills"],
    "interviewTip": "1 strategic tip for tailoring the candidate's resume or interview pitch for this role"
  }
]
`;

    const activeModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite").replace(/3\.5l-/i, "3.5-").trim();
    const modelCandidates = [activeModel];

    for (const modelName of modelCandidates) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`AI timeout (4s) on ${modelName}`)), 4000)
        );

        const generatePromise = client.models.generateContent({
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
        console.warn(`[AiJobMatcher] Model ${modelName} notice: ${err.message}. Trying next candidate model...`);
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
