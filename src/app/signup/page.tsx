"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { motion } from "framer-motion";
import {
  BookOpen,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  GraduationCap,
  Target,
  Star,
  Rocket,
} from "lucide-react";

import BackgroundShape from "../_components/background/BackgroundShape";

export default function SignupPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner" as "learner" | "mentor" | "both",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as "learner" | "mentor" | "both",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Replace this with your actual signup API call
      // const success = await signup({
      //   name: formData.name.trim(),
      //   email: formData.email.trim(),
      //   password: formData.password,
      //   role: formData.role,
      // });

      // Simulate success for demo:
      const success = true;

      if (success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Learners" },
    { icon: GraduationCap, value: "500+", label: "Mentors" },
    { icon: Award, value: "1000+", label: "Skills" },
  ];

  const features = [
    { icon: Target, text: "Personalized Learning Paths" },
    { icon: Sparkles, text: "AI-Powered Skill Matching" },
    { icon: Star, text: "Expert Mentor Network" },
  ];

  // Theme-based gradients
  const mainGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;
  const mainGradientHover = `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: mainGradient,
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <BackgroundShape
        className="shape2"
        color={theme.palette.secondary.main}
        opacity="0.15"
        width={600}
        height={300}
        cx={300}
        cy={150}
        rx={250}
        ry={120}
      />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            background: mainGradient,
            justifyContent: "center",
            boxShadow: `0 20px 40px ${theme.palette.primary.main}33`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Rocket size={28} color={theme.palette.getContrastText(theme.palette.primary.main)} />
        </Box>
      </motion.div>

      <motion.div
        animate={{
          y: [15, -15, 15],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "25%",
          left: "8%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.palette.background.paper,
          }}
        >
          <GraduationCap size={20} color={theme.palette.primary.main} />
        </Box>
      </motion.div>

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 6,
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            {/* Left Side - Welcome Content */}
            {!isMobile && (
              <motion.div variants={itemVariants}>
                <Box sx={{ pr: 4 }}>
                  {/* Logo */}
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 4,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.background.paper,
                          backdropFilter: "blur(10px)",
                          width: 48,
                          height: 48,
                        }}
                      >
                        <BookOpen size={24} color={theme.palette.primary.main} />
                      </Avatar>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          background: mainGradient,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        PathFinder
                      </Typography>
                    </Box>
                  </Link>

                  {/* Hero Content */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: "2rem", md: "3rem" },
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                    }}
                  >
                    Begin Your
                    <Box
                      component="span"
                      sx={{ display: "block", color: theme.palette.secondary.main }}
                    >
                      Learning Adventure
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      lineHeight: 1.6,
                      maxWidth: "500px",
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                    }}
                  >
                    Join thousands of learners and mentors building skills together. Start your journey with AI-powered personalized learning.
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 2,
                            borderRadius: 2,
                            background: theme.palette.background.paper,
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <stat.icon
                            size={24}
                            color={theme.palette.primary.main}
                            style={{ marginBottom: "8px" }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ opacity: 0.8, color: theme.palette.text.secondary }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Features */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ x: 10 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              background: theme.palette.secondary.light,
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <feature.icon size={16} color={theme.palette.secondary.main} />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ opacity: 0.9, color: theme.palette.getContrastText(theme.palette.primary.main) }}
                          >
                            {feature.text}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Right Side - Signup Form */}
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 3 : 4,
                  borderRadius: 4,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: `0 25px 50px ${theme.palette.primary.main}22`,
                  position: "relative",
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                }}
              >
                {/* Form Header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  {isMobile && (
                    <Link href="/" style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        <BookOpen size={28} color={theme.palette.primary.main} />
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            background: mainGradient,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          PathFinder
                        </Typography>
                      </Box>
                    </Link>
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: "50%",
                        background: mainGradient,
                        mb: 2,
                        position: "relative",
                      }}
                    >
                      <UserPlus size={32} color="white" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          inset: -8,
                          borderRadius: "50%",
                          border: `2px solid ${theme.palette.primary.main}4D`,
                        }}
                      />
                    </Box>
                  </motion.div>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background: mainGradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Join PathFinder
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    Start your journey of learning and growth
                  </Typography>

                  {/* Status Chip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Chip
                      icon={<Rocket size={16} />}
                      label="Launch Your Learning Journey"
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "& .MuiChip-icon": { color: theme.palette.primary.main },
                      }}
                    />
                  </motion.div>
                </Box>

                {/* Signup Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{ mb: 3 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} color={theme.palette.text.secondary} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{ mb: 3 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} color={theme.palette.text.secondary} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>I want to...</InputLabel>
                      <Select
                        value={formData.role}
                        label="I want to..."
                        onChange={(e) => handleRoleChange(e.target.value)}
                        disabled={isLoading}
                        startAdornment={
                          <InputAdornment position="start">
                            <Target size={20} color={theme.palette.text.secondary} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="learner">🎓 Learn new skills</MenuItem>
                        <MenuItem value="mentor">👨‍🏫 Teach others</MenuItem>
                        <MenuItem value="both">
                          🚀 Both learn and teach
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      sx={{ mb: 3 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} color={theme.palette.text.secondary} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      sx={{ mb: 4 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} color={theme.palette.text.secondary} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{
                        background: mainGradient,
                        py: 1.8,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        mb: 3,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          background: mainGradientHover,
                          transform: "translateY(-2px)",
                          boxShadow: `0 15px 35px ${theme.palette.primary.main}66`,
                        },
                        "&:disabled": {
                          background: `${theme.palette.primary.main}33`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <CircularProgress size={24} color="inherit" />
                          <Typography>Creating Account...</Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography>Create Account</Typography>
                          <ArrowRight size={20} />
                        </Box>
                      )}
                    </Button>
                  </motion.div>

                  <Divider sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?
                    </Typography>
                  </Divider>

                  <motion.div variants={itemVariants}>
                    <Link
                      href="/login"
                      passHref
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          py: 1.8,
                          borderRadius: 3,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          borderWidth: 2,
                          "&:hover": {
                            borderColor: theme.palette.secondary.main,
                            color: theme.palette.secondary.main,
                            backgroundColor: `${theme.palette.secondary.main}0D`,
                            borderWidth: 2,
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Sign In Instead
                      </Button>
                    </Link>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* CSS for shape animations */}
      <style jsx global>{`
        .shape1 {
          animation: float1 9s ease-in-out infinite;
        }
        .shape2 {
          animation: float2 11s ease-in-out infinite;
        }
        .shape3 {
          animation: float3 13s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(25px, -35px) rotate(120deg);
          }
          66% {
            transform: translate(-30px, 25px) rotate(240deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-35px, -25px) rotate(180deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -45px) rotate(90deg);
          }
          50% {
            transform: translate(-25px, -15px) rotate(180deg);
          }
          75% {
            transform: translate(-5px, 35px) rotate(270deg);
          }
        }
      `}</style>
    </Box>
  );
}
