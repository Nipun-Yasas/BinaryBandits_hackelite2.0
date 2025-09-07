import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '../../../lib/db';
import QuizResponse from '../../../models/Quiz';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    console.log('Quiz submission started');
    
    // Parse request data
    const body = await req.json();
    console.log('Request body parsed successfully');
    
    // Extract client information
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Generate session ID if not provided
    const sessionId = body.sessionId || crypto.randomUUID();
    console.log('Session ID generated:', sessionId);
    
    // Validate required fields
    const requiredFields = [
      'currentGrade', 'enjoyedSubjects', 'strongestSkills', 'techComfort',
      'workPreference', 'excitingActivities', 'freeDayChoice', 'workStyle',
      'taskPreference', 'stressHandling', 'workEnvironment', 'careerPriorities',
      'locationFlexibility', 'careerDepth', 'tenYearVision', 'explorationOpenness'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate array fields
    const arrayFields = ['enjoyedSubjects', 'strongestSkills', 'excitingActivities', 'careerPriorities'];
    for (const field of arrayFields) {
      if (!Array.isArray(body[field]) || body[field].length === 0) {
        console.log('Invalid array field:', field);
        return NextResponse.json(
          { error: `${field} must be a non-empty array` },
          { status: 400 }
        );
      }
    }
    
    // Validate number fields
    if (body.techComfort < 1 || body.techComfort > 5 || isNaN(body.techComfort)) {
      return NextResponse.json(
        { error: 'techComfort must be a number between 1 and 5' },
        { status: 400 }
      );
    }
    
    if (body.locationFlexibility < 1 || body.locationFlexibility > 5 || isNaN(body.locationFlexibility)) {
      return NextResponse.json(
        { error: 'locationFlexibility must be a number between 1 and 5' },
        { status: 400 }
      );
    }
    
    console.log('Validation passed, connecting to database...');
    
    // Connect to database with retry
    try {
      await connectToDB();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      
      // Try to reconnect once more
      try {
        console.log('Attempting database reconnection...');
        // Clear the cached connection
        global._mongooseConn = undefined;
        await connectToDB();
        console.log('Database reconnection successful');
      } catch (retryError) {
        console.error('Database reconnection also failed:', retryError);
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      }
    }
    
    // Create quiz response document
    const quizData = {
      sessionId,
      
      // Personal & Academic Background
      currentGrade: body.currentGrade,
      enjoyedSubjects: Array.isArray(body.enjoyedSubjects) ? body.enjoyedSubjects : [body.enjoyedSubjects],
      challengingSubjects: Array.isArray(body.challengingSubjects) ? body.challengingSubjects : (body.challengingSubjects ? [body.challengingSubjects] : []),
      achievements: body.achievements || '',
      
      // Skills & Strengths
      strongestSkills: Array.isArray(body.strongestSkills) ? body.strongestSkills : [body.strongestSkills],
      techComfort: Number(body.techComfort),
      workPreference: body.workPreference,
      
      // Interests & Passions
      excitingActivities: Array.isArray(body.excitingActivities) ? body.excitingActivities : [body.excitingActivities],
      freeDayChoice: body.freeDayChoice,
      curiousIndustries: Array.isArray(body.curiousIndustries) ? body.curiousIndustries : (body.curiousIndustries ? [body.curiousIndustries] : []),
      
      // Work Preferences & Personality
      workStyle: body.workStyle,
      taskPreference: body.taskPreference,
      stressHandling: body.stressHandling,
      workEnvironment: body.workEnvironment,
      
      // Values & Lifestyle Goals
      careerPriorities: Array.isArray(body.careerPriorities) ? body.careerPriorities : [body.careerPriorities],
      locationFlexibility: Number(body.locationFlexibility),
      careerDepth: body.careerDepth,
      
      // Future Vision & Ambitions
      tenYearVision: body.tenYearVision,
      currentCareerIdeas: body.currentCareerIdeas || '',
      explorationOpenness: body.explorationOpenness,
      
      // Additional Insights (optional)
      competitiveExams: body.competitiveExams || '',
      publicSpeaking: body.publicSpeaking || '',
      thinkingStyle: body.thinkingStyle || '',
      primaryMotivation: body.primaryMotivation || '',
      roleModels: body.roleModels || '',
      
      // Metadata
      timeSpent: body.timeSpent || 0,
      ipAddress,
      userAgent,
      analysisStatus: 'pending' as const
    };
    
    console.log('Creating quiz response document...');
    
    // Save to database
    try {
      const quizResponse = new QuizResponse(quizData);
      await quizResponse.save();
      console.log('Quiz response saved successfully:', quizResponse._id);
      
      // Start AI analysis in background (don't await it)
      analyzeAndUpdateQuiz(quizResponse._id.toString()).catch(error => {
        console.error('Background AI analysis failed:', error);
      });
      
      return NextResponse.json({
        success: true,
        message: 'Quiz submitted successfully',
        sessionId,
        quizId: quizResponse._id.toString(),
        status: 'submitted'
      }, { status: 201 });
      
    } catch (saveError) {
      console.error('Error saving quiz response:', saveError);
      return NextResponse.json(
        { error: 'Failed to save quiz response' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Quiz submission error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Background function to analyze quiz and update with AI results
async function analyzeAndUpdateQuiz(quizId: string) {
  try {
    console.log('Starting background AI analysis for quiz:', quizId);
    await connectToDB();
    
    const quizResponse = await QuizResponse.findById(quizId);
    if (!quizResponse) {
      console.error('Quiz not found for analysis:', quizId);
      return;
    }
    
    // Import AI analysis function here to avoid circular dependencies
    const { analyzeCareerPath } = await import('../../../lib/gemini');
    
    // Perform AI analysis
    console.log('Starting AI analysis for quiz:', quizId);
    const analysis = await analyzeCareerPath(quizResponse);
    
    // Update the quiz with analysis results
    quizResponse.careerRecommendations = analysis;
    quizResponse.analysisStatus = 'completed';
    await quizResponse.save();
    
    console.log('AI analysis completed for quiz:', quizId);
    
  } catch (error) {
    console.error('AI analysis error for quiz:', quizId, error);
    
    // Update status to failed
    try {
      await connectToDB();
      await QuizResponse.findByIdAndUpdate(quizId, {
        analysisStatus: 'failed',
        analysisError: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (updateError) {
      console.error('Failed to update quiz analysis status:', updateError);
    }
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit quiz data.' },
    { status: 405 }
  );
}
