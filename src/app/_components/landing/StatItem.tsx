import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import CountUp from "react-countup";
import React from "react";

interface StatItemProps {
  icon: React.ReactNode; // Accepts a ReactNode for SVG/icon
  number: number;
  text: string;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text, suffix = "+" }) => {
  const theme = useTheme();

  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: { xs: 1, md: 1.5 },
        borderRadius: 2,
      }}
    >
      {/* Icon wrapper with theme-based background and border */}
      <Box
        sx={{
          width: { xs: 56, md: 72 },
          height: { xs: 56, md: 72 },
          mb: 2,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          color: "primary.main",
          lineHeight: 1.1,
        }}
      >
        <CountUp end={number} duration={2} separator="," />
        {suffix}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.8rem", md: "0.95rem" },
          mt: 1,
          color: "text.secondary",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default StatItem;

