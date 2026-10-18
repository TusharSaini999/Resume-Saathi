import mongoose from "mongoose";

const discoveredCareerJobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    companySlug: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      default: "official_career_portal",
      index: true,
    },
    sourcePortal: {
      type: String,
      default: "Official Career Portal",
    },
    sourceDomain: {
      type: String,
      default: "",
    },
    sourceUrl: {
      type: String,
      default: "",
    },
    portalType: {
      type: String,
      default: "Official Portal",
    },
    portalLabel: {
      type: String,
      default: "Official Career Portal",
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      default: "Remote / Multiple Locations",
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Internship", "Contract"],
      default: "Full-time",
      index: true,
    },
    experienceLevel: {
      type: String,
      default: "Junior (1-3 yrs)",
      index: true,
    },
    minExperienceYears: {
      type: Number,
      default: 0,
    },
    maxExperienceYears: {
      type: Number,
      default: 5,
    },
    isFresherFriendly: {
      type: Boolean,
      default: false,
      index: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    stream: {
      id: { type: String, default: "full_stack", index: true },
      label: { type: String, default: "Full Stack Development" },
      icon: { type: String, default: "🌐" },
    },
    departments: {
      type: [String],
      default: [],
    },
    applyUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fullDescription: {
      type: String,
      default: "",
    },
    fullDescriptionHtml: {
      type: String,
      default: "",
    },
    hasFullJD: {
      type: Boolean,
      default: false,
      index: true,
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    descriptionSummary: {
      type: String,
      default: "",
    },
    candidateType: {
      type: String,
      default: "",
    },
    eligibilityVerdict: {
      type: String,
      default: "",
    },
    fresherEligibilityReason: {
      type: String,
      default: "",
    },
    structuredJD: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
      expires: 43200, // 12 Hours TTL index: auto-deletes expired cached documents
    },
  },
  {
    timestamps: true,
  }
);

discoveredCareerJobSchema.index({ companySlug: 1, externalId: 1 }, { unique: true });
discoveredCareerJobSchema.index({ stream: 1, employmentType: 1, isFresherFriendly: 1 });

const DiscoveredCareerJob = mongoose.model(
  "DiscoveredCareerJob",
  discoveredCareerJobSchema
);

export default DiscoveredCareerJob;
