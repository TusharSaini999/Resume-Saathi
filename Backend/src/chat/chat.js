import Groq from 'groq-sdk';
import ApiError from '../utils/ApiError.js';
import ResumeAnalysis from '../models/resume_analysis.model.js';

class Chat {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing in environment variables');
    }

    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateStructuredResponse(messages, responseSchema) {
    const basePayload = {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      response_format: {
        type: 'json_schema',
        json_schema: responseSchema,
      },
    };

    const strictReminder = {
      role: 'system',
      content:
        'Return ONLY valid JSON with exactly two fields: "title" and "answer". The "answer" value must be a single markdown string. Do not return arrays or objects inside "answer".',
    };

    const attempts = [
      { temperature: 0.6, withReminder: false },
      { temperature: 0.2, withReminder: true },
      { temperature: 0, withReminder: true },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      const attemptMessages = attempt.withReminder ? [...messages, strictReminder] : messages;

      try {
        const response = await this.groq.chat.completions.create({
          ...basePayload,
          messages: attemptMessages,
          temperature: attempt.temperature,
        });

        const content = response?.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Missing response content');
        }

        const parsed = JSON.parse(content);
        if (typeof parsed?.title !== 'string' || typeof parsed?.answer !== 'string') {
          throw new Error('Invalid response shape returned by model');
        }

        return parsed;
      } catch (error) {
        lastError = error;
        console.error('Structured response attempt failed:', {
          temperature: attempt.temperature,
          withReminder: attempt.withReminder,
          error,
        });
      }
    }

    console.error('All structured response attempts failed:', lastError);
    throw new ApiError(502, 'AI response generation failed');
  }

  async chat(query = '', userId = '', userName = '', resumeId = '', resumeText = '', history = []) {
    try {
      // ---------------- VALIDATION ----------------
      if (!query || typeof query !== 'string') {
        throw new ApiError(400, 'Invalid query provided');
      }

      if (!Array.isArray(history)) {
        throw new ApiError(400, 'History must be an array');
      }

      const messages = [];

      // ---------------- HISTORY ----------------
      history.forEach((h) => {
        if (h.sender && h.message) {
          messages.push({
            role: h.sender,
            content: h.message,
          });
        }
      });

      const isFirstMessage = history.length === 0;

      // ---------------- SYSTEM PROMPT ----------------
      messages.unshift({
        role: 'system',
        content: `
Your name is **ResumeSaathi**, an AI Interview Preparation Agent designed to help users prepare for job interviews and improve their careers.

--------------------------------------------------
YOUR RESPONSIBILITIES
--------------------------------------------------

• Answer interview questions
• Explain technical concepts clearly
• Suggest improvements to resumes
• Provide interview preparation strategies
• Help users understand their strengths and weaknesses
• Give practical career advice

--------------------------------------------------
TOOL USAGE
--------------------------------------------------

If the user asks about ANYTHING related to their resume analysis or requests insights based on their resume, you MUST call the tool:

analyze_resume

This includes questions about:
• Resume feedback
• Resume improvement
• Strengths and weaknesses
• ATS score
• Interview readiness
• Resume structure
• Missing sections
• Experience quality
• Resume formatting
• Resume keywords
• English or grammar issues
• Career advice based on their resume

Tool arguments:
{
  "userId": "<userId>",
  "resumeId": "<resumeId>"
}

IMPORTANT:
If answering the question requires resume analysis, you MUST call the tool BEFORE generating the response.

Do NOT call the tool if the question is general and does not require resume-specific insights.

If the resume analysis report has already been retrieved earlier in the conversation, reuse it instead of calling the tool again.

--------------------------------------------------
TOOL RETURN DATA
--------------------------------------------------

The tool returns structured resume analysis including:

SUMMARY
• overall_rating
• ats_compatibility
• strengths
• weaknesses

SECTIONS
• sections_present
• missing_sections

ATS ANALYSIS
• ats_score
• compatibility
• recommendations

KEYWORD ANALYSIS
• keyword_score
• keywords_found

FORMAT ANALYSIS
• format_score
• format_issues

LAYOUT ANALYSIS
• font consistency
• spacing issues
• margin issues
• column layout
• alignment problems
• layout_score
• ats_risk_level

EXPERIENCE ANALYSIS
• role
• company
• duration
• achievements
• depth_score
• recommendations

ENGLISH PROBLEMS
• sentence
• issue_description
• suggested_fix

SUGGESTIONS
• issue
• recommendation
• section
• priority

Use this data to generate accurate and personalized career advice.

--------------------------------------------------
RESPONSE FORMAT (MANDATORY)
--------------------------------------------------

You MUST return ONLY valid JSON.

Never include text outside JSON.

Always return responses in this format:

{
  "title": "Short descriptive title",
  "answer": "Markdown formatted explanation"
}

--------------------------------------------------
ANSWER WRITING RULES
--------------------------------------------------

The **answer** field MUST be a single Markdown string.

It should:
• Use headings (###)
• Use bullet points
• Provide clear explanations
• Give actionable advice
• Include examples when helpful

The answer field MUST NOT contain:
• JSON
• arrays
• objects
• structured fields
• code blocks

Convert any analysis data into a clear **human-readable explanation**.

Write responses like a **professional career coach helping someone prepare for interviews**.

--------------------------------------------------
MOCK INTERVIEW RULES
--------------------------------------------------

When conducting a mock interview:

• Ask ONLY ONE question at a time
• Wait for the user's answer before asking the next question
• Ask follow-up questions based on the user's response
• Do NOT list multiple questions
• Start with an easy question
• Gradually increase difficulty

Interview Flow:
1. Introduction
2. Basic background question
3. Technical/project question
4. Problem-solving question
5. Behavioral question
6. Closing
`,
      });
      // ---------------- USER MESSAGE ----------------
      messages.push({
        role: 'user',
        content: `
User ID: ${userId}
Resume ID: ${resumeId}
Do not disclose userId or resumeId in your response. Use them only for tool calls when necessary.

User Name: ${userName}

RESUME TEXT:
${resumeText}

USER QUERY:
${query}
`,
      });

      // ---------------- RESPONSE SCHEMA ----------------
      const responseSchema = {
        name: 'first_response',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 80,
              description:
                "Short descriptive title summarizing the user's question or topic. Plain text only without markdown.",
              pattern: '^[^{}\\[\\]]*$',
            },
            answer: {
              type: 'string',
              minLength: 120,
              maxLength: 5000,
              description:
                'A detailed response written using Markdown formatting. The answer should include headings, bullet points, and clear sections when helpful. It must explain concepts clearly, provide reasoning, and include examples if appropriate. Do NOT include JSON, objects, arrays, or escaped JSON.',
              pattern: '^[^{}]*$',
            },
          },
          required: ['title', 'answer'],
        },
      };


      // ---------------- FIRST LLM CALL (TOOLS ENABLED) ----------------
      let completion;

      try {
        completion = await this.groq.chat.completions.create({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages,
          temperature: 0.6,
          tools: [
            {
              type: 'function',
              function: {
                name: 'analyze_resume',
                description:
                  'Fetch detailed resume analysis including strengths, weaknesses, ATS compatibility, and interview insights.',
                parameters: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    resumeId: { type: 'string' },
                  },
                  required: ['userId', 'resumeId'],
                },
              },
            },
          ],
          tool_choice: 'auto',
        });
      } catch (error) {
        console.error('Groq API Error:', error);
        throw new ApiError(502, 'AI service temporarily unavailable');
      }

      const message = completion?.choices?.[0]?.message;
      if (!message) {
        throw new ApiError(500, 'Invalid AI response received');
      }

      // ---------------- TOOL HANDLING ----------------
      if (message.tool_calls?.length) {
        const toolCall = message.tool_calls[0];

        let args;

        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          throw new ApiError(500, 'Failed to parse tool arguments');
        }

        let toolResult;

        try {
          toolResult = await this.analyzeResumeTool(args.userId, args.resumeId);
        } catch (error) {
          console.error('Tool execution failed:', error);
          toolResult = { error: 'Resume analysis unavailable' };
        }

        // push tool call message
        messages.push(message);

        // push tool response
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });

        // ---------------- SECOND CALL (STRUCTURED OUTPUT) ----------------
        return await this.generateStructuredResponse(messages, responseSchema);
      }

      // ---------------- NO TOOL CALLED → FORMAT RESPONSE ----------------

      return await this.generateStructuredResponse(messages, responseSchema);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('Chat Service Error:', error);

      throw new ApiError(500, 'Chat processing failed');
    }
  }

  // ---------------- TOOL FUNCTION ----------------
  async analyzeResumeTool(userId, resumeId) {
    try {
      if (!userId || !resumeId) {
        return { message: 'Missing userId or resumeId' };
      }

      const analysis = await ResumeAnalysis.findOne({
        user_id: userId,
        resume_id: resumeId,
      }).lean();

      if (!analysis) {
        return { message: 'No resume analysis found' };
      }

      delete analysis.user_id;
      delete analysis.resume_id;
      delete analysis.__v;
      delete analysis.createdAt;
      delete analysis.updatedAt;
      delete analysis._id;

      return analysis;
    } catch (error) {
      console.error('Resume Tool DB Error:', error);
      return { error: 'Failed to fetch resume analysis' };
    }
  }
}

export default Chat;
