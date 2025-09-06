"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Rocket, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

import BackgroundShape from "../_components/background/BackgroundShape";
import MarketingPanel from "./components/MarketingPanel";
import SignupForm from "./components/SignupForm";
import FloatingCircleBadge from "./components/FloatingCircleBadge";
import FloatingTileIcon from "./components/FloatingCircleBadge";

export default function SignupPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: "flex",
        alignItems: "center",
        py: 2,
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
        animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "15%", right: "10%", zIndex: 1 }}
      >
        <FloatingCircleBadge Icon={Rocket} iconSize={28} />
      </motion.div>

      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "25%", left: "8%", zIndex: 1 }}
      >
        <FloatingTileIcon Icon={GraduationCap} iconSize={20} />
      </motion.div>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 6,
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          {!isMobile && <MarketingPanel />}
          <SignupForm />
        </Box>
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
