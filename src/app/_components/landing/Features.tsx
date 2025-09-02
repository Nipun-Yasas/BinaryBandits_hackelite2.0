"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeatureCard from "../cards/FeatureCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../_providers/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

function get(obj: Dict, path: string, fallback?: any) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback ?? path;
}

export default function Features() {
  const featureRef = useRef(null);
  const { t } = useI18n();

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

  // Get features from i18n
  const raw = t("features.items", []);
  const features = Array.isArray(raw) ? raw : [];

  return (
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
        {t("features.title")}
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ mb: 4, color: "text.secondary" }}
      >
        {t("features.subtitle")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {features.map((feature: any) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            viewDetails={t("features.viewDetails", "View Details")}
          />
        ))}
      </Box>
    </Box>
  );
}
