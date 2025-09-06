import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const SystemHealthSchema = new Schema(
  {
    metricType: {
      type: String,
      enum: [
        "api_usage",
        "error_rate",
        "response_time",
        "memory_usage",
        "cpu_usage",
      ],
      required: true,
      index: true,
    },
    value: { type: Number, required: true },
    unit: { type: String, default: "count" }, // count, ms, percentage, MB, etc.
    service: { type: String, default: "gemini_api" },
    endpoint: { type: String },
    status: {
      type: String,
      enum: ["healthy", "warning", "critical"],
      default: "healthy",
    },
    metadata: {
      requestCount: Number,
      errorCount: Number,
      averageResponseTime: Number,
      uptime: Number,
    },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Indexes for efficient queries
SystemHealthSchema.index({ metricType: 1, timestamp: -1 });
SystemHealthSchema.index({ status: 1, timestamp: -1 });
SystemHealthSchema.index({ timestamp: -1 });

export type SystemHealthDoc = InferSchemaType<typeof SystemHealthSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (models.SystemHealth as mongoose.Model<SystemHealthDoc>) ||
  model<SystemHealthDoc>("SystemHealth", SystemHealthSchema);
