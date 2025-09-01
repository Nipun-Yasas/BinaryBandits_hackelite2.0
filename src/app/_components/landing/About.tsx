"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Search, FileDown, Languages, UsersRound, MessagesSquare, Bot } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!aboutRef.current) return;

    const ctx = gsap.context(() => {
      const element = aboutRef.current!;
      const anim = gsap.fromTo(
        element,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        animation: anim,
        onEnter: () => gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }),
        onLeave: () => gsap.to(element, { opacity: 0, y: 100, duration: 1, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(element, { opacity: 0, y: -100, duration: 1, ease: "power3.out" }),
        onEnterBack: () => gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }),
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={aboutRef}
      id="about"
      overflow="hidden"
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* Left: Illustration */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
        }}
      >
        {/* Animated shapes */}
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
            height: 250,
            width: 200,
            top: "60%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.12,
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
            width: 300,
            height: 400,
            backgroundColor: "#FF7A00",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.08,
          }}
        />
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <Image
            src="/Student.svg"
            alt="Discover careers and learning paths"
            width={400}
            height={400}
            priority
            style={{
              height: "auto",
              width: "100%",
              maxWidth: "450px",
              filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))",
            }}
          />
        </motion.div>
      </Box>

      {/* Right: Text */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          position: "relative",
          textAlign: { xs: "center", md: "left" },
          p: 2.5,
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "primary.main",
            borderRadius: "50%",
            height: 300,
            width: 400,
            top: { xs: "30%", md: "10%" },
            left: { xs: "50%", md: "50%" },
            transform: "translate(-50%, 0)",
            zIndex: 0,
            opacity: 0.06,
          }}
          aria-hidden="true"
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.9rem", letterSpacing: 2 }}
            >
              ABOUT PATHFINDER
            </Typography>

            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                mt: 2,
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              Career guidance built for Sri Lankan students
            </Typography>

            <Typography variant="h6" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4, fontWeight: 400 }}>
              PathFinder evaluates your interests and strengths to suggest careers, explains
              subject choices and study routes, and provides bilingual guidance with a
              downloadable report. Students, teachers, and parents can collaborate to make
              confident decisions.
            </Typography>

            {/* Key Features */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Brain size={24} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Career Assessment Quiz</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personality and interest‑based quiz maps you to suitable career clusters aligned with Sri Lankan streams.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Search size={24} color={theme.palette.secondary.main} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Career Explorer</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search and filter careers with job info, required subjects, local pathways, and prospects.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FileDown size={24} color="#FF7A00" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Downloadable Report</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Export a personalized PDF with quiz results, career suggestions, and learning paths.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Languages size={24} color="#2E7D32" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Sinhala / English</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bilingual content throughout quizzes, careers, and reports. Tamil planned in a future phase.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <UsersRound size={24} color="#9e52b5" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Profiles & Authentication</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure accounts for students, teachers, and parents. Save attempts, bookmarks, and reports.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MessagesSquare size={24} color="#0288D1" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Community Forum</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask questions, share tips, and upvote helpful answers in a moderated space.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Bot size={24} color="#6A0DAD" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>AI Career Guidance Chatbot</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get local, Sri Lanka‑aware answers like subject combinations, in Sinhala or English.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Link href="/quiz" passHref style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.05rem",
                  "&:hover": { filter: "brightness(0.95)", transform: "translateY(-2px)" },
                  transition: "all 0.25s ease",
                }}
              >
                Start the Quiz
              </Button>
            </Link>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
