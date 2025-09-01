"use client";

import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, alpha } from "@mui/material/styles";

import CountUp from "react-countup";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, FileText, Star, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const studentsGuided = 2847;
const careersExplored = 1250;
const reportsGenerated = 987;
const averageRating = 4.8;

interface StatItemProps {
  icon: React.ReactNode;
  number: number;
  text: string;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  number,
  text,
  suffix = "+",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
        backdropFilter: "blur(8px)",
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: (theme) => `0 10px 30px ${alpha(theme.palette.primary.main, 0.18)}`,
          backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.04),
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "50%",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        <CountUp
          end={number}
          duration={2.5}
          separator=","
          decimals={
            Number.isInteger(number) ? 0 : String(number).split(".")[1]?.length ?? 1
          }
          enableScrollSpy
          scrollSpyOnce
        />
        {suffix}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "0.9rem", md: "1rem" },
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        {text}
      </Typography>
    </Box>
  </motion.div>
);

export default function Stats() {
  const statsRef = useRef(null);
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;
  const iconContrast = theme.palette.getContrastText(theme.palette.primary.main);

  useEffect(() => {
    if (!statsRef.current) return;

    const element = statsRef.current;

    const ctx = gsap.context(() => {
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
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: -100,
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
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={statsRef}
      width="100%"
      id="stats"
      sx={{
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, md: 4 },
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: gradient,
          borderRadius: "50%",
          opacity: 0.06,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: "50%",
          opacity: 0.06,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              fontWeight: 700,
              background: gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1.5,
            }}
          >
            Guiding Futures, At Scale
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Join thousands using PathFinder to discover careers, explore study
            routes, and make informed decisions.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <StatItem
            icon={<Users size={32} color={iconContrast} />}
            number={studentsGuided}
            text="Students Guided"
          />
          <StatItem
            icon={<BookOpen size={32} color={iconContrast} />}
            number={careersExplored}
            text="Careers Explored"
          />
          <StatItem
            icon={<FileText size={32} color={iconContrast} />}
            number={reportsGenerated}
            text="Reports Generated"
          />
          <StatItem
            icon={<Star size={32} color={iconContrast} />}
            number={averageRating}
            text="Satisfaction Rating"
            suffix="★"
          />
        </Box>
      </Box>
    </Box>
  );
}
