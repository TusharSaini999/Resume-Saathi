import mongoose from "mongoose";

// Nested EnglishProblem schema with custom error messages
const englishProblemSchema = new mongoose.Schema(
  {
    sentence: { 
      type: String, 
      required: [true, "English problem sentence is required"] 
    },
    problem_type: { 
      type: String, 
      required: [true, "English problem type is required"] 
    },
    issue_description: { 
      type: String, 
      required: [true, "English problem issue description is required"] 
    },
    suggested_fix: { 
      type: String, 
      required: [true, "Suggested fix for English problem is required"] 
    },
  },
  { _id: false, strict: true }
);

// ResumeAnalysis schema
const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumesCollection",
      required: [true, "Resume ID is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    sections_present: {
      type: [String],
      required: [true, "Sections present cannot be empty"],
    },
    missing_sections: {
      type: [String],
      required: [true, "Missing sections cannot be empty"],
    },
    format_issues: {
      type: [String],
      required: [true, "Format issues cannot be empty"],
    },
    ats_compatibility: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "ATS compatibility must be 'Low', 'Medium', or 'High'",
      },
      required: [true, "ATS compatibility is required"],
    },
    format_score: {
      type: Number,
      min: [0, "Format score cannot be less than 0"],
      max: [100, "Format score cannot be more than 100"],
      required: [true, "Format score is required"],
    },
    keyword_score: {
      type: Number,
      min: [0, "Keyword score cannot be less than 0"],
      max: [100, "Keyword score cannot be more than 100"],
      required: [true, "Keyword score is required"],
    },
    ats_score: {
      type: Number,
      min: [0, "ATS score cannot be less than 0"],
      max: [100, "ATS score cannot be more than 100"],
      required: [true, "ATS score is required"],
    },
    suggestions: {
      type: String,
      required: [true, "Suggestions field is required"],
    },
    english_problem: {
      type: [englishProblemSchema],
      required: [true, "English problem array cannot be empty"],
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Compound unique index for user_id + resume_id
resumeAnalysisSchema.index(
  { user_id: 1, resume_id: 1 }, 
  { 
    unique: true, 
    name: "unique_user_resume" 
  }
);

// Optional: static method to handle unique index errors
resumeAnalysisSchema.statics.handleDuplicateKeyError = (err) => {
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue).join(", ");
    return new Error(`Duplicate entry detected for: ${key}`);
  }
  return err;
};

// Export model
const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;