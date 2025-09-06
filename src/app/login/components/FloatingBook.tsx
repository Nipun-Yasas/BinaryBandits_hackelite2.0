"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { BookOpen } from "lucide-react";
import type { SxProps, Theme } from "@mui/material/styles";

export default function FloatingBook({ sx }: { sx?: SxProps<Theme> }) {
  const theme = useTheme();

  return (
    <motion.div
      animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute" }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          ...sx,
        }}
      >
        <BookOpen size={24} color={theme.palette.authtext.main} />
      </Box>
    </motion.div>
  );
}