"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import BackgroundShape from "../_components/background/BackgroundShape";

import MarketingPanel from "./components/MarketingPanel";
import LoginCard from "./components/LoginCard";
import FloatingSparkle from "./components/FloatingSparkle";
import FloatingBook from "./components/FloatingBook";

export default function LoginPage() {
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
        py: 4,
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

      {/* Floating elements */}
      <FloatingSparkle
        sx={{
          position: "absolute",
          top: "10%",
          right: "15%",
          zIndex: 1,
        }}
      />
      <FloatingBook
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          zIndex: 1,
        }}
      />

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
          <LoginCard />
        </Box>
      </Container>

      {/* CSS for shape animations */}
      <style jsx global>{`
        .shape1 {
          animation: float1 8s ease-in-out infinite;
        }
        .shape2 {
          animation: float2 10s ease-in-out infinite;
        }
        .shape3 {
          animation: float3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-40px, -20px) rotate(180deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -40px) rotate(90deg);
          }
          50% {
            transform: translate(-30px, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, 30px) rotate(270deg);
          }
        }
      `}</style>
    </Box>
  );
}
