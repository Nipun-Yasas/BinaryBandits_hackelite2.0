import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResponse extends Document {
  userId?: string;
  sessionId: string;
  
  // Personal & Academic Background
  currentGrade: string;
  enjoyedSubjects: string[];
  challengingSubjects?: string[];
  achievements?: string;
  
  // Skills & Strengths
  strongestSkills: string[];
  techComfort: number;
  workPreference: string;
  
  // Interests & Passions
  excitingActivities: string[];
  freeDayChoice: string;
  curiousIndustries?: string[];
  
  // Work Preferences & Personality
  workStyle: string;
  taskPreference: string;
  stressHandling: string;
  workEnvironment: string;
  
  // Values & Lifestyle Goals
  careerPriorities: string[];
  locationFlexibility: number;
  careerDepth: string;
  
  // Future Vision & Ambitions
  tenYearVision: string;
  currentCareerIdeas?: string;
  explorationOpenness: string;
  
  // Additional Insights (optional)
  competitiveExams?: string;
  publicSpeaking?: string;
  thinkingStyle?: string;
  primaryMotivation?: string;
  roleModels?: string;
  
  // Metadata
  timeSpent: number; // in seconds
  completedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  
  // AI Analysis Results
  careerRecommendations?: {
    primary: string[];
    secondary: string[];
    reasoning: string;
    skillGaps?: string[];
    nextSteps?: string[];
    educationPath?: string;
    confidenceScore: number;
  };
  
  analysisStatus: 'pending' | 'completed' | 'failed';
  analysisError?: string;
}

const QuizResponseSchema = new Schema<IQuizResponse>({
  userId: { type: String, required: false, index: true },
  sessionId: { type: String, required: true },
  
  // Personal & Academic Background
  currentGrade: { type: String, required: true },
  enjoyedSubjects: [{ type: String, required: true }],
  challengingSubjects: [{ type: String, required: false }],
  achievements: { type: String, required: false },
  
  // Skills & Strengths
  strongestSkills: [{ type: String, required: true }],
  techComfort: { type: Number, required: true, min: 1, max: 5 },
  workPreference: { type: String, required: true },
  
  // Interests & Passions
  excitingActivities: [{ type: String, required: true }],
  freeDayChoice: { type: String, required: true },
  curiousIndustries: [{ type: String, required: false }],
  
  // Work Preferences & Personality
  workStyle: { type: String, required: true },
  taskPreference: { type: String, required: true },
  stressHandling: { type: String, required: true },
  workEnvironment: { type: String, required: true },
  
  // Values & Lifestyle Goals
  careerPriorities: [{ type: String, required: true }],
  locationFlexibility: { type: Number, required: true, min: 1, max: 5 },
  careerDepth: { type: String, required: true },
  
  // Future Vision & Ambitions
  tenYearVision: { type: String, required: true },
  currentCareerIdeas: { type: String, required: false },
  explorationOpenness: { type: String, required: true },
  
  // Additional Insights (optional)
  competitiveExams: { type: String, required: false },
  publicSpeaking: { type: String, required: false },
  thinkingStyle: { type: String, required: false },
  primaryMotivation: { type: String, required: false },
  roleModels: { type: String, required: false },
  
  // Metadata
  timeSpent: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now, index: true },
  ipAddress: { type: String, required: false },
  userAgent: { type: String, required: false },
  
  // AI Analysis Results
  careerRecommendations: {
    primary: [{ type: String }],
    secondary: [{ type: String }],
    reasoning: { type: String },
    skillGaps: [{ type: String }],
    nextSteps: [{ type: String }],
    educationPath: { type: String },
    confidenceScore: { type: Number, min: 0, max: 100 },
  },
  
  analysisStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending',
    index: true 
  },
  analysisError: { type: String, required: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
QuizResponseSchema.index({ userId: 1, completedAt: -1 });
QuizResponseSchema.index({ sessionId: 1 });
QuizResponseSchema.index({ analysisStatus: 1, completedAt: 1 });

// Virtual for days since completion
QuizResponseSchema.virtual('daysSinceCompletion').get(function() {
  return Math.floor((Date.now() - this.completedAt.getTime()) / (1000 * 60 * 60 * 24));
});

export default mongoose.models.QuizResponse || mongoose.model<IQuizResponse>('QuizResponse', QuizResponseSchema);
