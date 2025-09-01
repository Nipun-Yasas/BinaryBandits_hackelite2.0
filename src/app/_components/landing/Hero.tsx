'use client';

import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Brain, Search, MessagesSquare, Languages, FileDown, UsersRound, Bot } from "lucide-react";

export default function Hero() {
  const theme = useTheme();

  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        minHeight: { xs: "auto", md: "90vh" },
        width: "100%",
        mt: 3,
      }}
    >
      {/* Text content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          justifyContent: "center",
          zIndex: 2,
          p: { xs: 2, md: 8 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2.4rem", md: "3.2rem" },
              background: gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            PathFinder for Students in Sri Lanka
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mt: 2.5, mb: 4, fontWeight: 400 }}
          >
            Take a career assessment, get personalized suggestions, explore careers,
            and follow step‑by‑step learning paths. Download your report, switch
            Sinhala/English, chat with an AI career guide, and connect with a supportive
            community. Profiles for students, teachers, and parents.
          </Typography>

          {/* Feature highlights */}
          <Box sx={{ display: "flex", gap: 2.5, mb: 4, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Brain size={20} color={theme.palette.primary.main} />
              <Typography variant="body2" color="text.secondary">Career Quiz</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Search size={20} color={theme.palette.secondary.main} />
              <Typography variant="body2" color="text.secondary">Career Explorer</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FileDown size={20} color="#FF7A00" />
              <Typography variant="body2" color="text.secondary">PDF Report</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Languages size={20} color="#2E7D32" />
              <Typography variant="body2" color="text.secondary">සිංහල / English</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Bot size={20} color="#0288D1" />
              <Typography variant="body2" color="text.secondary">AI Chatbot</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MessagesSquare size={20} color="#9e52b5" />
              <Typography variant="body2" color="text.secondary">Community</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, justifyContent: { xs: "center", md: "flex-start" } }}>
            <Link href="/quiz" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: gradient,
                  px: 3.5,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  "&:hover": { filter: "brightness(0.95)", transform: "translateY(-2px)" },
                  transition: "all 0.25s ease",
                }}
              >
                Start Career Quiz
              </Button>
            </Link>
            <Link href="/careers" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  px: 3.5,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  "&:hover": {
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    backgroundColor: "rgba(0,0,0,0.02)",
                  },
                }}
              >
                Explore Careers
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Box>

      {/* Image content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 5 },
          height: { xs: "auto", md: "100%" },
        }}
      >
        {/* Animated background shapes */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: "60%",
            width: "60%",
            left: "20%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.12,
            maxHeight: 300,
            maxWidth: 300,
          }}
        />
        <motion.div
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            width: "40%",
            height: "40%",
            maxWidth: 200,
            maxHeight: 200,
            backgroundColor: "#FF7A00",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "30%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.15,
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Image
            src="/person.svg"
            alt="PathFinder – Career guidance for Sri Lankan students"
            width={600}
            height={600}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </motion.div>
      </Box>
    </Box>
  );
}
