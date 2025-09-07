require('dotenv').config({ path: '.env.local' });
const { analyzeCareerPath } = require('./src/app/lib/gemini.ts');

// Sample quiz data for testing
const sampleQuizData = {
  // Academic Interests
  subjectEnjoyment: ["Mathematics", "Science"],
  favoriteTopics: ["Technology", "Problem Solving"],
  learningStyle: "Hands-on learning",
  academicStrength: "Analytical thinking",

  // Personal Interests
  hobbiesPassions: ["Programming", "Gaming", "Reading"],
  excitingActivities: ["Solving puzzles", "Building things", "Learning new technologies"],
  freeDayChoice: "Working on personal projects",
  curiousIndustries: ["Technology", "Software Development"],

  // Work Preferences
  workStyle: "Independent work",
  taskPreference: "Complex problem-solving",
  stressHandling: "Break down into smaller tasks",
  workEnvironment: "Quiet office or remote",

  // Values & Goals
  careerPriorities: ["Innovation", "Learning opportunities", "Good salary"],
  locationFlexibility: 4,
  careerDepth: "Become an expert in one field",

  // Future Vision
  tenYearVision: "Leading innovative technology projects",
  currentCareerIdeas: "Software Developer, Data Scientist",
  explorationOpenness: "Very open to new possibilities",

  // Additional insights
  competitiveExams: "Planning to take technical certifications",
  publicSpeaking: "Comfortable with small groups",
  thinkingStyle: "Logical and systematic",
  primaryMotivation: "Solving complex problems",
  roleModels: "Tech innovators and entrepreneurs",

  userId: "test-user",
  createdAt: new Date()
};

async function testAnalysis() {
  try {
    console.log('🧪 Testing AI career analysis...');
    console.log('📝 Sample quiz data:', JSON.stringify(sampleQuizData, null, 2));
    
    const analysis = await analyzeCareerPath(sampleQuizData);
    
    console.log('✅ AI Analysis Result:');
    console.log(JSON.stringify(analysis, null, 2));
    
    console.log('\n🎯 Top Career Path:');
    console.log(`Title: ${analysis.topCareerPath.title}`);
    console.log(`Confidence: ${analysis.topCareerPath.confidence}%`);
    console.log(`Description: ${analysis.topCareerPath.description}`);
    
    console.log('\n🏢 Domain Fit:');
    console.log(`Primary Domain: ${analysis.domainFit.primaryDomain}`);
    console.log(`Fit Percentage: ${analysis.domainFit.fitPercentage}%`);
    
    console.log('\n💡 Why It Fits:');
    analysis.whyItFits.forEach((reason, index) => {
      console.log(`${index + 1}. ${reason}`);
    });
    
    console.log('\n🚀 Alternative Careers:');
    analysis.alternativeCareers.forEach((career, index) => {
      console.log(`${index + 1}. ${career.title} (${career.confidence}% confidence)`);
      console.log(`   ${career.description}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing analysis:', error);
    console.error('Stack:', error.stack);
  }
}

testAnalysis();
