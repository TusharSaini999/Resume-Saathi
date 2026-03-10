import Groq from 'groq-sdk';
import ApiError from '../utils/ApiError.js';

class Analyzer {
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async analyzePdf(pdfText) {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: `
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
`,
          },
          {
            role: 'user',
            content: `Analyze the following resume strictly in JSON according to this structure:

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
    "column_analysis": { "multi_column_detected": 0, "column_count": 0 },
    "margin_analysis": { "left_margin": 0, "right_margin": 0, "top_margin": 0, "bottom_margin": 0, "margin_issue_detected": false },
    "alignment_analysis": { "centered_text_detected": false, "inconsistent_alignment": false },
    "layout_score": 0,
    "ats_risk_level": "Medium",
    "suggestions": ""
  }
}
 
Resume text:
"""${pdfText}"""
`,
          },
        ],
        temperature: 0,
        max_completion_tokens: 8192,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'resume_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                summary: {
                  type: 'object',
                  properties: {
                    overall_rating: { type: 'number' },
                    ats_compatibility: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    strengths: { type: 'array', items: { type: 'string' } },
                    weaknesses: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['overall_rating', 'ats_compatibility', 'strengths', 'weaknesses'],
                  additionalProperties: false,
                },
                sections_present: { type: 'array', items: { type: 'string' } },
                missing_sections: { type: 'array', items: { type: 'string' } },
                format_analysis: {
                  type: 'object',
                  properties: {
                    format_issues: { type: 'array', items: { type: 'string' } },
                    format_score: { type: 'number' },
                  },
                  required: ['format_issues', 'format_score'],
                  additionalProperties: false,
                },
                keyword_analysis: {
                  type: 'object',
                  properties: {
                    keyword_score: { type: 'number' },
                    keywords_found: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['keyword_score', 'keywords_found'],
                  additionalProperties: false,
                },
                ats_analysis: {
                  type: 'object',
                  properties: {
                    ats_score: { type: 'number' },
                    compatibility: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    recommendations: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['ats_score', 'compatibility', 'recommendations'],
                  additionalProperties: false,
                },
                experience_analysis: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      role: { type: 'string' },
                      company: { type: 'string' },
                      duration: { type: 'string' },
                      achievements: { type: 'array', items: { type: 'string' } },
                      depth_score: { type: 'number' },
                      recommendations: { type: 'array', items: { type: 'string' } },
                    },
                    required: [
                      'role',
                      'company',
                      'duration',
                      'achievements',
                      'depth_score',
                      'recommendations',
                    ],
                    additionalProperties: false,
                  },
                },
                english_problem: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      sentence: { type: 'string' },
                      problem_type: { type: 'string' },
                      issue_description: { type: 'string' },
                      suggested_fix: { type: 'string' },
                    },
                    required: ['sentence', 'problem_type', 'issue_description', 'suggested_fix'],
                    additionalProperties: false,
                  },
                },
                suggestions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      issue: { type: 'string' },
                      recommendation: { type: 'string' },
                      section: { type: 'string' },
                      priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    },
                    required: ['issue', 'recommendation', 'section', 'priority'],
                    additionalProperties: false,
                  },
                },
                formated_analysis: {
                  type: 'object',
                  properties: {
                    font_analysis: {
                      type: 'object',
                      properties: {
                        avg_font_size: { type: 'number' },
                        min_font_size: { type: 'number' },
                        max_font_size: { type: 'number' },
                        font_variations: { type: 'number' },
                        inconsistent_fonts: { type: 'boolean' },
                      },
                      required: [
                        'avg_font_size',
                        'min_font_size',
                        'max_font_size',
                        'font_variations',
                        'inconsistent_fonts',
                      ],
                      additionalProperties: false,
                    },
                    spacing_analysis: {
                      type: 'object',
                      properties: {
                        avg_line_height: { type: 'number' },
                        min_line_height: { type: 'number' },
                        max_line_height: { type: 'number' },
                        excessive_spacing_detected: { type: 'boolean' },
                        compressed_spacing_detected: { type: 'boolean' },
                      },
                      required: [
                        'avg_line_height',
                        'min_line_height',
                        'max_line_height',
                        'excessive_spacing_detected',
                        'compressed_spacing_detected',
                      ],
                      additionalProperties: false,
                    },
                    column_analysis: {
                      type: 'object',
                      properties: {
                        multi_column_detected: { type: 'number' },
                        column_count: { type: 'number' },
                      },
                      required: ['multi_column_detected', 'column_count'],
                      additionalProperties: false,
                    },
                    margin_analysis: {
                      type: 'object',
                      properties: {
                        left_margin: { type: 'number' },
                        right_margin: { type: 'number' },
                        top_margin: { type: 'number' },
                        bottom_margin: { type: 'number' },
                        margin_issue_detected: { type: 'boolean' },
                      },
                      required: [
                        'left_margin',
                        'right_margin',
                        'top_margin',
                        'bottom_margin',
                        'margin_issue_detected',
                      ],
                      additionalProperties: false,
                    },
                    alignment_analysis: {
                      type: 'object',
                      properties: {
                        centered_text_detected: { type: 'boolean' },
                        inconsistent_alignment: { type: 'boolean' },
                      },
                      required: ['centered_text_detected', 'inconsistent_alignment'],
                      additionalProperties: false,
                    },
                    layout_score: { type: 'number' },
                    ats_risk_level: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    suggestions: { type: 'string' },
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
                  additionalProperties: false,
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
              additionalProperties: false,
            },
          },
        },
      });

      const analysisResult = response.choices[0].message.content;
      const analysisResultJSON = JSON.parse(analysisResult);

      return analysisResultJSON;
    } catch (error) {
      console.error(error);
      throw new ApiError(500, 'Failed to analyze PDF');
    }
  }
  async analyzeJDToResume(resumeText, jobDescriptionText) {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0,
        max_completion_tokens: 8192,

        messages: [
          {
            role: 'system',
            content: `
You are an expert AI recruiter and resume evaluator.

Your task is to compare a candidate's RESUME with a JOB DESCRIPTION
and return a structured JSON analysis.

Evaluate the following:

1. Job Title Extraction
Extract the job title from the Job Description.

Return:
- title

2. Overall Match Score (0–100)
Evaluate how well the resume matches the job description.

3. Skills Analysis
Extract skills from the JD and compare with the resume.

Return:
- matched_skills
- missing_skills
- extra_skills

4. Experience Comparison
Compare required experience from the JD with candidate experience.

Return:
- required_experience
- candidate_experience
- experience_match (true/false)

5. Education Comparison
Compare education requirements with the candidate’s education.

Return:
- required_education
- candidate_education
- education_match (true/false)

6. Keyword Match
Extract important keywords from the JD and check their presence.

Return:
- total_keywords
- matched_keywords
- percentage

7. Suggestions
Provide practical improvements to help the candidate improve the resume for this job.

Rules:
- Return ONLY valid JSON
- Follow the schema strictly
- Do NOT add explanations outside JSON
`,
          },

          {
            role: 'user',
            content: `
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
`,
          },
        ],

        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'jd_resume_analysis',
            strict: true,

            schema: {
              type: 'object',

              properties: {
                title: {
                  type: 'string',
                },

                match_score: {
                  type: 'number',
                },

                skills: {
                  type: 'object',
                  properties: {
                    matched_skills: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    missing_skills: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    extra_skills: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['matched_skills', 'missing_skills', 'extra_skills'],
                  additionalProperties: false,
                },

                experience: {
                  type: 'object',
                  properties: {
                    required_experience: { type: 'string' },
                    candidate_experience: { type: 'string' },
                    experience_match: { type: 'boolean' },
                  },
                  required: ['required_experience', 'candidate_experience', 'experience_match'],
                  additionalProperties: false,
                },

                education: {
                  type: 'object',
                  properties: {
                    required_education: { type: 'string' },
                    candidate_education: { type: 'string' },
                    education_match: { type: 'boolean' },
                  },
                  required: ['required_education', 'candidate_education', 'education_match'],
                  additionalProperties: false,
                },

                keyword_match: {
                  type: 'object',
                  properties: {
                    total_keywords: { type: 'number' },
                    matched_keywords: { type: 'number' },
                    percentage: { type: 'number' },
                  },
                  required: ['total_keywords', 'matched_keywords', 'percentage'],
                  additionalProperties: false,
                },

                suggestions: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
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

              additionalProperties: false,
            },
          },
        },
      });

      const result = response.choices[0].message.content;
      return JSON.parse(result);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, 'JD Resume analysis failed');
    }
  }
}

export default Analyzer;
