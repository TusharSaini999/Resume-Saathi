import mongoose from 'mongoose';

// --------------------- Nested Schemas ---------------------

// English problem schema
const englishProblemSchema = new mongoose.Schema(
  {
    sentence: { type: String, required: true },
    problem_type: { type: String, required: true },
    issue_description: { type: String, required: true },
    suggested_fix: { type: String, required: true },
  },
  { _id: false, strict: true }
);

// Suggestion schema
const suggestionSchema = new mongoose.Schema(
  {
    issue: { type: String, required: true },
    recommendation: { type: String, required: true },
    section: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  },
  { _id: false, strict: true }
);

// Experience analysis schema
const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    achievements: { type: [String], default: [] },
    depth_score: { type: Number, min: 0, max: 100 },
    recommendations: { type: [String], default: [] },
  },
  { _id: false, strict: true }
);

// Keyword analysis schema
const keywordAnalysisSchema = new mongoose.Schema(
  {
    keyword_score: { type: Number, min: 0, max: 100, required: true },
    keywords_found: { type: [String], default: [] },
  },
  { _id: false, strict: true }
);

// ATS analysis schema
const atsAnalysisSchema = new mongoose.Schema(
  {
    ats_score: { type: Number, min: 0, max: 100, required: true },
    compatibility: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    recommendations: { type: [String], default: [] },
  },
  { _id: false, strict: true }
);

// Format analysis schema
const formatAnalysisSchema = new mongoose.Schema(
  {
    format_issues: { type: [String], default: [] },
    format_score: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false, strict: true }
);

// Summary schema
const summarySchema = new mongoose.Schema(
  {
    overall_rating: { type: Number, min: 0, max: 100, required: true },
    ats_compatibility: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
  },
  { _id: false, strict: true }
);

// --------------------- Layout Analysis Schemas ---------------------

const fontAnalysisSchema = new mongoose.Schema(
  {
    avg_font_size: { type: Number, required: true },
    min_font_size: { type: Number, required: true },
    max_font_size: { type: Number, required: true },
    font_variations: { type: Number, required: true },
    inconsistent_fonts: { type: Boolean, required: true },
  },
  { _id: false, strict: true }
);

const spacingAnalysisSchema = new mongoose.Schema(
  {
    avg_line_height: { type: Number, required: true },
    min_line_height: { type: Number, required: true },
    max_line_height: { type: Number, required: true },
    excessive_spacing_detected: { type: Boolean, required: true },
    compressed_spacing_detected: { type: Boolean, required: true },
  },
  { _id: false, strict: true }
);

const columnAnalysisSchema = new mongoose.Schema(
  {
    multi_column_detected: { type: Number, required: true },
    column_count: { type: Number, required: true },
  },
  { _id: false, strict: true }
);

const marginAnalysisSchema = new mongoose.Schema(
  {
    left_margin: { type: Number, required: true },
    right_margin: { type: Number, required: true },
    top_margin: { type: Number, required: true },
    bottom_margin: { type: Number, required: true },
    margin_issue_detected: { type: Boolean, required: true },
  },
  { _id: false, strict: true }
);

const alignmentAnalysisSchema = new mongoose.Schema(
  {
    centered_text_detected: { type: Boolean, required: true },
    inconsistent_alignment: { type: Boolean, required: true },
  },
  { _id: false, strict: true }
);

const layoutAnalysisSchema = new mongoose.Schema(
  {
    font_analysis: { type: fontAnalysisSchema, required: true },
    spacing_analysis: { type: spacingAnalysisSchema, required: true },
    column_analysis: { type: columnAnalysisSchema, required: true },
    margin_analysis: { type: marginAnalysisSchema, required: true },
    alignment_analysis: { type: alignmentAnalysisSchema, required: true },
    layout_score: { type: Number, min: 0, max: 100, required: true },
    ats_risk_level: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    suggestions: { type: String, required: true },
  },
  { _id: false, strict: true }
);

// --------------------- Main Resume Analysis Schema ---------------------

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumesCollection', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    summary: { type: summarySchema, required: true },
    sections_present: { type: [String], default: [] },
    missing_sections: { type: [String], default: [] },
    format_analysis: { type: formatAnalysisSchema, required: true },
    keyword_analysis: { type: keywordAnalysisSchema, required: true },
    ats_analysis: { type: atsAnalysisSchema, required: true },
    experience_analysis: { type: [experienceSchema], default: [] },
    english_problem: { type: [englishProblemSchema], default: [] },
    suggestions: { type: [suggestionSchema], default: [] },
    formated_analysis: { type: layoutAnalysisSchema, required: true }, // <-- nested layout analysis
  },
  { timestamps: true, strict: true }
);

// Unique index: one analysis per resume + user
resumeAnalysisSchema.index({ user_id: 1, resume_id: 1 }, { unique: true });

// Optional duplicate key error handler
resumeAnalysisSchema.statics.handleDuplicateKeyError = (err) => {
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue).join(', ');
    return new Error(`Duplicate entry detected for: ${key}`);
  }
  return err;
};

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
