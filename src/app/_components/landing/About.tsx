"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Search,
  FileDown,
  Languages,
  UsersRound,
  MessagesSquare,
  Bot,
} from "lucide-react";
import { useI18n } from "../../_providers/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const { t } = useI18n();

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
        onEnter: () =>
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }),
        onLeave: () =>
          gsap.to(element, {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out",
          }),
        onLeaveBack: () =>
          gsap.to(element, {
            opacity: 0,
            y: -100,
            duration: 1,
            ease: "power3.out",
          }),
        onEnterBack: () =>
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }),
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  const features = t("about.features") as unknown as {
    title: string;
    desc: string;
  }[];

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
        <Image
          src="/about.svg"
          alt={t("about.imgAlt")}
          width={500}
          height={500}
        />
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
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: 2,
            }}
          >
            {t("about.overline")}
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
            {t("about.title")}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              mb: 4,
              fontWeight: 400,
            }}
          >
            {t("about.subtitle")}
          </Typography>

          {/* Key Features */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Brain size={24} color={theme.palette.primary.main} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[0].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[0].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Search size={24} color={theme.palette.secondary.main} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[1].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[1].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FileDown size={24} color="#FF7A00" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[2].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[2].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Languages size={24} color="#2E7D32" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[3].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[3].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <UsersRound size={24} color="#9e52b5" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[4].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[4].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MessagesSquare size={24} color="#0288D1" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[5].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[5].desc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Bot size={24} color="#6A0DAD" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {features[6].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[6].desc}
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
                "&:hover": {
                  filter: "brightness(0.95)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s ease",
              }}
            >
              {t("about.startQuiz")}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
