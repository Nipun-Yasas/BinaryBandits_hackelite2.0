const axios = require('axios');

async function testQuizSubmission() {
  const sampleQuizData = {
    // Academic Interests
    currentGrade: '12th Grade',
    subjectEnjoyment: ['Mathematics', 'Computer Science'],
    favoriteTopics: ['Technology', 'Problem Solving'],
    learningStyle: 'Hands-on learning',
    academicStrength: 'Analytical thinking',

    // Personal Interests  
    hobbiesPassions: ['Programming', 'Gaming'],
    excitingActivities: ['Building software', 'Solving puzzles'],
    freeDayChoice: 'Working on coding projects',
    curiousIndustries: ['Technology', 'Software Development'],

    // Work Preferences
    workStyle: 'Independent with collaboration',
    taskPreference: 'Complex problem-solving',
    stressHandling: 'Break into smaller tasks',
    workEnvironment: 'Modern office or remote',

    // Values & Goals
    careerPriorities: ['Innovation', 'Learning', 'Good salary'],
    locationFlexibility: 8,
    careerDepth: 'Expert in specialty',

    // Future Vision
    tenYearVision: 'Leading tech projects',
    currentCareerIdeas: 'Software Developer',
    explorationOpenness: 'Very open',

    // Additional
    competitiveExams: 'Tech certifications',
    publicSpeaking: 'Comfortable',
    thinkingStyle: 'Logical',
    primaryMotivation: 'Problem solving',
    roleModels: 'Tech leaders'
  };

  try {
    console.log('🚀 Submitting quiz...');
    
    // Submit quiz
    const submitResponse = await axios.post('http://localhost:3000/api/quiz/submit', sampleQuizData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Quiz submitted successfully!');
    console.log('📋 Response:', submitResponse.data);

    if (submitResponse.data.sessionId) {
      console.log(`🔗 Results URL: http://localhost:3000/quiz-results?sessionId=${submitResponse.data.sessionId}`);
      
      // Wait a moment then fetch results
      console.log('⏳ Waiting 3 seconds for analysis...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const resultsResponse = await axios.get(`http://localhost:3000/api/quiz/results?sessionId=${submitResponse.data.sessionId}`);
      
      console.log('📊 Career Analysis Results:');
      console.log('Status:', resultsResponse.data.status);
      
      if (resultsResponse.data.analysis) {
        console.log('🎯 Top Career:', resultsResponse.data.analysis.topCareerPath?.title);
        console.log('📈 Confidence:', resultsResponse.data.analysis.topCareerPath?.confidence + '%');
        console.log('🏢 Domain:', resultsResponse.data.analysis.domainFit?.primaryDomain);
        console.log('🔄 Alternatives:', resultsResponse.data.analysis.alternativeCareers?.length + ' career options');
        console.log('📚 Learning Resources:', resultsResponse.data.analysis.learningResources?.length + ' resources');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testQuizSubmission();
