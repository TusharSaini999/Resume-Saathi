import mongoose from "mongoose";

const jobApplicationTrackerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Remote / India",
    },
    apply_url: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "official_career_portal",
    },
    source_portal: {
      type: String,
      default: "Official Career Portal",
    },
    source_url: {
      type: String,
      default: "",
    },
    source_domain: {
      type: String,
      default: "",
    },
    portal_type: {
      type: String,
      default: "Official Portal",
    },
    employment_type: {
      type: String,
      default: "Full-time",
    },
    experience_level: {
      type: String,
      default: "Junior (1-3 yrs)",
    },
    match_score: {
      type: Number,
      default: 0,
    },
    matched_skills: {
      type: [String],
      default: [],
    },
    missing_skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["saved", "applied", "interviewing", "offered", "rejected"],
      default: "saved",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    applied_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationTrackerSchema.index({ user_id: 1, apply_url: 1 }, { unique: true });

const JobApplicationTracker = mongoose.model("JobApplicationTracker", jobApplicationTrackerSchema);

export default JobApplicationTracker;
