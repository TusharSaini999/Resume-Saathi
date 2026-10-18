import { GoogleGenAI } from '@google/genai';
import { classifyJobTypeAndExperience } from './jobClassifier.js';
import { isRealOpeningUrl } from './atsDetector.service.js';

class AiCareerSearchService {
  constructor() {
    const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
    if (keysStr) {
      this.apiKeys = keysStr.split(',').map((k) => k.trim()).filter(Boolean);
    } else {
      this.apiKeys = [];
    }
    this.keyIndex = 0;
  }

  getClient() {
    if (!this.apiKeys.length) return null;
    const key = this.apiKeys[this.keyIndex];
    this.keyIndex = (this.keyIndex + 1) % this.apiKeys.length;
    return new GoogleGenAI({ apiKey: key });
  }

  async searchOfficialCareerPortal(companyName, roleQuery = "Software Engineer", location = "India") {
    try {
      const client = this.getClient();
      if (!client) {
        console.warn("[AiSearch] No Gemini API key available for live career search.");
        return [];
      }

      const prompt = `
Find 4 to 8 currently active, REAL job openings directly on the official career portal, Workday/ATS portal, or LinkedIn job post of "${companyName}" in "${location}" for "${roleQuery}".
Search official company websites, e.g., site:careers.google.com, site:amazon.jobs, site:careers.microsoft.com, site:*.myworkdayjobs.com, or official "${companyName}" careers pages.

CRITICAL REQUIREMENT:
Every "applyUrl" MUST be a direct, specific job requisition URL (containing a specific job ID or requisition path like /jobs/12345, /detail/REQ-987, Lever posting, Greenhouse job, or LinkedIn job view).
DO NOT return generic career homepages (e.g., https://careers.company.com/ without job path) or search landing pages. Only real openings are acceptable.

Include both full-time engineering and internships/entry-level/graduate openings if available.
Return the result strictly as a valid JSON array of objects with no markdown fences, no extra commentary.

Each object MUST have:
[
  {
    "title": "Exact Role Title",
    "company": "${companyName}",
    "location": "Job Location (e.g. Bengaluru, India or Remote)",
    "isRemote": false,
    "applyUrl": "Direct specific job requisition URL",
    "description": "Brief 2-3 sentence overview of responsibilities and core tech stack requirements.",
    "skills": ["Skill1", "Skill2", "Skill3"]
  }
]
`;

      const activeModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite").replace(/3\.5l-/i, "3.5-").trim();
      const modelCandidates = [activeModel];

      let response = null;
      for (const model of modelCandidates) {
        try {
          response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
              tools: [{ googleSearch: {} }],
              temperature: 0.1,
            },
          });
          if (response && response.text) break;
        } catch (mErr) {
          console.warn(`[AiSearch] Model ${model} notice: ${mErr.message}`);
        }
      }

      if (!response || !response.text) {
        return [];
      }

      const rawText = response.text || "";
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const startIdx = cleaned.indexOf("[");
      const endIdx = cleaned.lastIndexOf("]");
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = cleaned.slice(startIdx, endIdx + 1);
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item) => isRealOpeningUrl(item.applyUrl))
            .map((item, idx) => {
              const classification = classifyJobTypeAndExperience(item.title, item.description || "");

              // Merge skills
              const combinedSkills = [
                ...new Set([
                  ...(Array.isArray(item.skills) ? item.skills : []),
                  ...(classification.requiredSkills || []),
                ]),
              ];

              return {
                id: `ai_${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${idx}_${Date.now()}`,
                externalId: `ai_${idx}`,
                company: companyName,
                companySlug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                source: "ai_search",
                portalLabel: "Official Career Portal (Live AI)",
                title: item.title || `${roleQuery} at ${companyName}`,
                location: item.location || location,
                isRemote: Boolean(item.isRemote) || (item.location || "").toLowerCase().includes("remote"),
                employmentType: classification.employmentType,
                experienceLevel: classification.experienceLevel,
                minExperienceYears: classification.minExperienceYears,
                maxExperienceYears: classification.maxExperienceYears,
                isFresherFriendly: classification.isFresherFriendly,
                requiredSkills: combinedSkills,
                track: classification.track,
                stream: classification.stream,
                departments: ["Engineering / Tech"],
                applyUrl: item.applyUrl,
                isRealOpening: true,
                description: item.description || `Official career opportunity at ${companyName}.`,
                descriptionSummary: (item.description || "").slice(0, 400),
                postedAt: new Date(),
              };
            });
        }
      }

      return [];
    } catch (error) {
      console.error(`[AiSearch] Error searching jobs for ${companyName}:`, error.message);
      return [];
    }
  }
}

export default new AiCareerSearchService();
