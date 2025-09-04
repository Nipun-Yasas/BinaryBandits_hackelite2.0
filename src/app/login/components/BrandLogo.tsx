"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BookOpen } from "lucide-react";

type BrandLogoProps = {
  href?: string;
  showAvatar?: boolean;
  variant?: "light" | "gradient";
  size?: "sm" | "md";
};

export default function BrandLogo({
  href = "/",
  showAvatar = true,
  size = "md",
}: BrandLogoProps) {
  const theme = useTheme();
  const iconSize = size === "sm" ? 24 : 28;
  const avatarSize = size === "sm" ? 40 : 48;


  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showAvatar && (
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backdropFilter: "blur(10px)",
              width: avatarSize,
              height: avatarSize,
            }}
          >
            <BookOpen size={iconSize} color={theme.palette.authtext.main} />
          </Avatar>
        )}
        <Typography variant="h2" sx={{ fontWeight: 700,color:'authtext.main'}}>
          PathFinder
        </Typography>
      </Box>
    </Link>
  );
}