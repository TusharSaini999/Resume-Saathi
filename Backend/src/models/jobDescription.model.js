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
        maxlength: [100, 'Required experience cannot exceed 100 characters'],
      },

      candidate_experience: {
        type: String,
        trim: true,
        default: '',
        maxlength: [100, 'Candidate experience cannot exceed 100 characters'],
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
        maxlength: [150, 'Required education cannot exceed 150 characters'],
      },

      candidate_education: {
        type: String,
        trim: true,
        default: '',
        maxlength: [150, 'Candidate education cannot exceed 150 characters'],
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
      validate: {
        validator: function (arr) {
          return arr.every((item) => item.length <= 300);
        },
        message: 'Each suggestion must be less than 300 characters',
      },
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
      maxlength: [150, 'Job title cannot exceed 150 characters'],
    },

    company_name: {
      type: String,
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      minlength: [20, 'Job description must be at least 20 characters long'],
      maxlength: [10000, 'Job description cannot exceed 10000 characters'],
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