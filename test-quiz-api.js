const axios = require('axios');

async function testQuizAPI() {
  const testData = {
    // Required fields
    currentGrade: "12th Grade",
    enjoyedSubjects: ["Mathematics", "Computer Science"],
    strongestSkills: ["Problem Solving", "Analytical Thinking"],
    techComfort: 4,
    workPreference: "Independent work",
    excitingActivities: ["Building software", "Solving puzzles"],
    freeDayChoice: "Working on projects",
    workStyle: "Flexible",
    taskPreference: "Complex problems",
    stressHandling: "Break into steps",
    workEnvironment: "Modern office",
    careerPriorities: ["Innovation", "Learning", "Growth"],
    locationFlexibility: 4,
    careerDepth: "Specialist",
    tenYearVision: "Leading tech projects",
    explorationOpenness: "Very open",
    
    // Optional fields
    challengingSubjects: ["Literature"],
    achievements: "Academic awards",
    curiousIndustries: ["Technology", "Software"],
    currentCareerIdeas: "Software Developer",
    competitiveExams: "None",
    publicSpeaking: "Comfortable",
    thinkingStyle: "Logical",
    primaryMotivation: "Problem solving",
    roleModels: "Tech leaders",
    timeSpent: 300
  };

  try {
    console.log('🧪 Testing Quiz API...');
    console.log('📡 Sending POST request to http://localhost:3000/api/quiz/submit');
    
    const response = await axios.post('http://localhost:3000/api/quiz/submit', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Success!');
    console.log('📊 Response Status:', response.status);
    console.log('📄 Response Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Error testing quiz API:');
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📄 Response:', error.response.data);
    } else if (error.request) {
      console.error('📡 Network Error - No response received');
      console.error('Request details:', error.message);
    } else {
      console.error('⚙️ Setup Error:', error.message);
    }
  }
}

testQuizAPI();
