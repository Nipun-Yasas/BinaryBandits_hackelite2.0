"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Users, GraduationCap, Award, Target, Sparkles, Star } from "lucide-react";
import BrandLogo from "../../login/components/BrandLogo";
import { useI18n } from "../../_providers/I18nProvider";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function MarketingPanel() {
  const theme = useTheme();
  const { t } = useI18n();

  const stats = [
    { icon: Users, value: "10K+", label: t("signup.stats.learners") },
    { icon: GraduationCap, value: "500+", label: t("signup.stats.mentors") },
    { icon: Award, value: "1000+", label: t("signup.stats.skills") },
  ];

  const features = [
    { icon: Target, text: t("signup.features.personalized") },
    { icon: Sparkles, text: t("signup.features.ai") },
    { icon: Star, text: t("signup.features.mentors") },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ pr: 4 }}>
        <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
          <BrandLogo showAvatar variant="light" size="md" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" },
              color: 'authtext.main',
            }}
          >
            {t("signup.marketing.title")}
            <Box component="span" sx={{ display: "block", color: 'authtext.main' }}>
              {t("signup.marketing.subtitle")}
            </Box>
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
              maxWidth: "500px",
              color: 'authtext.main',
            }}
          >
            {t("signup.marketing.description")}
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap"}}>
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor:'authtext.main',
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.palette.divider}`,
                  minWidth: 120,
                }}
              >
                <stat.icon size={24} color={theme.palette.primary.main} style={{ marginBottom: 8 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main'}}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, color: 'primary.main' }}>
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ x: 10 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <f.icon size={16}  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, color: 'authtext.main' }}
                >
                  {f.text}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}
