import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    session_title: {
      type: String,
      trim: true,
      maxlength: [120, "Session title cannot exceed 120 characters"],
      default: "New Chat Session",
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------- Indexes -------------------- */
chatSessionSchema.index({ user_id: 1, createdAt: 1 });

/* -------------------- Model Export -------------------- */
const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

export default ChatSession;