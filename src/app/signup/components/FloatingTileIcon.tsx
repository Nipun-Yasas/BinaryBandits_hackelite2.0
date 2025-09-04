"use client";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

export default function FloatingTileIcon({
  Icon,
  iconSize = 20,
}: {
  Icon: IconCmp;
  iconSize?: number;
}) {
  const theme = useTheme();
  return (
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
      <Icon size={iconSize} color={theme.palette.primary.main} />
    </Box>
  );
}