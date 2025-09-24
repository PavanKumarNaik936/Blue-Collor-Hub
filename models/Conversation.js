import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: String, required: true } // user IDs or usernames
    ],
    lastMessage: { type: String },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Ensure only one conversation exists between two users
ConversationSchema.index({ participants: 1 }, { unique: true });

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
export default Conversation;
