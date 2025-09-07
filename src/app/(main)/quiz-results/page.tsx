"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  Target,
  Star,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Award,
  Lightbulb,
  Users,
  Briefcase,
  GraduationCap,
  Clock,
  Brain,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  BookMarked,
  Network,
  Compass,
} from "lucide-react";

// Enhanced interface to match our new API structure
interface QuizResults {
  status: string;
  sessionId: string;
  quizId: string;
  completedAt: string;
  timeSpent: number;
  careerSummary: string;
  analysis: {
    // New structure
    topCareerPath?: {
      title: string;
      confidence: number;
      description: string;
    };
    domainFit?: {
      primaryDomain: string;
      fitPercentage: number;
      reasoning: string[];
    };
    whyItFits?: string[];
    alternativeCareers?: Array<{
      title: string;
      confidence: number;
      description: string;
    }>;
    skillsToDevelop?: Array<{
      category: string;
      skills: string[];
      priority: string;
    }>;
    learningResources?: Array<{
      type: string;
      title: string;
      provider: string;
      url: string;
      difficulty: string;
    }>;
    futureOutlook?: {
      growthPotential: string;
      salaryRange: string;
      marketDemand: string;
      trends: string[];
    };
    
    // Legacy structure for backward compatibility
    primaryCareer?: string;
    primaryCareers?: string[];
    careerCluster?: string;
    careerDomain?: string;
    whyItFits_legacy?: {
      keyStrengths: string[];
      alignedInterests: string[];
      matchingValues: string[];
      personalityMatch: string;
    };
    alternativeCareers_legacy?: string[];
    skillsTodevelops?: string[];
    learningResources_legacy?: {
      courses: string[];
      communities: string[];
      practicalSteps: string[];
    };
    futureOutlook_legacy?: {
      growthProjection: string;
      jobDemand: string;
      salaryRange: string;
      globalRelevance: string;
    };
    confidenceScore?: number;
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function QuizResultsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const searchParams = useSearchParams();
  
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const sessionId = searchParams.get('sessionId');
  const quizId = searchParams.get('quizId');

  // Prevent hydration errors by ensuring client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchResults = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (sessionId) params.append('sessionId', sessionId);
      if (quizId) params.append('quizId', quizId);

      const response = await fetch(`/api/quiz/results?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (data.status === 'pending') {
          // If still pending, retry after a delay
          setTimeout(() => {
            if (retryCount < 10) { // Max 10 retries (about 30 seconds)
              setRetryCount(prev => prev + 1);
              fetchResults(false);
            } else {
              setError('Analysis is taking longer than expected. Please try again later.');
              setLoading(false);
            }
          }, 3000);
        } else if (data.status === 'completed') {
          setResults(data);
          setLoading(false);
        } else {
          setError(data.message || 'Failed to load results');
          setLoading(false);
        }
      } else {
        setError(data.error || 'Failed to fetch results');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && (sessionId || quizId)) {
      fetchResults();
    } else if (mounted) {
      setError('No quiz session found. Please complete the quiz first.');
      setLoading(false);
    }
  }, [sessionId, quizId, mounted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Helper functions to handle both new and legacy data structures
  const getCareerTitle = () => {
    return results?.analysis.topCareerPath?.title || 
           results?.analysis.primaryCareer || 
           'Career Professional';
  };

  const getConfidenceScore = () => {
    return results?.analysis.topCareerPath?.confidence || 
           results?.analysis.confidenceScore || 
           60;
  };

  const getDomainInfo = () => {
    if (results?.analysis.domainFit) {
      return {
        domain: results.analysis.domainFit.primaryDomain,
        percentage: results.analysis.domainFit.fitPercentage,
        reasoning: results.analysis.domainFit.reasoning
      };
    }
    return {
      domain: results?.analysis.careerDomain || results?.analysis.careerCluster || 'General Business',
      percentage: results?.analysis.confidenceScore || 60,
      reasoning: results?.analysis.whyItFits_legacy?.keyStrengths || ['Good fit based on responses']
    };
  };

  const getWhyItFits = () => {
    if (results?.analysis.whyItFits && Array.isArray(results.analysis.whyItFits)) {
      return results.analysis.whyItFits;
    }
    if (results?.analysis.whyItFits_legacy) {
      const legacy = results.analysis.whyItFits_legacy;
      return [
        legacy.personalityMatch,
        ...legacy.keyStrengths,
        ...legacy.alignedInterests,
        ...legacy.matchingValues
      ].filter(Boolean).slice(0, 6);
    }
    return ['Good match based on your responses'];
  };

  const getAlternativeCareers = () => {
    if (results?.analysis.alternativeCareers && Array.isArray(results.analysis.alternativeCareers)) {
      return results.analysis.alternativeCareers;
    }
    if (results?.analysis.alternativeCareers_legacy) {
      return results.analysis.alternativeCareers_legacy.map((career, index) => ({
        title: career,
        confidence: 70 - (index * 5),
        description: `Alternative career option: ${career}`
      }));
    }
    return [];
  };

  const getSkillsToLearn = () => {
    if (results?.analysis.skillsToDevelop) {
      return results.analysis.skillsToDevelop;
    }
    if (results?.analysis.skillsTodevelops) {
      return [{
        category: "Professional Skills",
        skills: results.analysis.skillsTodevelops,
        priority: "High"
      }];
    }
    return [];
  };

  const getLearningResources = () => {
    if (results?.analysis.learningResources) {
      return results.analysis.learningResources;
    }
    if (results?.analysis.learningResources_legacy) {
      const legacy = results.analysis.learningResources_legacy;
      const resources = [];
      legacy.courses?.forEach(course => resources.push({ type: "Course", title: course, provider: "Online", url: "#", difficulty: "Beginner" }));
      legacy.communities?.forEach(community => resources.push({ type: "Community", title: community, provider: "Online", url: "#", difficulty: "All" }));
      return resources;
    }
    return [];
  };

  const getFutureOutlook = () => {
    if (results?.analysis.futureOutlook) {
      return results.analysis.futureOutlook;
    }
    if (results?.analysis.futureOutlook_legacy) {
      const legacy = results.analysis.futureOutlook_legacy;
      return {
        growthPotential: legacy.growthProjection,
        salaryRange: legacy.salaryRange,
        marketDemand: legacy.jobDemand,
        trends: [legacy.globalRelevance]
      };
    }
    return {
      growthPotential: "Positive growth expected",
      salaryRange: "Competitive range",
      marketDemand: "Good demand",
      trends: ["Growing field"]
    };
  };

  // Show loading state while mounting to prevent hydration issues
  if (!mounted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CircularProgress size={80} sx={{ mb: 4, color: theme.palette.primary.main }} />
            <Typography variant="h5" gutterBottom>
              Analyzing Your Career Path
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Our AI is processing your responses to provide personalized career recommendations...
            </Typography>
            <Box sx={{ maxWidth: 400, mx: "auto" }}>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchResults()}>
              <RefreshCw size={16} style={{ marginRight: 8 }} />
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          No results found. Please complete the quiz first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
            }}
          >
            <CheckCircle2
              size={60}
              color={theme.palette.success.main}
              style={{ marginBottom: 16 }}
            />
            <Typography
              variant="h3"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                mb: 2,
              }}
            >
              Your Career Analysis Results 🎯
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={20} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary">
                  Completed in {formatTime(results.timeSpent)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Brain size={20} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary">
                  Analysis Confidence: {getConfidenceScore()}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
              {results.careerSummary}
            </Typography>
          </Paper>
        </motion.div>

        {/* Main Results Grid */}
        <Grid container spacing={4}>
          {/* 1. Primary Career Path Recommendation */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, border: `2px solid ${theme.palette.primary.main}` }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Target size={32} color={theme.palette.primary.main} />
                    <Typography variant="h4" fontWeight={700} sx={{ ml: 2, color: theme.palette.primary.main }}>
                      🎯 Your Top Career Path
                    </Typography>
                  </Box>
                  
                  <Typography variant="h3" fontWeight={600} gutterBottom sx={{ color: theme.palette.text.primary }}>
                    {getCareerTitle()}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem", mb: 3 }}>
                    {results.analysis.topCareerPath?.description || 
                     `Based on your quiz responses, ${getCareerTitle()} is an excellent match for your interests, skills, and career goals.`}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {(results.analysis.primaryCareers || [getCareerTitle()]).map((career, index) => (
                      <Chip
                        key={index}
                        label={career}
                        variant="filled"
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          px: 2,
                          py: 1,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 2. Career Cluster / Domain Fit */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Compass size={24} color={theme.palette.info.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Career Domain & Fit
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Chip
                      label={getDomainInfo().domain}
                      size="large"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                        color: "white",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        mb: 2,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ textAlign: "center", lineHeight: 1.6, mb: 2 }}>
                    Your preferences align <strong>{getDomainInfo().percentage}%</strong> with the{" "}
                    <strong>{getDomainInfo().domain}</strong> domain.
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                    This gives you a family of related careers to explore, not just one specific job.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Confidence Score */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Award size={24} color={getConfidenceColor(getConfidenceScore())} style={{ marginBottom: 16 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Match Confidence
                  </Typography>
                  
                  <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={getConfidenceScore()}
                      size={100}
                      thickness={4}
                      sx={{ color: getConfidenceColor(getConfidenceScore()) }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h4" component="div" fontWeight={600}>
                        {getConfidenceScore()}%
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Based on your responses, we're {getConfidenceScore()}% confident 
                    this career path aligns with your interests and strengths.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 3. Why This Career Fits You */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Lightbulb size={24} color={theme.palette.warning.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Why This Career Fits You
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {getWhyItFits().map((reason, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <CheckCircle2 size={20} color={theme.palette.success.main} style={{ marginTop: 2, marginRight: 12, flexShrink: 0 }} />
                          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {reason}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 4. Alternative Career Suggestions */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Network size={24} color={theme.palette.purple || theme.palette.secondary.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Alternative Career Paths
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Don't feel locked into one path! Here are related careers you might also enjoy:
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {getAlternativeCareers().slice(0, 4).map((career, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: `1px solid ${theme.palette.divider}`,
                        "&:hover": { backgroundColor: theme.palette.action.hover }
                      }}>
                        <Typography variant="body1" fontWeight={500}>
                          {typeof career === 'object' ? career.title : career}
                        </Typography>
                        {typeof career === 'object' && career.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {career.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 5. Skills to Develop */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <TrendingUp size={24} color={theme.palette.warning.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Skills to Develop Now
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start building these key skills to succeed in your chosen career path:
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {getSkillsToLearn().map((skillGroup, index) => (
                      <Box key={index}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary" gutterBottom>
                          {skillGroup.category}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                          {skillGroup.skills.slice(0, 4).map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.85rem" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 6. Learning Resources */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <BookMarked size={24} color={theme.palette.info.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Learning Resources & Next Steps
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {getLearningResources().slice(0, 6).map((resource, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          border: `1px solid ${theme.palette.divider}`,
                          height: "100%"
                        }}>
                          <Typography variant="subtitle2" fontWeight={600} color="primary" gutterBottom>
                            {resource.type}
                          </Typography>
                          <Typography variant="body2" fontWeight={500} gutterBottom>
                            {resource.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.provider} • {resource.difficulty}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* 7. Future Outlook */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.success.main}10 0%, ${theme.palette.primary.main}10 100%)` }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <BarChart3 size={24} color={theme.palette.success.main} />
                    <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                      Future Outlook & Market Trends
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "background.paper" }}>
                        <TrendingUp size={32} color={theme.palette.success.main} style={{ marginBottom: 8 }} />
                        <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
                          Growth Potential
                        </Typography>
                        <Typography variant="body2">
                          {getFutureOutlook().growthPotential}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "background.paper" }}>
                        <Briefcase size={32} color={theme.palette.primary.main} style={{ marginBottom: 8 }} />
                        <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                          Market Demand
                        </Typography>
                        <Typography variant="body2">
                          {getFutureOutlook().marketDemand}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "background.paper" }}>
                        <DollarSign size={32} color={theme.palette.warning.main} style={{ marginBottom: 8 }} />
                        <Typography variant="h6" fontWeight={600} color="warning.main" gutterBottom>
                          Salary Range
                        </Typography>
                        <Typography variant="body2">
                          {getFutureOutlook().salaryRange}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="body1" fontWeight={500}>
                      🌟 The future is bright for your chosen career path! You're entering an exciting field with tremendous opportunities ahead.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              href="/dashboard"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                mr: 2,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                },
              }}
            >
              Return to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<RefreshCw size={20} />}
              href="/Quiz"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Take Quiz Again
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}
