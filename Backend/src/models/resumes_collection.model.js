import mongoose from "mongoose";

const resumesCollectionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true, // ensures only one resume per user
    },
    resume_url: {
      type: String,
      required: [true, "Resume URL is required"],
    },
    parsed_data: {
      type: String,
      required: [true, "Parsed data is required"], // you can store JSON as string or use Mixed
    },
    raw_pdf_response: {
      type: String,
      required: [true, "Raw PDF response is required"], // original PDF content or metadata
    }
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
    strict: true, // no additional fields
  }
);

// Export model
const ResumesCollection = mongoose.model("ResumesCollection", resumesCollectionSchema);
export default ResumesCollection;