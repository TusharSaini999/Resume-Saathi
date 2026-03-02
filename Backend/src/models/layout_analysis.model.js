import mongoose from "mongoose";

// Nested Schemas for layout analysis

const fontAnalysisSchema = new mongoose.Schema(
  {
    avg_font_size: { type: Number, required: [true, "Average font size is required"] },
    min_font_size: { type: Number, required: [true, "Minimum font size is required"] },
    max_font_size: { type: Number, required: [true, "Maximum font size is required"] },
    font_variations: { type: Number, required: [true, "Font variations count is required"] },
    inconsistent_fonts: { type: Boolean, required: [true, "Inconsistent fonts flag is required"] },
  },
  { _id: false, strict: true }
);

const spacingAnalysisSchema = new mongoose.Schema(
  {
    avg_line_height: { type: Number, required: [true, "Average line height is required"] },
    min_line_height: { type: Number, required: [true, "Minimum line height is required"] },
    max_line_height: { type: Number, required: [true, "Maximum line height is required"] },
    excessive_spacing_detected: { type: Boolean, required: [true, "Excessive spacing flag is required"] },
    compressed_spacing_detected: { type: Boolean, required: [true, "Compressed spacing flag is required"] },
  },
  { _id: false, strict: true }
);

const columnAnalysisSchema = new mongoose.Schema(
  {
    multi_column_detected: { type: Number, required: [true, "Multi-column detected is required"] },
    column_count: { type: Number, required: [true, "Column count is required"] },
  },
  { _id: false, strict: true }
);

const marginAnalysisSchema = new mongoose.Schema(
  {
    left_margin: { type: Number, required: [true, "Left margin is required"] },
    right_margin: { type: Number, required: [true, "Right margin is required"] },
    top_margin: { type: Number, required: [true, "Top margin is required"] },
    bottom_margin: { type: Number, required: [true, "Bottom margin is required"] },
    margin_issue_detected: { type: Boolean, required: [true, "Margin issue flag is required"] },
  },
  { _id: false, strict: true }
);

const alignmentAnalysisSchema = new mongoose.Schema(
  {
    centered_text_detected: { type: Boolean, required: [true, "Centered text flag is required"] },
    inconsistent_alignment: { type: Boolean, required: [true, "Inconsistent alignment flag is required"] },
  },
  { _id: false, strict: true }
);

// Main LayoutAnalysis Schema
const layoutAnalysisSchema = new mongoose.Schema(
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
    font_analysis: { type: fontAnalysisSchema, required: true },
    spacing_analysis: { type: spacingAnalysisSchema, required: true },
    column_analysis: { type: columnAnalysisSchema, required: true },
    margin_analysis: { type: marginAnalysisSchema, required: true },
    alignment_analysis: { type: alignmentAnalysisSchema, required: true },
    layout_score: {
      type: Number,
      min: [0, "Layout score cannot be less than 0"],
      max: [100, "Layout score cannot be more than 100"],
      required: [true, "Layout score is required"],
    },
    ats_risk_level: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "ATS risk level must be 'Low', 'Medium', or 'High'",
      },
      required: [true, "ATS risk level is required"],
    },
    suggestions: { type: String, required: [true, "Suggestions are required"] }
  },
  {
    timestamps: true, // auto manages createdAt and updatedAt
    strict: true,
  }
);

// Unique compound index for resume_id + user_id
layoutAnalysisSchema.index(
  { resume_id: 1, user_id: 1 },
  { unique: true, name: "unique_resume_user" }
);

// Export model
const LayoutAnalysis = mongoose.model("LayoutAnalysis", layoutAnalysisSchema);
export default LayoutAnalysis;