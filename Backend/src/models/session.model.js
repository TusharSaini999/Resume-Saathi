import mongoose from "mongoose";

// Session Schema
const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    token: {
      type: String,
      required: [true, "Session token is required"],
    },
    browser: {
      type: String,
      required: [true, "Browser info is required"],
    },
    os: {
      type: String,
      required: [true, "Operating system info is required"],
    },
    device_name: {
      type: String,
      required: [true, "Device name is required"],
    },
    ip_address: {
      type: String,
      required: [true, "IP address is required"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    expires_at: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Instance method: returns true if session is active, false if expired or inactive
sessionSchema.methods.isSessionActive = function () {
  if (!this.is_active || new Date() > this.expires_at) {
    this.is_active = false;
    this.save().catch(() => {});
    return false;
  }
  return true;
};

// Export model
const Session = mongoose.model("Session", sessionSchema);
export default Session;