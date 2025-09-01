"use client";

import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FeatureCard from "../cards/FeatureCard";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Feature = {
  icon: string; // URL to an icon (SVG/PNG)
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/brain-circuit.svg",
    title: "Career Assessment Quiz",
    description:
      "Interactive, interest‑based quiz mapping you to suitable career clusters aligned with Sri Lankan streams.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/stars.svg",
    title: "Personalized Suggestions",
    description:
      "Ranked career recommendations with demand, skills, and salary ranges for Sri Lanka.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/search.svg",
    title: "Career Explorer",
    description:
      "Search and filter careers across Tech, Medicine, Arts, Design, Business, and Vocational fields.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/route.svg",
    title: "Learning Paths",
    description:
      "Step‑by‑step guidance: A/L subjects, degrees, diplomas, and vocational routes in Sri Lanka.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/file-down.svg",
    title: "Downloadable Report",
    description:
      "Export a personalized PDF with quiz results, career suggestions, and recommended learning paths.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/languages.svg",
    title: "Sinhala / English",
    description:
      "Bilingual content across quizzes, careers, and reports. Tamil support planned for a future phase.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/users-round.svg",
    title: "Profiles & Auth",
    description:
      "Secure accounts for students, teachers, and parents. Save attempts, bookmarks, and past reports.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/bot.svg",
    title: "AI Career Chatbot",
    description:
      "Ask in Sinhala or English about subjects, pathways, and in‑demand jobs in Sri Lanka.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/messages-square.svg",
    title: "Community Forum",
    description:
      "Moderated space to ask questions, share tips, and upvote helpful guidance from peers and mentors.",
  },
  {
    icon: "https://unpkg.com/lucide-static@latest/icons/handshake.svg",
    title: "Mentorship (Future)",
    description:
      "Connect with university students, alumni, and professionals for guidance and mock interviews.",
  },
];

export default function Features() {
  const featureRef = useRef(null);

  useEffect(() => {
    if (!featureRef.current) return;

    const ctx = gsap.context(() => {
      const element = featureRef.current;

      const anim = gsap.fromTo(
        element,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        animation: anim,
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: -100,
            duration: 1,
            ease: "power3.out",
          });
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, featureRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Box
        ref={featureRef}
        id="features"
        sx={{
          backgroundColor: "background.default",
          py: { xs: 6, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{
            mb: 1,
            color: "primary.main",
          }}
        >
          PathFinder features
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Built for Sri Lankan students, teachers, and parents
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Box>
      </Box>
    </>
  );
}
