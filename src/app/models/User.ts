import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: false },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    banned: { type: Boolean, default: false },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    providerId: { type: String },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default (models.User as mongoose.Model<UserDoc>) || model<UserDoc>("User", UserSchema);
