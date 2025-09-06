import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    query: { type: String, required: true },
    response: { type: String },
    responseTime: { type: Number }, // in milliseconds
    success: { type: Boolean, default: true },
    errorMessage: { type: String },
    aiModel: { type: String, default: "gemini" },
    tokensUsed: { type: Number },
    sessionId: { type: String, index: true },
    queryType: {
      type: String,
      enum: ["chat", "search", "resource"],
      default: "chat",
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      location: String,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ userId: 1, createdAt: -1 });
AnalyticsSchema.index({ success: 1, createdAt: -1 });

export type AnalyticsDoc = InferSchemaType<typeof AnalyticsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (models.Analytics as mongoose.Model<AnalyticsDoc>) ||
  model<AnalyticsDoc>("Analytics", AnalyticsSchema);
