import mongoose from 'mongoose';


const jobMatchAnalysisSchema = new mongoose.Schema(
  {
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'JobDescription',
      required: [true, 'Job ID is required'],
      index: true,
    },

    resume_id: {
      type: Schema.Types.ObjectId,
      ref: 'ResumesCollection',
      required: [true, 'Resume ID is required'],
      index: true,
    },

    matched_skills: {
      type: [String],
      default: [],
    },

    missing_skills: {
      type: [String],
      default: [],
    },

    matched_keywords: {
      type: [String],
      default: [],
    },

    missing_keywords: {
      type: [String],
      default: [],
    },

    section_scores: {
      type: Map,
      of: Number, // Example: { skills: 80, experience: 75 }
      default: {},
    },

    strengths: {
      type: [String],
      required: [true, 'Strengths are required'],
      default: [],
    },

    weaknesses: {
      type: [String],
      required: [true, 'Weaknesses are required'],
      default: [],
    },

    ats_status: {
      type: String,
      required: [true, 'ATS status is required'],
      enum: {
        values: ['Strong Match', 'Moderate Match', 'Weak Match'],
        message: 'Invalid ATS status value',
      },
    },

    suggestions: {
      type: [String],
      required: [true, 'Suggestions are required'],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------- Model Export -------------------- */
const JobMatchAnalysis = mongoose.model('JobMatchAnalysis', jobMatchAnalysisSchema);

export default JobMatchAnalysis;
