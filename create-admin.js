#!/usr/bin/env node

/**
 * Script to create an admin user for testing
 * Run with: node create-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

// User model (simplified for this script)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String }, // In production, this should be hashed
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

const User = mongoose.model("User", UserSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hackelite",
      {
        dbName: process.env.MONGODB_DB || "hackelite",
      }
    );

    console.log("✅ Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@hackelite.com" });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      console.log("📧 Email: admin@hackelite.com");
      console.log("🔑 Password: admin123");
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: "admin@hackelite.com",
      name: "System Administrator",
      role: "admin",
      password: "admin123", // In production, hash this password
      banned: false,
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@hackelite.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: admin");
    console.log("");
    console.log("🚀 You can now login at: http://localhost:3001/admin-login");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
