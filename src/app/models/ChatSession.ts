import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const ChatSessionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "New Chat" },
    messageCount: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    totalResponseTime: { type: Number, default: 0 }, // in milliseconds
    averageResponseTime: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastActivity: { type: Date, default: Date.now },
    topics: [{ type: String }], // AI-detected topics
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      location: String,
      deviceType: String,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ isActive: 1, lastActivity: -1 });
ChatSessionSchema.index({ createdAt: -1 });

export type ChatSessionDoc = InferSchemaType<typeof ChatSessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (models.ChatSession as mongoose.Model<ChatSessionDoc>) ||
  model<ChatSessionDoc>("ChatSession", ChatSessionSchema);
