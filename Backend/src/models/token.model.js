import mongoose from "mongoose";

// Token Schema
const tokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    token: {
      type: String,
      required: [true, "Token string is required"],
      unique: true, // ensures uniqueness
      index: true,
    },
    type: {
      type: String,
      required: [true, "Token type is required"], // e.g., "email_verification", "password_reset"
    },
    expires_at: {
      type: Date,
      required: [true, "Expiration date is required"],
      index: { expires: 0 }, // TTL index → auto-delete document
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Static method to handle unique index errors
tokenSchema.statics.handleDuplicateKeyError = (err) => {
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue).join(", ");
    return new Error(`Duplicate token entry detected for field(s): ${key}`);
  }
  return err;
};

// Export model
const Token = mongoose.model("Token", tokenSchema);
export default Token;