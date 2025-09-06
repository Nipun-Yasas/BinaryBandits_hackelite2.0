"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Sparkles } from "lucide-react";
import type { SxProps, Theme } from "@mui/material/styles";

export default function FloatingSparkle({ sx }: { sx?: SxProps<Theme> }) {
  const theme = useTheme();

  return (
    <motion.div
      animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute" }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: 'authtext.main',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 20px 40px ${theme.palette.primary.main}33`,
          backdropFilter: "blur(10px)",
          ...sx,
        }}
      >
        <Sparkles size={32} color={theme.palette.getContrastText(theme.palette.primary.main)} />
      </Box>
    </motion.div>
  );
}