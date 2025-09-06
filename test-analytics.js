#!/usr/bin/env node

/**
 * Simple test script to verify analytics integration
 * Run with: node test-analytics.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
async function testConnection() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hackelite",
      {
        dbName: process.env.MONGODB_DB || "hackelite",
      }
    );
    console.log("✅ MongoDB connection successful");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// Test analytics collection
async function testAnalytics() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    console.log("📊 Available collections:", collectionNames);

    // Check if our models exist
    const expectedCollections = [
      "analytics",
      "useractivities",
      "chatsessions",
      "systemhealths",
      "users",
    ];
    const missingCollections = expectedCollections.filter(
      (col) => !collectionNames.includes(col)
    );

    if (missingCollections.length > 0) {
      console.log(
        "⚠️  Missing collections (will be created on first use):",
        missingCollections
      );
    } else {
      console.log("✅ All expected collections exist");
    }

    // Test a simple query
    const analyticsCount = await db.collection("analytics").countDocuments();
    console.log(`📈 Current analytics records: ${analyticsCount}`);
  } catch (error) {
    console.error("❌ Analytics test failed:", error.message);
  }
}

// Test environment variables
function testEnvironment() {
  console.log("🔧 Environment check:");

  const required = ["MONGODB_URI"];
  const optional = ["IRON_SESSION_PASSWORD", "GOOGLE_AI_API_KEY"];

  required.forEach((key) => {
    if (process.env[key]) {
      console.log(`  ✅ ${key}: Set`);
    } else {
      console.log(`  ❌ ${key}: Missing (required)`);
    }
  });

  optional.forEach((key) => {
    if (process.env[key]) {
      console.log(`  ✅ ${key}: Set`);
    } else {
      console.log(`  ⚠️  ${key}: Not set (optional)`);
    }
  });
}

// Main test function
async function runTests() {
  console.log("🚀 Starting HackElite Analytics Integration Test\n");

  testEnvironment();
  console.log("");

  await testConnection();
  await testAnalytics();

  console.log("\n✨ Test completed!");
  console.log("💡 Next steps:");
  console.log("   1. Start the development server: npm run dev");
  console.log("   2. Visit /admin to access the dashboard");
  console.log("   3. Use the chatbot to generate analytics data");

  await mongoose.disconnect();
}

runTests().catch(console.error);
