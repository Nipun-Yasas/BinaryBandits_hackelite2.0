"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Rating from "@mui/material/Rating";
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";

import {
  ChevronRight,
  ChevronLeft,
  Target,
  User,
  GraduationCap,
  Brain,
  Heart,
  Briefcase,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  Lightbulb,
  Users,
  Play,
} from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } },
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

interface QuizSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "scale" | "text" | "select";
  options?: string[];
  maxSelections?: number;
  required: boolean;
  placeholder?: string;
}

interface QuizAnswers {
  [key: string]: string | string[] | number;
}

const quizSections: QuizSection[] = [
  {
    id: "personal_academic",
    title: "Personal & Academic Background",
    description: "Tell us about your educational journey and academic interests",
    icon: <GraduationCap size={24} />,
    questions: [
      {
        id: "currentGrade",
        question: "What is your current grade/year of study?",
        type: "select",
        options: [
          "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", 
          "Grade 11", "Grade 12", "Undergraduate Year 1", "Undergraduate Year 2",
          "Undergraduate Year 3", "Undergraduate Year 4", "Graduate/Masters", "PhD", "Other"
        ],
        required: true,
      },
      {
        id: "enjoyedSubjects",
        question: "Which subjects do you enjoy learning the most at school/university?",
        type: "multiple",
        options: [
          "Mathematics", "Science/Physics", "Chemistry", "Biology", "English/Literature", 
          "History", "Geography", "Art/Design", "Music", "Computer Science/IT",
          "Foreign Languages", "Social Studies", "Economics", "Business Studies",
          "Psychology", "Philosophy", "Physical Education/Sports"
        ],
        required: true,
      },
      {
        id: "challengingSubjects",
        question: "Which subjects do you find most challenging or least interesting?",
        type: "multiple",
        options: [
          "Mathematics", "Science/Physics", "Chemistry", "Biology", "English/Literature", 
          "History", "Geography", "Art/Design", "Music", "Computer Science/IT",
          "Foreign Languages", "Social Studies", "Economics", "Business Studies",
          "Psychology", "Philosophy", "Physical Education/Sports"
        ],
        required: false,
      },
      {
        id: "achievements",
        question: "What type of grades or achievements have you received so far (if any)?",
        type: "text",
        placeholder: "e.g., Honor roll, academic awards, competition wins, leadership roles...",
        required: false,
      },
    ]
  },
  {
    id: "skills_strengths",
    title: "Skills & Strengths",
    description: "Help us understand your natural abilities and preferences",
    icon: <Brain size={24} />,
    questions: [
      {
        id: "strongestSkills",
        question: "Which of these best describes your strongest skills? (Select all that apply)",
        type: "multiple",
        options: [
          "Analytical/Problem-solving",
          "Creativity/Innovation", 
          "Communication/Storytelling",
          "Leadership/Team management",
          "Technical/Digital skills",
          "Hands-on/Practical skills",
          "Research/Exploration",
          "Other (please specify)"
        ],
        required: true,
      },
      {
        id: "techComfort",
        question: "On a scale of 1–5, how comfortable are you with technology and digital tools?",
        type: "scale",
        required: true,
      },
      {
        id: "workPreference",
        question: "Do you prefer working with numbers, words, people, or things (machines, tools, nature, etc.)?",
        type: "single",
        options: ["Numbers", "Words", "People", "Things (machines, tools, nature)", "No specific preference"],
        required: true,
      },
    ]
  },
  {
    id: "interests_passions",
    title: "Interests & Passions",
    description: "Share what excites and motivates you beyond academics",
    icon: <Heart size={24} />,
    questions: [
      {
        id: "excitingActivities",
        question: "Which activities excite you the most outside academics? (Select up to 3)",
        type: "multiple",
        maxSelections: 3,
        options: [
          "Solving puzzles/logic problems",
          "Creating art, design, or content",
          "Exploring science experiments",
          "Helping others or volunteering",
          "Playing with tech, gadgets, coding",
          "Sports, outdoor activities, adventure",
          "Business, money, and entrepreneurship",
          "Reading, writing, or storytelling",
          "Music, performing arts",
          "Gaming, entertainment",
          "Other (please specify)"
        ],
        required: true,
      },
      {
        id: "freeDayChoice",
        question: "If you had a free day to do anything you love, what would you choose?",
        type: "text",
        placeholder: "Describe your ideal free day activity...",
        required: true,
      },
      {
        id: "curiousIndustries",
        question: "Which industries or fields do you feel curious about?",
        type: "multiple",
        options: [
          "Technology/IT", "Healthcare/Medicine", "Education", "Finance/Banking",
          "Entertainment/Media", "Sports", "Art/Design", "Environment/Sustainability",
          "Business/Entrepreneurship", "Research/Science", "Government/Politics",
          "Non-profit/Social Work", "Engineering", "Law", "Agriculture/Food",
          "Travel/Tourism", "Fashion", "Real Estate", "Marketing/Advertising"
        ],
        required: false,
      },
    ]
  },
  {
    id: "work_preferences",
    title: "Work Preferences & Personality",
    description: "Tell us about your ideal work style and environment",
    icon: <Briefcase size={24} />,
    questions: [
      {
        id: "workStyle",
        question: "Do you prefer working:",
        type: "single",
        options: ["Independently", "In a small team (2-5 people)", "In a large group (6+ people)", "No preference"],
        required: true,
      },
      {
        id: "taskPreference",
        question: "Do you enjoy structured tasks with clear rules, or open-ended creative work?",
        type: "single",
        options: [
          "Structured tasks with clear rules", 
          "Open-ended creative work", 
          "Both equally", 
          "It depends on the situation"
        ],
        required: true,
      },
      {
        id: "stressHandling",
        question: "How do you handle stress or challenges?",
        type: "single",
        options: [
          "Stay calm and find solutions",
          "Seek help and collaborate",
          "Feel stressed but push through",
          "Avoid until later",
          "Take breaks and come back refreshed"
        ],
        required: true,
      },
      {
        id: "workEnvironment",
        question: "Which work environment would you prefer?",
        type: "single",
        options: [
          "Office/Corporate setting",
          "Outdoors/Nature",
          "Laboratory/Research center",
          "Creative studio/design space",
          "Remote/flexible setup",
          "Mixed environments"
        ],
        required: true,
      },
    ]
  },
  {
    id: "values_lifestyle",
    title: "Values & Lifestyle Goals",
    description: "Share what matters most to you in your future career",
    icon: <TrendingUp size={24} />,
    questions: [
      {
        id: "careerPriorities",
        question: "What matters most to you in a future career? (Choose top 3)",
        type: "multiple",
        maxSelections: 3,
        options: [
          "High salary/financial stability",
          "Job security/stability",
          "Work-life balance",
          "Making a positive impact on society",
          "Continuous learning and growth",
          "Creativity and freedom",
          "Leadership opportunities",
          "International exposure/travel",
          "Recognition and prestige",
          "Flexible schedule"
        ],
        required: true,
      },
      {
        id: "locationFlexibility",
        question: "How important is location flexibility (remote work, working abroad, etc.)?",
        type: "scale",
        required: true,
      },
      {
        id: "careerDepth",
        question: "Do you see yourself as more of a specialist (deep knowledge in one field) or a generalist (broad knowledge in many fields)?",
        type: "single",
        options: [
          "Specialist (deep knowledge in one field)", 
          "Generalist (broad knowledge in many fields)", 
          "Both/Hybrid approach", 
          "Not sure yet"
        ],
        required: true,
      },
    ]
  },
  {
    id: "future_vision",
    title: "Future Vision & Ambitions",
    description: "Help us understand your long-term career aspirations",
    icon: <Target size={24} />,
    questions: [
      {
        id: "tenYearVision",
        question: "Where do you see yourself in 10 years?",
        type: "single",
        options: [
          "Running my own business/startup",
          "Working in a top company",
          "Doing research/academia",
          "Contributing to society/community",
          "Exploring multiple careers/freelancing",
          "Not sure yet"
        ],
        required: true,
      },
      {
        id: "currentCareerIdeas",
        question: "What careers do you currently have in mind (if any)?",
        type: "text",
        placeholder: "List any careers you're considering or curious about...",
        required: false,
      },
      {
        id: "explorationOpenness",
        question: "Are you open to exploring career paths you may not have considered before?",
        type: "single",
        options: [
          "Very open - I love discovering new possibilities", 
          "Somewhat open - I'm willing to consider new options", 
          "Not very open - I prefer familiar paths", 
          "I want to stick to what I already know"
        ],
        required: true,
      },
    ]
  },
  {
    id: "additional_insights",
    title: "Additional Insights",
    description: "Optional questions that help us provide better recommendations",
    icon: <Lightbulb size={24} />,
    questions: [
      {
        id: "competitiveExams",
        question: "Do you enjoy competitive exams and academic challenges (e.g., SAT, GRE, Olympiads)?",
        type: "single",
        options: ["Love them", "Somewhat enjoy", "Neutral", "Dislike them", "Hate them"],
        required: false,
      },
      {
        id: "publicSpeaking",
        question: "Do you enjoy public speaking and presenting ideas?",
        type: "single",
        options: ["Love it", "Somewhat enjoy", "Neutral", "Dislike it", "Terrified of it"],
        required: false,
      },
      {
        id: "thinkingStyle",
        question: "Do you prefer logical/step-by-step thinking or imaginative/abstract thinking?",
        type: "single",
        options: [
          "Logical/step-by-step", 
          "Imaginative/abstract", 
          "Both equally", 
          "Depends on the situation"
        ],
        required: false,
      },
      {
        id: "primaryMotivation",
        question: "What motivates you most: recognition, money, curiosity, helping others, or freedom?",
        type: "single",
        options: [
          "Recognition and achievement", 
          "Money and financial security", 
          "Curiosity and learning", 
          "Helping others", 
          "Freedom and independence",
          "A combination of these"
        ],
        required: false,
      },
      {
        id: "roleModels",
        question: "Do you have any role models whose career inspires you?",
        type: "text",
        placeholder: "Tell us about someone whose career path inspires you...",
        required: false,
      },
    ]
  },
];

export default function QuizPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentSection = quizSections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / quizSections.length) * 100;
  const isLastSection = currentSectionIndex === quizSections.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, []);

  const handleAnswer = (questionId: string, answer: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setError(null);
  };

  const validateCurrentSection = () => {
    const sectionErrors: string[] = [];
    
    currentSection.questions.forEach(question => {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer) {
          sectionErrors.push(`Please answer: ${question.question}`);
        } else if (Array.isArray(answer) && answer.length === 0) {
          sectionErrors.push(`Please select at least one option for: ${question.question}`);
        } else if (typeof answer === "string" && answer.trim().length === 0) {
          sectionErrors.push(`Please provide an answer for: ${question.question}`);
        }
      }
    });

    return sectionErrors;
  };

  const handleNext = () => {
    const validationErrors = validateCurrentSection();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(prev => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...answers,
          timeSpent 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to results page with sessionId
        window.location.href = `/quiz-results?sessionId=${result.sessionId}&quizId=${result.quizId}`;
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case "single":
        return (
          <FormControl fullWidth error={question.required && !currentAnswer}>
            <RadioGroup
              value={currentAnswer || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            >
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={
                    <Radio
                      sx={{
                        color: "#5538a7ff",
                        "&.Mui-checked": {
                          color: "#5538a7ff",
                        },
                        "&:hover": {
                          backgroundColor: "#5538a7ff10",
                        },
                      }}
                    />
                  }
                  label={option}
                  sx={{
                    mb: 1,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "1rem",
                      lineHeight: 1.4,
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case "multiple":
        const multipleAnswer = (currentAnswer as string[]) || [];
        const maxSelections = question.maxSelections;
        
        return (
          <FormControl fullWidth error={question.required && multipleAnswer.length === 0}>
            <FormGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={multipleAnswer.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (maxSelections && multipleAnswer.length >= maxSelections) {
                            return;
                          }
                          handleAnswer(question.id, [...multipleAnswer, option]);
                        } else {
                          handleAnswer(
                            question.id,
                            multipleAnswer.filter(item => item !== option)
                          );
                        }
                      }}
                      sx={{
                        color: "#5538a7ff",
                        "&.Mui-checked": {
                          color: "#5538a7ff",
                        },
                        "&:hover": {
                          backgroundColor: "#5538a7ff10",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    />
                  }
                  label={option}
                  sx={{
                    mb: 1,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "1rem",
                      lineHeight: 1.4,
                    },
                  }}
                />
              ))}
            </FormGroup>
            {maxSelections && (
              <FormHelperText>
                You can select up to {maxSelections} options. Currently selected: {multipleAnswer.length}
              </FormHelperText>
            )}
          </FormControl>
        );

      case "scale":
        return (
          <Box sx={{ px: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rate from 1 (Not comfortable/Important) to 5 (Very comfortable/Important)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">1</Typography>
              <Rating
                value={currentAnswer as number || 0}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    handleAnswer(question.id, newValue);
                  }
                }}
                size="large"
                max={5}
                sx={{
                  "& .MuiRating-iconEmpty": {
                    color: "#5538a7ff",
                  },
                  "& .MuiRating-iconFilled": {
                    color: "#5538a7ff",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#5538a7ff",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">5</Typography>
            </Box>
          </Box>
        );

      case "select":
        return (
          <FormControl fullWidth error={question.required && !currentAnswer}>
            <InputLabel>Select an option</InputLabel>
            <Select
              value={currentAnswer || ""}
              label="Select an option"
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              {question.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "text":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={currentAnswer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder || "Type your answer here..."}
            error={question.required && !currentAnswer}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
            }}
          />
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              <CheckCircle
                size={80}
                color={theme.palette.success.main}
                style={{ marginBottom: 24 }}
              />
            </motion.div>

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
              Quiz Completed! 🎉
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
              Thank you for completing the Career Guidance Quiz! Your responses have been submitted successfully. 
              Our AI will analyze your answers to provide personalized career recommendations.
            </Typography>

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
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                },
              }}
            >
              View Your Results
            </Button>
          </Paper>
        </motion.div>
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
          <Box sx={{ mb: 4, textAlign: "center" }}>
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
              🎯 Career Guidance Quiz
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
              Discover your ideal career path through this comprehensive assessment. 
              Answer honestly to get the most accurate recommendations.
            </Typography>

            {/* Progress Section */}
            <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Section {currentSectionIndex + 1} of {quizSections.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress)}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
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

            {/* Section Navigation */}
            <Grid container spacing={1} sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
              {quizSections.map((section, index) => (
                <Grid item xs={6} sm={4} md={2} key={section.id}>
                  <Chip
                    icon={section.icon}
                    label={`${index + 1}. ${section.title.split(" ")[0]}`}
                    variant={index === currentSectionIndex ? "filled" : "outlined"}
                    size="small"
                    sx={{
                      width: "100%",
                      background: index === currentSectionIndex 
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        : "transparent",
                      color: index === currentSectionIndex ? "white" : "inherit",
                      fontSize: "0.75rem",
                      "& .MuiChip-icon": {
                        color: index === currentSectionIndex ? "white" : "inherit",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                maxWidth: 900,
                mx: "auto",
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.palette.divider}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Section Header */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
                    mr: 3,
                  }}
                >
                  {currentSection.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {currentSection.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentSection.description}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Questions */}
              <Box sx={{ mb: 4 }}>
                {currentSection.questions.map((question, index) => (
                  <Box key={question.id} sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {index + 1}. {question.question}
                      {question.required && (
                        <Typography component="span" color="error.main" sx={{ ml: 1 }}>
                          *
                        </Typography>
                      )}
                    </Typography>

                    {renderQuestionInput(question)}
                  </Box>
                ))}
              </Box>

              {/* Error Message */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Navigation */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeft size={20} />}
                  onClick={handlePrevious}
                  disabled={isFirstSection}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Previous
                </Button>

                <Box sx={{ textAlign: "center", flexGrow: 1, mx: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Section {currentSectionIndex + 1} of {quizSections.length}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  endIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : isLastSection ? (
                      <CheckCircle size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )
                  }
                  onClick={handleNext}
                  disabled={isSubmitting}
                  sx={{
                    background: isLastSection
                      ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${
                        isLastSection ? theme.palette.success.main : theme.palette.primary.main
                      }40`,
                    },
                  }}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isLastSection
                    ? "Complete Quiz"
                    : "Next Section"}
                </Button>
              </Box>

              {/* Required Field Note */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block", textAlign: "center" }}
              >
                * Required fields
              </Typography>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
