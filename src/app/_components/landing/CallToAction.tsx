import { useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const actionRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (!actionRef.current) return;

    const ctx = gsap.context(() => {
      const element = actionRef.current;

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
    }, actionRef);

    return () => ctx.revert();
  }, []);

  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  return (
    <Box
      ref={actionRef}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: 2,
        mb: { xs: 0, md: 5 },
      }}
    >
      {/* Left: Text */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          zIndex: 2,
          p: { xs: 2, md: 8 },
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary.main"
          sx={{
            lineHeight: { xs: "40px", md: "44px" },
            mt: { xs: 5, md: 3 },
            mb: { xs: 3.5, md: 3.5 },
          }}
        >
          Start your Path with PathFinder
        </Typography>

        <Typography variant="h6" sx={{ display: "block", mb: 2 }}>
          Take the career quiz, explore options, and follow learning paths tailored to Sri Lanka.
        </Typography>
        <Typography variant="body1">
          Get personalized career suggestions, A/L subject guidance, and bilingual support
          (සිංහල / English). Download your report, ask our AI chatbot, and engage with a
          supportive community.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 4, flexDirection: { xs: "column", sm: "row" } }}>
          <Link href="/quiz" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: gradient,
                "&:hover": { filter: "brightness(0.95)" },
              }}
              aria-label="Start Career Quiz"
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
                "&:hover": {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
              aria-label="Explore Careers"
            >
              Explore Careers
            </Button>
          </Link>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          Sinhala/English available. Tamil coming soon.
        </Typography>
      </Box>

      {/* Right: Illustration */}
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
        <Box
          component={motion.div}
          animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          }}
          sx={{
            position: "absolute",
            width: { xs: 300, md: 350 },
            left: { xs: "10%", md: "20%" },
            top: "20%",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            height: { xs: 450, md: 450 },
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.6,
            willChange: "transform",
          }}
          aria-hidden="true"
        />

        <Image
          src="/student.png"
          alt="Students discovering careers with PathFinder"
          width={300}
          height={300}
          priority
          style={{
            position: "relative",
            zIndex: 2,
            height: "auto",
            width: "100%",
            maxWidth: "400px",
          }}
        />
      </Box>
    </Box>
  );
}
