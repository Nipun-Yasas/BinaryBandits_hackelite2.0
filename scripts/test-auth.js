// Simple test file to verify authentication endpoints
// Run this with: node scripts/test-auth.js

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpass123";
const TEST_NAME = "Test User";
const BASE_URL = "http://localhost:3000";

async function testSignup() {
  console.log("🧪 Testing Signup...");
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_NAME,
        role: "learner",
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Signup successful:", data);
      return true;
    } else {
      console.log("❌ Signup failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    return false;
  }
}

async function testLogin() {
  console.log("🧪 Testing Login...");
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Login successful:", data);
      return true;
    } else {
      console.log("❌ Login failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return false;
  }
}

async function testCurrentUser() {
  console.log("🧪 Testing Current User...");
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Current user:", data);
      return true;
    } else {
      console.log("❌ Get current user failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Get current user error:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Starting Authentication Tests...\n");
  
  // Test signup (might fail if user already exists)
  await testSignup();
  console.log();
  
  // Test login
  await testLogin();
  console.log();
  
  // Test getting current user
  await testCurrentUser();
  console.log();
  
  console.log("🏁 Tests completed!");
}

// Run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSignup, testLogin, testCurrentUser };
