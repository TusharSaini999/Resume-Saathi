import mongoose from 'mongoose';

const { Schema } = mongoose;

/* -------------------- JD Analysis Schema -------------------- */
const jdAnalysisSchema = new Schema(
  {
    match_score: {
      type: Number,
      min: [0, 'Match score cannot be less than 0'],
      max: [100, 'Match score cannot exceed 100'],
      default: 0,
    },

    skills: {
      matched_skills: {
        type: [String],
        default: [],
      },
      missing_skills: {
        type: [String],
        default: [],
      },
      extra_skills: {
        type: [String],
        default: [],
      },
    },

    experience: {
      required_experience: {
        type: String,
        trim: true,
        default: '',
      },

      candidate_experience: {
        type: String,
        trim: true,
        default: '',
      },

      experience_match: {
        type: Boolean,
        default: false,
      },
    },

    education: {
      required_education: {
        type: String,
        trim: true,
        default: '',
      },

      candidate_education: {
        type: String,
        trim: true,
        default: '',
      },

      education_match: {
        type: Boolean,
        default: false,
      },
    },

    keyword_match: {
      total_keywords: {
        type: Number,
        min: [0, 'Total keywords cannot be negative'],
        default: 0,
      },

      matched_keywords: {
        type: Number,
        min: [0, 'Matched keywords cannot be negative'],
        default: 0,
      },

      percentage: {
        type: Number,
        min: [0, 'Keyword match percentage cannot be less than 0'],
        max: [100, 'Keyword match percentage cannot exceed 100'],
        default: 0,
      },
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/* -------------------- Job Description Schema -------------------- */
const jobDescriptionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    resume_id: {
      type: Schema.Types.ObjectId,
      ref: 'ResumesCollection',
      required: [true, 'Resume ID is required'],
    },

    title: {
      type: String,
      trim: true,
    },

    company_name: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },

    /* -------- JD Analysis Result -------- */
    jd_analysis: {
      type: jdAnalysisSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


/* -------------------- Model Export -------------------- */
const JobDescription = mongoose.model('JobDescription', jobDescriptionSchema);

export default JobDescription;