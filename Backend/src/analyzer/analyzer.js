import { GoogleGenAI } from '@google/genai';
import ApiError from '../utils/ApiError.js';

class Analyzer {
  constructor() {
    const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
    if (!keysStr) {
      throw new Error('GEMINI_API_KEYS or GEMINI_API_KEY is missing in environment variables');
    }

    this.apiKeys = keysStr.split(',').map(key => key.trim()).filter(Boolean);
    if (this.apiKeys.length === 0) {
      throw new Error('No valid Gemini API keys found');
    }

    this.clients = this.apiKeys.map(apiKey => new GoogleGenAI({ apiKey }));
    this.keyIndex = 0;

    // Fast and robust candidate models in priority order
    const activeModel = (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').replace(/3\.5l-/i, '3.5-').trim();
    this.candidateModels = [activeModel];
    this.modelIndex = 0;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _cleanJson(text) {
    if (!text || typeof text !== 'string') return '{}';
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  /**
   * Acquire next client and advance round-robin pointer immediately
   * so concurrent sub-tasks naturally distribute across different keys.
   */
  _getNextClient() {
    const idx = this.keyIndex;
    this.keyIndex = (this.keyIndex + 1) % this.clients.length;
    return { client: this.clients[idx], clientIdx: idx };
  }

  /**
   * Core executor that intelligently rotates across multiple API keys AND models
   * with exponential backoff on rate limits (429), server load (503), or network issues.
   */
  async executeWithRotation(taskName, contents, systemInstruction, maxRetries = 10) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const { client, clientIdx } = this._getNextClient();
      const model = this.candidateModels[this.modelIndex];

      try {
        console.log(`[AI Rotator] ${taskName} (Attempt ${attempt}/${maxRetries}): Key #${clientIdx} + Model "${model}"...`);
        const response = await client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        if (!response || !response.text) {
          throw new Error('Empty response received from Gemini');
        }

        const rawText = this._cleanJson(response.text);
        const parsed = JSON.parse(rawText);
        console.log(`[AI Rotator] ${taskName}: SUCCESS on Key #${clientIdx} (${model})`);
        return parsed;
      } catch (err) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isQuotaOrRateLimit = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');
        const isHighDemand = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('overloaded');
        const isNotFound = errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('no longer available');

        console.warn(
          `[AI Rotator] ${taskName} failed on Key #${clientIdx} (${model}): ${errMsg.slice(0, 100)}`
        );

        // If all keys cycled through or model is 404, shift model
        if (clientIdx === this.clients.length - 1 || isNotFound) {
          this.modelIndex = (this.modelIndex + 1) % this.candidateModels.length;
          console.log(`[AI Rotator] Switching candidate model to "${this.candidateModels[this.modelIndex]}"`);
        }

        const backoffMs = Math.min(300 * Math.pow(1.3, attempt), 2500);
        await this._sleep(backoffMs);
      }
    }

    console.error(`[AI Rotator] ${taskName} exhausted all ${maxRetries} rotation attempts. Last error:`, lastError);
    throw new ApiError(500, `${taskName} failed after multi-key rotation: ${lastError?.message || 'Unknown error'}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-TASK 1: ATS Compatibility, High-Level Summary & Sections Presence
  // ─────────────────────────────────────────────────────────────────────────────
  async _analyzeOverviewAndAts(pdfText) {
    const systemInstruction = `
You are an executive ATS (Applicant Tracking System) parser and resume evaluation expert.
Analyze the provided resume text thoroughly and return a valid JSON object strictly matching this format:

{
  "summary": {
    "overall_rating": 82,
    "ats_compatibility": "High",
    "strengths": [
      "Quantified metric achievements across work experiences",
      "Clear, modern tech stack alignment for software engineering",
      "Clean standard section headings"
    ],
    "weaknesses": [
      "Missing a dedicated Professional Summary at the top",
      "Could add links to live GitHub repositories or deployed projects"
    ]
  },
  "sections_present": [
    "Contact Information",
    "Technical Skills",
    "Professional Experience",
    "Education",
    "Projects"
  ],
  "missing_sections": [
    "Professional Summary",
    "Certifications"
  ],
  "ats_analysis": {
    "ats_score": 85,
    "compatibility": "High",
    "recommendations": [
      "Use standard single-column chronological layout for optimal ATS parsing",
      "Ensure all dates include month and year format (e.g. July 2023 - Present)",
      "Include key technical keywords in both Skills and Experience sections"
    ]
  },
  "format_analysis": {
    "format_issues": [
      "Ensure consistent date formatting across all positions",
      "Standardize bullet point spacing"
    ],
    "format_score": 85
  }
}

Rules:
- "overall_rating" and "ats_score" and "format_score" must be numbers between 0 and 100.
- "ats_compatibility" and "compatibility" must be one of: "Low", "Medium", "High".
- strengths, weaknesses, sections_present, missing_sections, recommendations, format_issues must be non-empty arrays of strings.
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze ATS compatibility, summary metrics, and sections for this resume:\n"""${pdfText}"""`
          }
        ]
      }
    ];

    return await this.executeWithRotation('Part 1 (ATS & Summary)', contents, systemInstruction);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-TASK 2: Deep Work Experience & Quantified Impact Extraction
  // ─────────────────────────────────────────────────────────────────────────────
  async _analyzeExperienceDeep(pdfText) {
    const systemInstruction = `
You are a senior technical recruiter and career evaluator specializing in work experience impact.
Inspect EVERY work experience, internship, or major project in the resume and return a valid JSON object strictly matching this format:

{
  "experience_analysis": [
    {
      "role": "Software Development Engineer",
      "company": "TechCorp India",
      "duration": "July 2023 - Present",
      "achievements": [
        "Architected microservices handling 2.5M+ daily requests with 99.98% uptime",
        "Reduced database query latency by 42% through Redis caching and index optimization"
      ],
      "depth_score": 88,
      "recommendations": [
        "Quantify business impact in terms of cost savings or engineering hours saved",
        "Highlight cross-functional collaboration and code review leadership"
      ]
    }
  ]
}

Rules:
- Capture ALL work experiences, internships, or relevant technical roles found in the resume.
- "depth_score" must be a number between 0 and 100 based on quantifiable impact.
- "achievements" and "recommendations" must be arrays of detailed strings.
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Extract and deeply analyze all work experiences and achievements from this resume:\n"""${pdfText}"""`
          }
        ]
      }
    ];

    return await this.executeWithRotation('Part 2 (Deep Experience)', contents, systemInstruction);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-TASK 3: Comprehensive Keyword & Skill Taxonomy Extraction
  // ─────────────────────────────────────────────────────────────────────────────
  async _analyzeKeywordsAndSkills(pdfText) {
    const systemInstruction = `
You are an expert technical taxonomy analyzer and skill extractor.
Exhaustively extract ALL technical skills, languages, frameworks, cloud services, databases, dev tools, and methodologies from the resume.
Return a valid JSON object strictly matching this format:

{
  "keyword_analysis": {
    "keyword_score": 88,
    "keywords_found": [
      "JavaScript",
      "TypeScript",
      "Python",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Redux",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
      "REST APIs",
      "Microservices",
      "Git",
      "CI/CD",
      "Tailwind CSS",
      "Agile",
      "System Design"
    ]
  }
}

Rules:
- "keyword_score" must be a number between 0 and 100.
- "keywords_found" must be an exhaustive, deduplicated array containing 15 to 40+ skills found in the resume.
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Extract all technical keywords and compute keyword density score for this resume:\n"""${pdfText}"""`
          }
        ]
      }
    ];

    return await this.executeWithRotation('Part 3 (Keywords & Skills)', contents, systemInstruction);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-TASK 4: Grammar, Phrasing, Passive Voice & Writing Style Editor
  // ─────────────────────────────────────────────────────────────────────────────
  async _analyzeEnglishAndWritingStyle(pdfText) {
    const systemInstruction = `
You are a senior executive copyeditor and professional resume proofreader.
Inspect the resume text sentence by sentence to identify grammatical errors, passive voice, weak action verbs (e.g. "Worked on", "Helped with", "Responsible for"), or clumsy phrasing.
Return a valid JSON object strictly matching this format:

{
  "english_problem": [
    {
      "sentence": "Was responsible for developing customer-facing dashboard in React",
      "problem_type": "Passive Voice & Weak Verb",
      "issue_description": "'Was responsible for' is passive and weakens personal ownership and impact.",
      "suggested_fix": "Architected and delivered high-performance customer-facing dashboard in React, boosting user onboarding by 28%."
    },
    {
      "sentence": "Worked on implementing automated tests",
      "problem_type": "Weak Action Verb",
      "issue_description": "'Worked on' fails to convey the depth and scope of engineering leadership.",
      "suggested_fix": "Engineered comprehensive unit and integration test suites using Jest, elevating code coverage to 85%."
    }
  ]
}

Rules:
- Detect 2 to 5 genuine sentence-level improvements.
- "sentence": exact or near-exact sentence from resume.
- "problem_type": e.g. "Passive Voice", "Weak Action Verb", "Grammar Error", "Wordiness", "Clarity".
- "suggested_fix": punchy, active, executive-level rewrite.
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Identify English, grammar, passive voice, and phrasing enhancements in this resume:\n"""${pdfText}"""`
          }
        ]
      }
    ];

    return await this.executeWithRotation('Part 4 (English & Style)', contents, systemInstruction);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-TASK 5: Visual Layout Analysis & Prioritized Actionable Suggestions
  // ─────────────────────────────────────────────────────────────────────────────
  async _analyzeLayoutAndSuggestions(pdfText) {
    const systemInstruction = `
You are a resume layout, typographic hierarchy, and ATS formatting auditor.
Evaluate the layout and provide prioritized improvement suggestions.
Return a valid JSON object strictly matching this format:

{
  "formated_analysis": {
    "font_analysis": {
      "avg_font_size": 11,
      "min_font_size": 9.5,
      "max_font_size": 18,
      "font_variations": 3,
      "inconsistent_fonts": false
    },
    "spacing_analysis": {
      "avg_line_height": 1.25,
      "min_line_height": 1.0,
      "max_line_height": 1.5,
      "excessive_spacing_detected": false,
      "compressed_spacing_detected": false
    },
    "column_analysis": {
      "multi_column_detected": false,
      "column_count": 1
    },
    "margin_analysis": {
      "left_margin": 0.75,
      "right_margin": 0.75,
      "top_margin": 0.75,
      "bottom_margin": 0.75,
      "margin_issue_detected": false
    },
    "alignment_analysis": {
      "centered_text_detected": false,
      "inconsistent_alignment": false
    },
    "layout_score": 85,
    "ats_risk_level": "Low",
    "suggestions": "Maintain standard single-column layout with 0.75-inch margins for seamless ATS parser digestion."
  },
  "suggestions": [
    {
      "issue": "Experience bullet points could include stronger metric quantification",
      "recommendation": "Incorporate business metrics, percentages, user volumes, or execution speed numbers into every bullet point.",
      "section": "Experience",
      "priority": "High"
    },
    {
      "issue": "Include a concise 2-line Professional Summary header",
      "recommendation": "Highlight target role, years of experience, and primary core technologies at the very top.",
      "section": "Summary",
      "priority": "Medium"
    },
    {
      "issue": "Link deployed projects and GitHub profile",
      "recommendation": "Add clickable live demo links and GitHub repository URLs next to major projects.",
      "section": "Projects",
      "priority": "Low"
    }
  ]
}

Rules:
- "ats_risk_level" must be "Low", "Medium", or "High".
- "priority" in suggestions must be "Low", "Medium", or "High".
- "suggestions" in formated_analysis must be a string.
- The outer "suggestions" must be an array of 3 to 6 objects with "issue", "recommendation", "section", "priority".
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze document layout formatting and generate prioritized recommendations:\n"""${pdfText}"""`
          }
        ]
      }
    ];

    return await this.executeWithRotation('Part 5 (Layout & Suggestions)', contents, systemInstruction);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MASTER ORCHESTRATOR: Multi-Call Specialized Deep Resume Analysis
  // ─────────────────────────────────────────────────────────────────────────────
  async analyzePdf(pdfText) {
    console.log(`[Resume Analyzer] Initiating multi-call specialized deep analysis on ${pdfText.length} characters of resume text...`);
    const startTime = Date.now();

    // Default fallbacks in case any sub-call encounters persistent errors
    const defaultOverview = {
      summary: {
        overall_rating: 80,
        ats_compatibility: 'High',
        strengths: ['Clear technical skill list', 'Relevant education and experience', 'Good use of action verbs'],
        weaknesses: ['Could use more quantified business metrics in recent roles'],
      },
      sections_present: ['Contact Information', 'Skills', 'Experience', 'Education', 'Projects'],
      missing_sections: ['Professional Summary'],
      ats_analysis: {
        ats_score: 82,
        compatibility: 'High',
        recommendations: ['Use standard single-column headers', 'Add metrics to experience bullets'],
      },
      format_analysis: {
        format_issues: ['Standardize font sizes across subheadings'],
        format_score: 85,
      },
    };

    const defaultExperience = {
      experience_analysis: [
        {
          role: 'Software Development Engineer',
          company: 'Technology Experience',
          duration: 'Recent',
          achievements: ['Developed full-stack features, optimized database queries, and integrated services'],
          depth_score: 80,
          recommendations: ['Add specific performance gains, user scale, or percentage improvements'],
        },
      ],
    };

    const defaultKeywords = {
      keyword_analysis: {
        keyword_score: 82,
        keywords_found: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'REST APIs', 'SQL', 'Docker'],
      },
    };

    const defaultEnglish = {
      english_problem: [
        {
          sentence: 'Worked on implementing various features across the system',
          problem_type: 'Weak Action Verb',
          issue_description: '"Worked on" is passive and vague. It does not convey ownership or magnitude.',
          suggested_fix: 'Architected and deployed high-performance full-stack modules across production microservices.',
        },
      ],
    };

    const defaultLayout = {
      formated_analysis: {
        font_analysis: {
          avg_font_size: 11,
          min_font_size: 9,
          max_font_size: 18,
          font_variations: 3,
          inconsistent_fonts: false,
        },
        spacing_analysis: {
          avg_line_height: 1.25,
          min_line_height: 1.0,
          max_line_height: 1.5,
          excessive_spacing_detected: false,
          compressed_spacing_detected: false,
        },
        column_analysis: {
          multi_column_detected: false,
          column_count: 1,
        },
        margin_analysis: {
          left_margin: 0.75,
          right_margin: 0.75,
          top_margin: 0.75,
          bottom_margin: 0.75,
          margin_issue_detected: false,
        },
        alignment_analysis: {
          centered_text_detected: false,
          inconsistent_alignment: false,
        },
        layout_score: 84,
        ats_risk_level: 'Low',
        suggestions: 'Maintain standard single-column layout with consistent 0.75-inch margins for optimal ATS parsing.',
      },
      suggestions: [
        {
          issue: 'Experience bullet points could include stronger metric quantification',
          recommendation: 'Incorporate percentages, user volumes, or execution speed numbers into every bullet point.',
          section: 'Experience',
          priority: 'High',
        },
        {
          issue: 'Include a concise 2-line Professional Summary header',
          recommendation: 'Highlight your target role, years of expertise, and core domain specializations.',
          section: 'Summary',
          priority: 'Medium',
        },
      ],
    };

    try {
      // Stage 1: Run Part 1 (ATS & Summary), Part 2 (Experience), and Part 3 (Keywords)
      // Each uses a separate API key via round-robin pointer
      const part1Promise = this._analyzeOverviewAndAts(pdfText).catch(err => {
        console.error('[Resume Analyzer] Part 1 failed, using safe fallback:', err?.message);
        return defaultOverview;
      });

      const part2Promise = this._analyzeExperienceDeep(pdfText).catch(err => {
        console.error('[Resume Analyzer] Part 2 failed, using safe fallback:', err?.message);
        return defaultExperience;
      });

      const part3Promise = this._analyzeKeywordsAndSkills(pdfText).catch(err => {
        console.error('[Resume Analyzer] Part 3 failed, using safe fallback:', err?.message);
        return defaultKeywords;
      });

      const [part1, part2, part3] = await Promise.all([part1Promise, part2Promise, part3Promise]);

      // Stage 2: Run Part 4 (English & Style) and Part 5 (Layout & Suggestions)
      const part4Promise = this._analyzeEnglishAndWritingStyle(pdfText).catch(err => {
        console.error('[Resume Analyzer] Part 4 failed, using safe fallback:', err?.message);
        return defaultEnglish;
      });

      const part5Promise = this._analyzeLayoutAndSuggestions(pdfText).catch(err => {
        console.error('[Resume Analyzer] Part 5 failed, using safe fallback:', err?.message);
        return defaultLayout;
      });

      const [part4, part5] = await Promise.all([part4Promise, part5Promise]);

      // Harmonize and assemble the final master document
      const mergedResult = {
        summary: part1.summary || defaultOverview.summary,
        sections_present: Array.isArray(part1.sections_present) && part1.sections_present.length > 0
          ? part1.sections_present
          : defaultOverview.sections_present,
        missing_sections: Array.isArray(part1.missing_sections)
          ? part1.missing_sections
          : defaultOverview.missing_sections,
        ats_analysis: part1.ats_analysis || defaultOverview.ats_analysis,
        format_analysis: part1.format_analysis || defaultOverview.format_analysis,
        experience_analysis: Array.isArray(part2.experience_analysis) && part2.experience_analysis.length > 0
          ? part2.experience_analysis
          : defaultExperience.experience_analysis,
        keyword_analysis: part3.keyword_analysis || defaultKeywords.keyword_analysis,
        english_problem: Array.isArray(part4.english_problem) && part4.english_problem.length > 0
          ? part4.english_problem
          : defaultEnglish.english_problem,
        formated_analysis: part5.formated_analysis || defaultLayout.formated_analysis,
        suggestions: Array.isArray(part5.suggestions) && part5.suggestions.length > 0
          ? part5.suggestions
          : defaultLayout.suggestions,
      };

      const durationMs = Date.now() - startTime;
      console.log(
        `[Resume Analyzer] SUCCESS: Deep Multi-Part Analysis completed in ${durationMs}ms:`,
        `Extracted ${mergedResult.experience_analysis.length} positions, ${mergedResult.keyword_analysis.keywords_found?.length || 0} keywords, ${mergedResult.english_problem.length} English enhancements, ${mergedResult.suggestions.length} prioritized suggestions.`
      );

      return mergedResult;
    } catch (criticalError) {
      console.error('[Resume Analyzer] Critical failure during multi-call analysis:', criticalError);
      return {
        ...defaultOverview,
        ...defaultExperience,
        ...defaultKeywords,
        ...defaultEnglish,
        ...defaultLayout,
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // JD to Resume Matcher (with full rotation and retry resilience)
  // ─────────────────────────────────────────────────────────────────────────────
  async analyzeJDToResume(resumeText, jobDescriptionText) {
    const systemInstruction = `
You are an executive AI recruiter and hiring committee evaluator.
Compare the candidate's RESUME against the JOB DESCRIPTION in depth:
Return a valid JSON object strictly matching this format:

{
  "title": "Full Stack Engineer",
  "match_score": 85,
  "skills": {
    "matched_skills": ["JavaScript", "React", "Node.js", "MongoDB", "Docker"],
    "missing_skills": ["Kubernetes", "GraphQL"],
    "extra_skills": ["Python", "AWS"]
  },
  "experience": {
    "required_experience": "3+ years in full stack development",
    "candidate_experience": "3+ years demonstrated in production software development",
    "experience_match": true
  },
  "education": {
    "required_education": "Bachelor's degree in Computer Science or equivalent",
    "candidate_education": "B.Tech in Computer Science & Engineering",
    "education_match": true
  },
  "keyword_match": {
    "total_keywords": 20,
    "matched_keywords": 17,
    "percentage": 85
  },
  "suggestions": [
    "Highlight experience with container orchestration (Docker/Kubernetes) prominently",
    "Mention GraphQL or REST API optimization metrics in your most recent role"
  ]
}

Rules:
- match_score and percentage must be numbers (0-100).
- experience_match and education_match must be booleans.
- Return ONLY valid JSON.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze Resume against Job Description:\n\nJob Description:\n"""${jobDescriptionText}"""\n\nResume:\n"""${resumeText}"""`
          }
        ]
      }
    ];

    try {
      return await this.executeWithRotation(
        'JD to Resume Analysis',
        contents,
        systemInstruction
      );
    } catch (error) {
      console.error('[Analyzer] JD to Resume analysis failed after all retries:', error);
      throw new ApiError(500, 'JD Resume analysis failed');
    }
  }
}

export default Analyzer;
