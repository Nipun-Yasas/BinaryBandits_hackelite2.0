"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { UserPlus, Rocket, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import BrandLogo from "../../login/components/BrandLogo";
import { signup } from "../../lib/api";
import { useI18n } from "../../_providers/I18nProvider";

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function SignupForm() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("signup.errors.nameRequired");
    else if (formData.name.trim().length < 2) newErrors.name = t("signup.errors.nameShort");

    if (!formData.email.trim()) newErrors.email = t("signup.errors.emailRequired");
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))
      newErrors.email = t("signup.errors.emailInvalid");

    if (!formData.password) newErrors.password = t("signup.errors.passwordRequired");
    else if (formData.password.length < 8) newErrors.password = t("signup.errors.passwordShort");

    if (!formData.confirmPassword) newErrors.confirmPassword = t("signup.errors.confirmPasswordRequired");
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("signup.errors.passwordMismatch");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.error) {
        setErrors({ submit: response.error });
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
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
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          {isMobile && (
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 3 }}>
                <BrandLogo showAvatar variant="gradient" size="sm" />
              </Box>
            </Link>
          )}

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            {t("signup.title")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t("signup.subtitle")}
          </Typography>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Chip
              icon={<Rocket size={16} />}
              label="Launch Your Learning Journey"
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                "& .MuiChip-icon": { color: theme.palette.primary.main },
              }}
            />
          </motion.div>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label={t("signup.nameLabel")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                mb: 3,
                
              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label={t("signup.emailLabel")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                mb: 3,
               
              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label={t("signup.passwordLabel")}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                mb: 3,
               
              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label={t("signup.confirmPasswordLabel")}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                mb: 4,

              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <EyeOff size={20}  /> : <Eye size={20}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {errors.submit && (
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.error.main + "15",
                  border: `1px solid ${theme.palette.error.main}33`,
                }}
              >
                <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                  {errors.submit}
                </Typography>
              </Box>
            </motion.div>
          )}

          {success && (
            <motion.div variants={itemVariants} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.success.main + "15",
                  border: `1px solid ${theme.palette.success.main}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>✓</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t("signup.success")}
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ opacity: 0.8 }}>
                    {t("signup.redirecting")}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                py: 1.8,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                mb: 3,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 15px 35px ${theme.palette.primary.main}66`,
                },
                "&:disabled": { background: `${theme.palette.primary.main}33` },
                transition: "all 0.3s ease",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={24} color="inherit" />
                  <Typography>Creating Account...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography>{t("signup.createAccountBtn")}</Typography>
                  <ArrowRight size={20} />
                </Box>
              )}
            </Button>
          </motion.div>

          <Divider sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("signup.alreadyHaveAccount")}
            </Typography>
          </Divider>

          <motion.div variants={itemVariants}>
            <Link href="/login" passHref style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
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
                {t("signup.signInInstead")}
              </Button>
            </Link>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
}