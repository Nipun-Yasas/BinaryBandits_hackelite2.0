"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Users, TrendingUp, Award } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useI18n } from "../../_providers/I18nProvider";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function MarketingPanel() {
  const theme = useTheme();
  const { t } = useI18n();

  const stats = [
    { icon: Users, value: "2,800+", label: t("login.marketing.stats.studentsGuided") },
    { icon: Award, value: "1,250+", label: t("login.marketing.stats.careersExplored") },
    { icon: TrendingUp, value: "4.8★", label: t("login.marketing.stats.avgRating") },
  ];

  const features = t("login.marketing.features");

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
            {t("login.marketing.title")}
            <Box component="span" sx={{ display: "block", color: 'authtext.main' }}>
              {t("login.marketing.subtitle")}
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
            {t("login.marketing.description")}
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: 'authtext.main',
                  minWidth: 120,
                }}
              >
                <stat.icon
                  size={24}
                  color={theme.palette.primary.main}
                  style={{ marginBottom: "8px" }}
                />
                <Typography variant="h6" fontWeight="bold" color='primary.main'>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }} color='primary.main'>
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {features.map((feature: string, index: number) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ x: 10 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: 'authtext.main',
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    color: 'authtext.main',
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}