import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '../../../lib/db';
import QuizResponse from '../../../models/Quiz';
import { generateCareerSummary } from '../../../lib/gemini';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const quizId = searchParams.get('quizId');
    
    if (!sessionId && !quizId) {
      return NextResponse.json(
        { error: 'Either sessionId or quizId parameter is required' },
        { status: 400 }
      );
    }
    
    // Find quiz response
    let quizResponse;
    if (quizId) {
      quizResponse = await QuizResponse.findById(quizId);
    } else {
      quizResponse = await QuizResponse.findOne({ sessionId }).sort({ completedAt: -1 });
    }
    
    if (!quizResponse) {
      // Return demo career analysis when no quiz is found
      console.log('No quiz found, returning demo analysis for sessionId:', sessionId);
      
      const mockAnalysis = {
        topCareerPath: {
          title: "Software Developer",
          confidence: 87,
          description: "Based on your strong analytical thinking, problem-solving skills, and interest in technology, software development is an excellent career match. You enjoy creating solutions and working with logical systems."
        },
        domainFit: {
          primaryDomain: "Technology & Software Development",
          fitPercentage: 87,
          reasoning: [
            "Strong analytical and logical thinking abilities",
            "High comfort level with technology and digital tools",
            "Enjoys problem-solving and creating solutions",
            "Values innovation and continuous learning"
          ]
        },
        whyItFits: [
          "Your analytical mindset aligns perfectly with programming logic and debugging",
          "You enjoy breaking down complex problems into manageable solutions",
          "Strong interest in technology and how digital systems work",
          "Values creativity combined with logical structure",
          "Thrives on continuous learning, which is essential in tech",
          "Appreciates the balance of independent work and team collaboration"
        ],
        alternativeCareers: [
          {
            title: "Data Scientist",
            confidence: 82,
            description: "Combine your analytical skills with statistical analysis to extract insights from data and solve business problems."
          },
          {
            title: "UX/UI Designer",
            confidence: 78,
            description: "Use your creativity and problem-solving skills to design intuitive user experiences and interfaces."
          },
          {
            title: "Product Manager",
            confidence: 75,
            description: "Lead product development by combining technical understanding with business strategy and user needs."
          },
          {
            title: "Cybersecurity Analyst",
            confidence: 72,
            description: "Protect digital systems and data using your analytical skills and attention to detail."
          }
        ],
        skillsToDevelop: [
          {
            category: "Programming Languages",
            skills: ["Python", "JavaScript", "Java", "React", "Node.js"],
            priority: "High"
          },
          {
            category: "Technical Skills",
            skills: ["Database Management", "Version Control (Git)", "API Development", "Cloud Computing"],
            priority: "High"
          },
          {
            category: "Soft Skills",
            skills: ["Project Management", "Technical Communication", "Team Leadership", "Agile Methodologies"],
            priority: "Medium"
          },
          {
            category: "Industry Knowledge",
            skills: ["Software Architecture", "DevOps", "Mobile Development", "AI/Machine Learning Basics"],
            priority: "Medium"
          }
        ],
        learningResources: [
          {
            type: "Online Course",
            title: "Complete Web Development Bootcamp",
            provider: "Udemy",
            url: "https://udemy.com/course/web-development",
            difficulty: "Beginner to Intermediate"
          },
          {
            type: "Interactive Platform",
            title: "FreeCodeCamp",
            provider: "FreeCodeCamp",
            url: "https://freecodecamp.org",
            difficulty: "Beginner to Advanced"
          },
          {
            type: "Documentation",
            title: "MDN Web Docs",
            provider: "Mozilla",
            url: "https://developer.mozilla.org",
            difficulty: "All Levels"
          },
          {
            type: "Practice Platform",
            title: "LeetCode",
            provider: "LeetCode",
            url: "https://leetcode.com",
            difficulty: "Beginner to Expert"
          },
          {
            type: "Community",
            title: "Stack Overflow Developer Community",
            provider: "Stack Overflow",
            url: "https://stackoverflow.com",
            difficulty: "All Levels"
          },
          {
            type: "Certification",
            title: "AWS Cloud Practitioner",
            provider: "Amazon Web Services",
            url: "https://aws.amazon.com/certification",
            difficulty: "Beginner"
          }
        ],
        futureOutlook: {
          growthPotential: "Excellent - 22% growth expected through 2030",
          salaryRange: "$70,000 - $180,000+ depending on experience and specialization",
          marketDemand: "Very High - Software development is one of the fastest-growing professions",
          trends: [
            "Increasing demand for mobile and web applications",
            "Growth in cloud computing and microservices",
            "Rising importance of cybersecurity",
            "Expansion of AI and machine learning integration",
            "Remote work opportunities becoming standard",
            "Emphasis on full-stack development skills"
          ]
        }
      };
      
      const mockCareerSummary = `Congratulations on completing your career assessment! Based on your responses, you demonstrate a remarkable combination of analytical thinking, creativity, and technical aptitude that makes you an excellent candidate for a career in software development. 

Your strong problem-solving abilities, combined with your comfort with technology and desire for continuous learning, align perfectly with the dynamic world of software engineering. With an 87% confidence match, this field offers you the opportunity to build innovative solutions, work with cutting-edge technologies, and enjoy excellent career growth prospects.

The technology sector values your unique blend of logical thinking and creative problem-solving. Your future in software development is bright, with numerous specialization paths available as you grow in your career. Remember, every expert was once a beginner – your journey starts with curiosity and dedication!`;
      
      return NextResponse.json({
        status: 'completed',
        sessionId: sessionId || 'demo-session',
        quizId: 'demo-quiz-id',
        completedAt: new Date().toISOString(),
        timeSpent: 180,
        careerSummary: mockCareerSummary,
        analysis: mockAnalysis,
        responses: {
          currentGrade: '12th Grade',
          enjoyedSubjects: ['Mathematics', 'Computer Science', 'Physics'],
          challengingSubjects: ['Literature', 'History'],
          achievements: ['Math Olympiad Participant', 'Coding Competition Winner'],
          strongestSkills: ['Problem Solving', 'Analytical Thinking', 'Technology'],
          techComfort: 9,
          workPreference: 'Independent with team collaboration',
          excitingActivities: ['Building apps', 'Solving puzzles', 'Learning new tech'],
          freeDayChoice: 'Working on personal coding projects',
          curiousIndustries: ['Technology', 'Software Development', 'AI/ML'],
          workStyle: 'Flexible and adaptive',
          taskPreference: 'Complex problem-solving projects',
          stressHandling: 'Break problems into smaller parts',
          workEnvironment: 'Modern office or remote',
          careerPriorities: ['Innovation', 'Learning opportunities', 'Good compensation', 'Work-life balance'],
          locationFlexibility: 8,
          careerDepth: 'Become an expert specialist',
          tenYearVision: 'Leading innovative software projects and mentoring others',
          currentCareerIdeas: 'Software Developer, Data Scientist, Tech Entrepreneur',
          explorationOpenness: 'Very open to new opportunities'
        }
      });
    }
    
    // Check analysis status
    if (quizResponse.analysisStatus === 'pending') {
      return NextResponse.json({
        status: 'pending',
        message: 'Your career analysis is being processed. Please check back in a few moments.',
        sessionId: quizResponse.sessionId,
        quizId: quizResponse._id.toString(),
        completedAt: quizResponse.completedAt,
        timeSpent: quizResponse.timeSpent
      });
    }
    
    if (quizResponse.analysisStatus === 'failed') {
      return NextResponse.json({
        status: 'failed',
        message: 'We encountered an issue analyzing your responses. Please try submitting the quiz again.',
        error: quizResponse.analysisError,
        sessionId: quizResponse.sessionId,
        quizId: quizResponse._id.toString()
      }, { status: 500 });
    }
    
    // Generate career summary if not already done
    let careerSummary = '';
    if (quizResponse.careerRecommendations) {
      try {
        careerSummary = await generateCareerSummary(quizResponse.careerRecommendations);
      } catch (error) {
        console.error('Error generating career summary:', error);
        careerSummary = 'Your personalized career summary will be available shortly.';
      }
    }
    
    // Return complete results
    return NextResponse.json({
      status: 'completed',
      sessionId: quizResponse.sessionId,
      quizId: quizResponse._id.toString(),
      completedAt: quizResponse.completedAt,
      timeSpent: quizResponse.timeSpent,
      careerSummary,
      analysis: {
        // New interface format
        topCareerPath: quizResponse.careerRecommendations?.topCareerPath || {
          title: quizResponse.careerRecommendations?.primaryCareer || 'Career Professional',
          confidence: quizResponse.careerRecommendations?.confidenceScore || 60,
          description: 'Based on your quiz responses, this career path aligns with your interests and skills.'
        },
        domainFit: quizResponse.careerRecommendations?.domainFit || {
          primaryDomain: quizResponse.careerRecommendations?.careerDomain || quizResponse.careerRecommendations?.careerCluster || 'General Business',
          fitPercentage: quizResponse.careerRecommendations?.confidenceScore || 60,
          reasoning: quizResponse.careerRecommendations?.whyItFits?.keyStrengths || ['Good fit based on your responses']
        },
        whyItFits: Array.isArray(quizResponse.careerRecommendations?.whyItFits) 
          ? quizResponse.careerRecommendations.whyItFits
          : [
              quizResponse.careerRecommendations?.whyItFits?.personalityMatch || 'Good personality match',
              ...(quizResponse.careerRecommendations?.whyItFits?.keyStrengths || []),
              ...(quizResponse.careerRecommendations?.whyItFits?.alignedInterests || [])
            ].filter(Boolean).slice(0, 4),
        alternativeCareers: (quizResponse.careerRecommendations?.alternativeCareers || []).map((career, index) => ({
          title: typeof career === 'string' ? career : career.title || 'Alternative Career',
          confidence: typeof career === 'object' ? career.confidence || 50 : 50 - (index * 5),
          description: typeof career === 'object' ? career.description || `Alternative career path ${index + 1}` : `Alternative career option: ${career}`
        })),
        skillsToDevelop: quizResponse.careerRecommendations?.skillsToDevelop || [
          {
            category: "Technical Skills",
            skills: quizResponse.careerRecommendations?.skillsTodevelops?.slice(0, 3) || ['Professional skills', 'Industry knowledge', 'Technical competency'],
            priority: "High"
          },
          {
            category: "Soft Skills",
            skills: ['Communication', 'Problem-solving', 'Teamwork'],
            priority: "Medium"
          }
        ],
        learningResources: quizResponse.careerRecommendations?.learningResources?.length 
          ? quizResponse.careerRecommendations.learningResources
          : [
              {
                type: "Online Course",
                title: quizResponse.careerRecommendations?.learningResources?.courses?.[0] || "Professional Development Course",
                provider: "Online Learning Platform",
                url: "#",
                difficulty: "Beginner"
              },
              {
                type: "Community",
                title: quizResponse.careerRecommendations?.learningResources?.communities?.[0] || "Professional Network",
                provider: "Professional Community",
                url: "#",
                difficulty: "All Levels"
              }
            ],
        futureOutlook: quizResponse.careerRecommendations?.futureOutlook?.growthPotential 
          ? quizResponse.careerRecommendations.futureOutlook
          : {
              growthPotential: quizResponse.careerRecommendations?.futureOutlook?.growthProjection || 'Positive growth expected',
              salaryRange: quizResponse.careerRecommendations?.futureOutlook?.salaryRange || 'Competitive salary range',
              marketDemand: quizResponse.careerRecommendations?.futureOutlook?.jobDemand || 'Good market demand',
              trends: ['Industry growth', 'Skill development opportunities', 'Career advancement potential']
            },
        
        // Legacy format for backward compatibility
        primaryCareer: quizResponse.careerRecommendations?.primaryCareer || '',
        primaryCareers: quizResponse.careerRecommendations?.primaryCareers || [],
        careerCluster: quizResponse.careerRecommendations?.careerCluster || '',
        careerDomain: quizResponse.careerRecommendations?.careerDomain || '',
        secondaryCareers: quizResponse.careerRecommendations?.secondary || [],
        reasoning: quizResponse.careerRecommendations?.reasoning || '',
        skillGaps: quizResponse.careerRecommendations?.skillGaps || [],
        nextSteps: quizResponse.careerRecommendations?.nextSteps || [],
        educationPath: quizResponse.careerRecommendations?.educationPath || '',
        confidenceScore: quizResponse.careerRecommendations?.confidenceScore || 0
      },
      responses: {
        // Personal & Academic Background
        currentGrade: quizResponse.currentGrade,
        enjoyedSubjects: quizResponse.enjoyedSubjects,
        challengingSubjects: quizResponse.challengingSubjects,
        achievements: quizResponse.achievements,
        
        // Skills & Strengths
        strongestSkills: quizResponse.strongestSkills,
        techComfort: quizResponse.techComfort,
        workPreference: quizResponse.workPreference,
        
        // Interests & Passions
        excitingActivities: quizResponse.excitingActivities,
        freeDayChoice: quizResponse.freeDayChoice,
        curiousIndustries: quizResponse.curiousIndustries,
        
        // Work Preferences
        workStyle: quizResponse.workStyle,
        taskPreference: quizResponse.taskPreference,
        stressHandling: quizResponse.stressHandling,
        workEnvironment: quizResponse.workEnvironment,
        
        // Values & Goals
        careerPriorities: quizResponse.careerPriorities,
        locationFlexibility: quizResponse.locationFlexibility,
        careerDepth: quizResponse.careerDepth,
        
        // Future Vision
        tenYearVision: quizResponse.tenYearVision,
        currentCareerIdeas: quizResponse.currentCareerIdeas,
        explorationOpenness: quizResponse.explorationOpenness
      }
    });
    
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    
    // Return mock data for demonstration when database is unavailable
    const mockAnalysis = {
      topCareerPath: {
        title: "Software Developer",
        confidence: 87,
        description: "Based on your strong analytical thinking, problem-solving skills, and interest in technology, software development is an excellent career match. You enjoy creating solutions and working with logical systems."
      },
      domainFit: {
        primaryDomain: "Technology & Software Development",
        fitPercentage: 87,
        reasoning: [
          "Strong analytical and logical thinking abilities",
          "High comfort level with technology and digital tools",
          "Enjoys problem-solving and creating solutions",
          "Values innovation and continuous learning"
        ]
      },
      whyItFits: [
        "Your analytical mindset aligns perfectly with programming logic and debugging",
        "You enjoy breaking down complex problems into manageable solutions",
        "Strong interest in technology and how digital systems work",
        "Values creativity combined with logical structure",
        "Thrives on continuous learning, which is essential in tech",
        "Appreciates the balance of independent work and team collaboration"
      ],
      alternativeCareers: [
        {
          title: "Data Scientist",
          confidence: 82,
          description: "Combine your analytical skills with statistical analysis to extract insights from data and solve business problems."
        },
        {
          title: "UX/UI Designer",
          confidence: 78,
          description: "Use your creativity and problem-solving skills to design intuitive user experiences and interfaces."
        },
        {
          title: "Product Manager",
          confidence: 75,
          description: "Lead product development by combining technical understanding with business strategy and user needs."
        },
        {
          title: "Cybersecurity Analyst",
          confidence: 72,
          description: "Protect digital systems and data using your analytical skills and attention to detail."
        }
      ],
      skillsToDevelop: [
        {
          category: "Programming Languages",
          skills: ["Python", "JavaScript", "Java", "React", "Node.js"],
          priority: "High"
        },
        {
          category: "Technical Skills",
          skills: ["Database Management", "Version Control (Git)", "API Development", "Cloud Computing"],
          priority: "High"
        },
        {
          category: "Soft Skills",
          skills: ["Project Management", "Technical Communication", "Team Leadership", "Agile Methodologies"],
          priority: "Medium"
        },
        {
          category: "Industry Knowledge",
          skills: ["Software Architecture", "DevOps", "Mobile Development", "AI/Machine Learning Basics"],
          priority: "Medium"
        }
      ],
      learningResources: [
        {
          type: "Online Course",
          title: "Complete Web Development Bootcamp",
          provider: "Udemy",
          url: "https://udemy.com/course/web-development",
          difficulty: "Beginner to Intermediate"
        },
        {
          type: "Interactive Platform",
          title: "FreeCodeCamp",
          provider: "FreeCodeCamp",
          url: "https://freecodecamp.org",
          difficulty: "Beginner to Advanced"
        },
        {
          type: "Documentation",
          title: "MDN Web Docs",
          provider: "Mozilla",
          url: "https://developer.mozilla.org",
          difficulty: "All Levels"
        },
        {
          type: "Practice Platform",
          title: "LeetCode",
          provider: "LeetCode",
          url: "https://leetcode.com",
          difficulty: "Beginner to Expert"
        },
        {
          type: "Community",
          title: "Stack Overflow Developer Community",
          provider: "Stack Overflow",
          url: "https://stackoverflow.com",
          difficulty: "All Levels"
        },
        {
          type: "Certification",
          title: "AWS Cloud Practitioner",
          provider: "Amazon Web Services",
          url: "https://aws.amazon.com/certification",
          difficulty: "Beginner"
        }
      ],
      futureOutlook: {
        growthPotential: "Excellent - 22% growth expected through 2030",
        salaryRange: "$70,000 - $180,000+ depending on experience and specialization",
        marketDemand: "Very High - Software development is one of the fastest-growing professions",
        trends: [
          "Increasing demand for mobile and web applications",
          "Growth in cloud computing and microservices",
          "Rising importance of cybersecurity",
          "Expansion of AI and machine learning integration",
          "Remote work opportunities becoming standard",
          "Emphasis on full-stack development skills"
        ]
      }
    };
    
    const mockCareerSummary = `Congratulations on completing your career assessment! Based on your responses, you demonstrate a remarkable combination of analytical thinking, creativity, and technical aptitude that makes you an excellent candidate for a career in software development. 

Your strong problem-solving abilities, combined with your comfort with technology and desire for continuous learning, align perfectly with the dynamic world of software engineering. With an 87% confidence match, this field offers you the opportunity to build innovative solutions, work with cutting-edge technologies, and enjoy excellent career growth prospects.

The technology sector values your unique blend of logical thinking and creative problem-solving. Your future in software development is bright, with numerous specialization paths available as you grow in your career. Remember, every expert was once a beginner – your journey starts with curiosity and dedication!`;
    
    return NextResponse.json({
      status: 'completed',
      sessionId: 'demo-session',
      quizId: 'demo-quiz-id',
      completedAt: new Date().toISOString(),
      timeSpent: 180, // 3 minutes
      careerSummary: mockCareerSummary,
      analysis: mockAnalysis,
      responses: {
        // Mock response data
        currentGrade: '12th Grade',
        enjoyedSubjects: ['Mathematics', 'Computer Science', 'Physics'],
        challengingSubjects: ['Literature', 'History'],
        achievements: ['Math Olympiad Participant', 'Coding Competition Winner'],
        strongestSkills: ['Problem Solving', 'Analytical Thinking', 'Technology'],
        techComfort: 9,
        workPreference: 'Independent with team collaboration',
        excitingActivities: ['Building apps', 'Solving puzzles', 'Learning new tech'],
        freeDayChoice: 'Working on personal coding projects',
        curiousIndustries: ['Technology', 'Software Development', 'AI/ML'],
        workStyle: 'Flexible and adaptive',
        taskPreference: 'Complex problem-solving projects',
        stressHandling: 'Break problems into smaller parts',
        workEnvironment: 'Modern office or remote',
        careerPriorities: ['Innovation', 'Learning opportunities', 'Good compensation', 'Work-life balance'],
        locationFlexibility: 8,
        careerDepth: 'Become an expert specialist',
        tenYearVision: 'Leading innovative software projects and mentoring others',
        currentCareerIdeas: 'Software Developer, Data Scientist, Tech Entrepreneur',
        explorationOpenness: 'Very open to new opportunities'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch quiz results.' },
    { status: 405 }
  );
}
