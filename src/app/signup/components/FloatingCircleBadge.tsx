"use client";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

export default function FloatingCircleBadge({
  Icon,
  iconSize = 28,
}: {
  Icon: IconCmp;
  iconSize?: number;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: `0 20px 40px ${theme.palette.primary.main}33`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Icon size={iconSize} color={theme.palette.getContrastText(theme.palette.primary.main)} />
    </Box>
  );
}