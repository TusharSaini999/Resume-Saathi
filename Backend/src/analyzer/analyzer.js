import { GoogleGenAI, Type } from '@google/genai';
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
  }

  getClient() {
    const client = this.clients[this.keyIndex];
    this.keyIndex = (this.keyIndex + 1) % this.clients.length;
    return client;
  }

  async analyzePdf(pdfText) {
    try {
      const client = this.getClient();
      const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

      const systemInstruction = `
You are an expert resume analyzer designed to evaluate resumes for quality, ATS compatibility, and professional writing standards.

Your task is to carefully analyze a resume and return a structured JSON response that follows the schema provided.

Focus your analysis on the following areas:

1. ATS (Applicant Tracking System) Compatibility
- Determine how well the resume can be parsed by ATS software.
- Check if the resume uses standard section headings such as Education, Experience, Skills, Projects, Certifications, etc.
- Identify formatting practices that might break ATS parsing (tables, columns, unusual symbols, graphics, etc.).
- Provide an ATS compatibility score and clear recommendations to improve ATS performance.

2. Keyword Coverage
- Identify important domain-specific keywords that are expected for the candidate’s profession.
- Determine whether the resume includes enough relevant keywords.
- If keywords are missing, recommend which types of keywords should be added.

3. Grammar, Clarity, and Writing Style
- Detect grammatical mistakes, awkward phrasing, spelling issues, or unclear sentences.
- Provide corrections or suggested improvements.
- Focus on improving readability, professionalism, and clarity.

4. Layout and Formatting
- Evaluate the visual and structural formatting of the resume.
- Consider font consistency, spacing, margins, alignment, section structure, and column usage.
- Identify issues such as inconsistent formatting, poor alignment, or overcrowded layout.

Suggestions Format Requirements:

For the "suggestions" field:
Return an ARRAY of objects. Each object must contain:

- "issue": A clear description of the problem found in the resume.
- "recommendation": A practical suggestion explaining how to fix the issue.
- "section": The resume section where the issue appears (for example: Education, Experience, Skills, Projects, Summary, etc.).
- "priority": The importance level of fixing the issue. Use only one of the following values:
  - "Low"
  - "Medium"
  - "High"

Example suggestion format:
{
  "issue": "Work experience descriptions are too vague",
  "recommendation": "Add measurable achievements and impact metrics such as percentages or numbers",
  "section": "Experience",
  "priority": "High"
}

Formatting Analysis Requirement:

For "formatted_analysis.suggestions":
You may return a SINGLE STRING describing general layout improvements such as spacing, margins, alignment, or font consistency.

Output Rules:

- Return ONLY valid JSON.
- Do NOT include explanations outside the JSON.
- Ensure the output strictly matches the provided schema.
- Do not return suggestions as simple strings; they must always be objects with issue, recommendation, section, and priority fields.
`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.OBJECT,
            properties: {
              overall_rating: { type: Type.NUMBER },
              ats_compatibility: { type: Type.STRING, description: "Low, Medium, or High" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['overall_rating', 'ats_compatibility', 'strengths', 'weaknesses'],
          },
          sections_present: { type: Type.ARRAY, items: { type: Type.STRING } },
          missing_sections: { type: Type.ARRAY, items: { type: Type.STRING } },
          format_analysis: {
            type: Type.OBJECT,
            properties: {
              format_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
              format_score: { type: Type.NUMBER },
            },
            required: ['format_issues', 'format_score'],
          },
          keyword_analysis: {
            type: Type.OBJECT,
            properties: {
              keyword_score: { type: Type.NUMBER },
              keywords_found: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['keyword_score', 'keywords_found'],
          },
          ats_analysis: {
            type: Type.OBJECT,
            properties: {
              ats_score: { type: Type.NUMBER },
              compatibility: { type: Type.STRING, description: "Low, Medium, or High" },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['ats_score', 'compatibility', 'recommendations'],
          },
          experience_analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
                depth_score: { type: Type.NUMBER },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'role',
                'company',
                'duration',
                'achievements',
                'depth_score',
                'recommendations',
              ],
            },
          },
          english_problem: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                problem_type: { type: Type.STRING },
                issue_description: { type: Type.STRING },
                suggested_fix: { type: Type.STRING },
              },
              required: ['sentence', 'problem_type', 'issue_description', 'suggested_fix'],
            },
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                section: { type: Type.STRING },
                priority: { type: Type.STRING, description: "Low, Medium, or High" },
              },
              required: ['issue', 'recommendation', 'section', 'priority'],
            },
          },
          formated_analysis: {
            type: Type.OBJECT,
            properties: {
              font_analysis: {
                type: Type.OBJECT,
                properties: {
                  avg_font_size: { type: Type.NUMBER },
                  min_font_size: { type: Type.NUMBER },
                  max_font_size: { type: Type.NUMBER },
                  font_variations: { type: Type.NUMBER },
                  inconsistent_fonts: { type: Type.BOOLEAN },
                },
                required: [
                  'avg_font_size',
                  'min_font_size',
                  'max_font_size',
                  'font_variations',
                  'inconsistent_fonts',
                ],
              },
              spacing_analysis: {
                type: Type.OBJECT,
                properties: {
                  avg_line_height: { type: Type.NUMBER },
                  min_line_height: { type: Type.NUMBER },
                  max_line_height: { type: Type.NUMBER },
                  excessive_spacing_detected: { type: Type.BOOLEAN },
                  compressed_spacing_detected: { type: Type.BOOLEAN },
                },
                required: [
                  'avg_line_height',
                  'min_line_height',
                  'max_line_height',
                  'excessive_spacing_detected',
                  'compressed_spacing_detected',
                ],
              },
              column_analysis: {
                type: Type.OBJECT,
                properties: {
                  multi_column_detected: { type: Type.BOOLEAN },
                  column_count: { type: Type.NUMBER },
                },
                required: ['multi_column_detected', 'column_count'],
              },
              margin_analysis: {
                type: Type.OBJECT,
                properties: {
                  left_margin: { type: Type.NUMBER },
                  right_margin: { type: Type.NUMBER },
                  top_margin: { type: Type.NUMBER },
                  bottom_margin: { type: Type.NUMBER },
                  margin_issue_detected: { type: Type.BOOLEAN },
                },
                required: [
                  'left_margin',
                  'right_margin',
                  'top_margin',
                  'bottom_margin',
                  'margin_issue_detected',
                ],
              },
              alignment_analysis: {
                type: Type.OBJECT,
                properties: {
                  centered_text_detected: { type: Type.BOOLEAN },
                  inconsistent_alignment: { type: Type.BOOLEAN },
                },
                required: ['centered_text_detected', 'inconsistent_alignment'],
              },
              layout_score: { type: Type.NUMBER },
              ats_risk_level: { type: Type.STRING, description: "Low, Medium, or High" },
              suggestions: { type: Type.STRING },
            },
            required: [
              'font_analysis',
              'spacing_analysis',
              'column_analysis',
              'margin_analysis',
              'alignment_analysis',
              'layout_score',
              'ats_risk_level',
              'suggestions',
            ],
          },
        },
        required: [
          'summary',
          'sections_present',
          'missing_sections',
          'format_analysis',
          'keyword_analysis',
          'ats_analysis',
          'experience_analysis',
          'english_problem',
          'suggestions',
          'formated_analysis',
        ],
      };

      const response = await client.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Analyze the following resume strictly in JSON according to this structure:

{
  "summary": { "overall_rating": 0, "ats_compatibility": "Medium", "strengths": [], "weaknesses": [] },
  "sections_present": [],
  "missing_sections": [],
  "format_analysis": { "format_issues": [], "format_score": 0 },
  "keyword_analysis": { "keyword_score": 0, "keywords_found": []},
  "ats_analysis": { "ats_score": 0, "compatibility": "Medium", "recommendations": [] },
  "experience_analysis": [],
  "english_problem": [],
  "suggestions": [],
  "formated_analysis": {
    "font_analysis": { "avg_font_size": 0, "min_font_size": 0, "max_font_size": 0, "font_variations": 0, "inconsistent_fonts": false },
    "spacing_analysis": { "avg_line_height": 0, "min_line_height": 0, "max_line_height": 0, "excessive_spacing_detected": false, "compressed_spacing_detected": false },
    "column_analysis": { "multi_column_detected": false, "column_count": 0 },
    "margin_analysis": { "left_margin": 0, "right_margin": 0, "top_margin": 0, "bottom_margin": 0, "margin_issue_detected": false },
    "alignment_analysis": { "centered_text_detected": false, "inconsistent_alignment": false },
    "layout_score": 0,
    "ats_risk_level": "Medium",
    "suggestions": ""
  }
}
 
Resume text:
"""${pdfText}"""
`
              }
            ],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.0,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const analysisResultJSON = JSON.parse(response.text);
      return analysisResultJSON;
    } catch (error) {
      console.error(error);
      throw new ApiError(500, 'Failed to analyze PDF');
    }
  }

  async analyzeJDToResume(resumeText, jobDescriptionText) {
    try {
      const client = this.getClient();
      const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
      const systemInstruction = `
You are an expert AI recruiter and resume evaluator.

Your task is to compare a candidate's RESUME with a JOB DESCRIPTION
and return a structured JSON analysis.

Evaluate the following:

1. Job Title Extraction
Extract the job title from the Job Description.

2. Overall Match Score (0–100)
Evaluate how well the resume matches the job description.

3. Skills Analysis
Extract skills from the JD and compare with the resume.

4. Experience Comparison
Compare required experience from the JD with candidate experience.

5. Education Comparison
Compare education requirements with the candidate’s education.

6. Keyword Match
Extract important keywords from the JD and check their presence.

7. Suggestions
Provide practical improvements to help the candidate improve the resume for this job.

Rules:
- Return ONLY valid JSON
- Follow the schema strictly
- Do NOT add explanations outside JSON
`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          match_score: { type: Type.NUMBER },
          skills: {
            type: Type.OBJECT,
            properties: {
              matched_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              extra_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['matched_skills', 'missing_skills', 'extra_skills'],
          },
          experience: {
            type: Type.OBJECT,
            properties: {
              required_experience: { type: Type.STRING },
              candidate_experience: { type: Type.STRING },
              experience_match: { type: Type.BOOLEAN },
            },
            required: ['required_experience', 'candidate_experience', 'experience_match'],
          },
          education: {
            type: Type.OBJECT,
            properties: {
              required_education: { type: Type.STRING },
              candidate_education: { type: Type.STRING },
              education_match: { type: Type.BOOLEAN },
            },
            required: ['required_education', 'candidate_education', 'education_match'],
          },
          keyword_match: {
            type: Type.OBJECT,
            properties: {
              total_keywords: { type: Type.NUMBER },
              matched_keywords: { type: Type.NUMBER },
              percentage: { type: Type.NUMBER },
            },
            required: ['total_keywords', 'matched_keywords', 'percentage'],
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'title',
          'match_score',
          'skills',
          'experience',
          'education',
          'keyword_match',
          'suggestions',
        ],
      };

      const response = await client.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `
Analyze the Resume against the Job Description.

Return JSON strictly in this format:

{
  "title": "",
  "match_score": 0,
  "skills": {
    "matched_skills": [],
    "missing_skills": [],
    "extra_skills": []
  },
  "experience": {
    "required_experience": "",
    "candidate_experience": "",
    "experience_match": false
  },
  "education": {
    "required_education": "",
    "candidate_education": "",
    "education_match": false
  },
  "keyword_match": {
    "total_keywords": 0,
    "matched_keywords": 0,
    "percentage": 0
  },
  "suggestions": []
}

Job Description:
"""${jobDescriptionText}"""

Resume:
"""${resumeText}"""
`
              }
            ]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.0,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, 'JD Resume analysis failed');
    }
  }
}

export default Analyzer;
