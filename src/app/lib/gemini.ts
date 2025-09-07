import { GoogleGenerativeAI } from '@google/generative-ai';
import { IQuizResponse } from '../models/Quiz';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface CareerAnalysis {
  // Top career recommendation
  topCareerPath: {
    title: string;
    confidence: number;
    description: string;
  };
  
  // Domain fit analysis
  domainFit: {
    primaryDomain: string;
    fitPercentage: number;
    reasoning: string[];
  };
  
  // Why this career fits
  whyItFits: string[];
  
  // Alternative career options
  alternativeCareers: Array<{
    title: string;
    confidence: number;
    description: string;
  }>;
  
  // Skills development
  skillsToDevelop: Array<{
    category: string;
    skills: string[];
    priority: string;
  }>;
  
  // Learning resources
  learningResources: Array<{
    type: string;
    title: string;
    provider: string;
    url: string;
    difficulty: string;
  }>;
  
  // Future outlook
  futureOutlook: {
    growthPotential: string;
    salaryRange: string;
    marketDemand: string;
    trends: string[];
  };
}

export async function analyzeCareerPath(quizData: IQuizResponse): Promise<CareerAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are an expert career counselor with 20+ years of experience. Analyze the following career assessment data and provide comprehensive career recommendations following the specific format requested.

QUIZ RESPONSES:
Academic Background:
- Current Grade: ${quizData.currentGrade}
- Enjoyed Subjects: ${quizData.enjoyedSubjects.join(', ')}
- Challenging Subjects: ${quizData.challengingSubjects?.join(', ') || 'None specified'}
- Achievements: ${quizData.achievements || 'None specified'}

Skills & Strengths:
- Strongest Skills: ${quizData.strongestSkills.join(', ')}
- Tech Comfort Level: ${quizData.techComfort}/5
- Work Preference: ${quizData.workPreference}

Interests & Passions:
- Exciting Activities: ${quizData.excitingActivities.join(', ')}
- Ideal Free Day: ${quizData.freeDayChoice}
- Industries of Interest: ${quizData.curiousIndustries?.join(', ') || 'None specified'}

Work Preferences:
- Work Style: ${quizData.workStyle}
- Task Preference: ${quizData.taskPreference}
- Stress Handling: ${quizData.stressHandling}
- Work Environment: ${quizData.workEnvironment}

Values & Goals:
- Career Priorities: ${quizData.careerPriorities.join(', ')}
- Location Flexibility: ${quizData.locationFlexibility}/5
- Career Depth: ${quizData.careerDepth}

Future Vision:
- 10-Year Vision: ${quizData.tenYearVision}
- Current Career Ideas: ${quizData.currentCareerIdeas || 'None specified'}
- Exploration Openness: ${quizData.explorationOpenness}

Additional Insights:
- Competitive Exams: ${quizData.competitiveExams || 'Not specified'}
- Public Speaking: ${quizData.publicSpeaking || 'Not specified'}
- Thinking Style: ${quizData.thinkingStyle || 'Not specified'}
- Primary Motivation: ${quizData.primaryMotivation || 'Not specified'}
- Role Models: ${quizData.roleModels || 'None specified'}

INSTRUCTIONS:
Provide a detailed career analysis in the following JSON format. Be specific, practical, and encouraging:

{
  "primaryCareer": "Most suitable single career title",
  "primaryCareers": ["Career 1", "Career 2", "Career 3"],
  "careerCluster": "Main career cluster (e.g., STEM, Business, Arts & Design, Social Sciences, Entrepreneurship)",
  "careerDomain": "Specific domain within cluster",
  "whyItFits": {
    "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
    "alignedInterests": ["Interest 1", "Interest 2", "Interest 3"],
    "matchingValues": ["Value 1", "Value 2", "Value 3"],
    "personalityMatch": "Brief explanation of how their personality fits this career path"
  },
  "alternativeCareers": ["Alternative 1", "Alternative 2", "Alternative 3"],
  "skillsTodevelops": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "learningResources": {
    "courses": ["Course/Platform 1", "Course/Platform 2", "Course/Platform 3"],
    "communities": ["Community 1", "Community 2", "Community 3"],
    "practicalSteps": ["Step 1", "Step 2", "Step 3", "Step 4"]
  },
  "futureOutlook": {
    "growthProjection": "Specific growth percentage and timeframe",
    "jobDemand": "Current job market demand description",
    "salaryRange": "Expected salary range for this career path",
    "globalRelevance": "How globally relevant and future-proof this career is"
  },
  "secondary": ["Alternative Career 1", "Alternative Career 2"],
  "reasoning": "Detailed explanation connecting their quiz responses to recommendations (200-300 words)",
  "skillGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "educationPath": "Specific educational recommendations",
  "confidenceScore": 85
}

REQUIREMENTS:
- Primary career: The single best match based on assessment
- Career cluster: Choose from STEM, Business, Arts & Design, Social Sciences, Entrepreneurship, Healthcare, Education, or Public Service
- Why it fits: Connect specific quiz responses to career suggestions
- Skills to develop: 5 practical skills they should start building now
- Learning resources: Specific platforms, courses, and actionable steps
- Future outlook: Include realistic projections with numbers where possible
- Make recommendations age-appropriate for their current grade level
- Be encouraging and motivational while remaining realistic

Respond ONLY with the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove markdown formatting if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }
    
    console.log('Gemini AI raw response:', text.substring(0, 200) + '...');
    
    // Parse JSON response
    const analysis = JSON.parse(text);
    
    // Validate the response structure
    if (!analysis.primaryCareer || typeof analysis.primaryCareer !== 'string') {
      throw new Error('Invalid analysis format: missing primary career');
    }
    
    if (!analysis.careerCluster || typeof analysis.careerCluster !== 'string') {
      throw new Error('Invalid analysis format: missing career cluster');
    }
    
    if (!analysis.whyItFits || typeof analysis.whyItFits !== 'object') {
      throw new Error('Invalid analysis format: missing why it fits');
    }
    
    // Ensure all required fields exist with defaults
    analysis.primaryCareers = analysis.primaryCareers || [analysis.primaryCareer];
    analysis.careerDomain = analysis.careerDomain || analysis.careerCluster;
    analysis.alternativeCareers = analysis.alternativeCareers || [];
    analysis.skillsTodevelops = analysis.skillsTodevelops || [];
    analysis.learningResources = analysis.learningResources || { courses: [], communities: [], practicalSteps: [] };
    analysis.futureOutlook = analysis.futureOutlook || {
      growthProjection: "Positive growth expected",
      jobDemand: "Good demand in the market",
      salaryRange: "Competitive salary range",
      globalRelevance: "Globally relevant career path"
    };
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing career path:', error);
    
    // Provide comprehensive fallback analysis matching the new interface
    return {
      topCareerPath: {
        title: "Versatile Professional",
        confidence: 60,
        description: "Based on your responses, you show versatility and adaptability. A more detailed analysis will be available once our AI service is fully operational. Your interests and skills suggest multiple viable career paths."
      },
      domainFit: {
        primaryDomain: "Business & Technology",
        fitPercentage: 60,
        reasoning: ["Demonstrates adaptability", "Shows problem-solving orientation", "Indicates learning mindset"]
      },
      whyItFits: [
        "Your versatile nature makes you suitable for diverse professional roles",
        "Shows strong adaptability and problem-solving skills",
        "Demonstrates openness to learning and growth",
        "Indicates good communication and collaboration potential"
      ],
      alternativeCareers: [
        {
          title: "Project Manager",
          confidence: 55,
          description: "Coordinate teams and manage complex projects across various industries"
        },
        {
          title: "Business Analyst",
          confidence: 50,
          description: "Analyze business processes and recommend improvements"
        },
        {
          title: "Consultant",
          confidence: 48,
          description: "Provide expert advice and solutions to organizations"
        }
      ],
      skillsToDevelop: [
        {
          category: "Technical Skills",
          skills: ["Digital literacy", "Data analysis", "Industry-specific tools"],
          priority: "High"
        },
        {
          category: "Soft Skills", 
          skills: ["Communication", "Leadership", "Critical thinking"],
          priority: "High"
        },
        {
          category: "Business Skills",
          skills: ["Project management", "Strategic thinking", "Financial literacy"],
          priority: "Medium"
        }
      ],
      learningResources: [
        {
          type: "Online Course",
          title: "Business Fundamentals",
          provider: "Coursera",
          url: "https://coursera.org/business",
          difficulty: "Beginner"
        },
        {
          type: "Professional Network",
          title: "LinkedIn Learning Professional Skills",
          provider: "LinkedIn",
          url: "https://linkedin.com/learning",
          difficulty: "All Levels"
        },
        {
          type: "Certification",
          title: "Project Management Essentials",
          provider: "edX",
          url: "https://edx.org/project-management",
          difficulty: "Intermediate"
        }
      ],
      futureOutlook: {
        growthPotential: "Steady growth across multiple sectors",
        salaryRange: "Competitive compensation based on specialization",
        marketDemand: "Good demand for versatile professionals",
        trends: ["Remote work flexibility", "Cross-functional collaboration", "Continuous learning emphasis"]
      }
    };
  }
}

export async function generateCareerSummary(analysis: CareerAnalysis): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Handle both old and new interface formats
    const careerTitle = analysis.topCareerPath?.title || (analysis as any).primaryCareer || 'Career Professional';
    const confidence = analysis.topCareerPath?.confidence || (analysis as any).confidenceScore || 60;
    const domain = analysis.domainFit?.primaryDomain || (analysis as any).careerDomain || (analysis as any).careerCluster || 'Professional Field';
    const fitPercentage = analysis.domainFit?.fitPercentage || confidence;
    
    // Get reasons from either format
    let reasons: string[] = [];
    if (analysis.whyItFits && Array.isArray(analysis.whyItFits)) {
      reasons = analysis.whyItFits.slice(0, 3);
    } else if ((analysis as any).whyItFits?.keyStrengths) {
      const legacy = (analysis as any).whyItFits;
      reasons = [
        ...legacy.keyStrengths.slice(0, 2),
        ...legacy.alignedInterests.slice(0, 1)
      ].filter(Boolean);
    }
    
    const prompt = `
Create a personalized, encouraging career summary based on this analysis:

Primary Career: ${careerTitle}
Confidence: ${confidence}%
Domain Fit: ${domain} (${fitPercentage}% fit)
Key Reasons: ${reasons.length > 0 ? reasons.join(', ') : 'Strong alignment with interests and skills'}

Write a warm, motivating 2-3 paragraph summary that:
1. Congratulates them on completing the assessment
2. Highlights their key strengths and potential
3. Mentions their top career matches
4. Encourages them to explore these opportunities
5. Uses an optimistic, supportive tone

Keep it concise but inspiring, around 150-200 words.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
    
  } catch (error) {
    console.error('Error generating career summary:', error);
    // Fallback that works with both formats
    const careerTitle = analysis.topCareerPath?.title || (analysis as any).primaryCareer || 'a promising career path';
    const confidence = analysis.topCareerPath?.confidence || (analysis as any).confidenceScore || 60;
    return `Congratulations on completing your career assessment! Based on your responses, you have a unique combination of interests and skills that open up exciting career possibilities. Your top match is ${careerTitle} with a ${confidence}% confidence level, which aligns well with your preferences and strengths. We encourage you to explore this path further and remember that your career journey is unique to you. The future is full of opportunities, and you're well-positioned to find a fulfilling career path!`;
  }
}
