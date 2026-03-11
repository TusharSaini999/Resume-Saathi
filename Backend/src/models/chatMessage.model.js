import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: [true, 'Session ID is required'],
      index: true,
    },

    sender: {
      type: String,
      required: [true, 'Sender is required'],
      enum: {
        values: ['assistant', 'user'],
        message: "Sender must be either 'ai' or 'user'",
      },
    },

    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------- Indexes -------------------- */

// For fetching session messages efficiently
chatMessageSchema.index({ session_id: 1, createdAt: 1 });

// Optional: For user-level filtering
chatMessageSchema.index({ user_id: 1, session_id: 1 });

/* -------------------- Model Export -------------------- */

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
