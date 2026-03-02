import mongoose from "mongoose";

// Token Schema
const tokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true, // "email_verification", "password_reset"
    },
    email_verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 }, // <-- TTL index for auto-delete
    },
  },
  {
    collection: "token",
    timestamps: true,
    strict: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;