import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
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
    },

    required_skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 20; // limit skills
        },
        message: 'Maximum 20 skills allowed',
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------- Indexes -------------------- */
jobDescriptionSchema.index({ user_id: 1 });
jobDescriptionSchema.index({ title: 'text', description: 'text' });

/* -------------------- Model Export -------------------- */
const JobDescription = mongoose.model('JobDescription', jobDescriptionSchema);

export default JobDescription;
