import { useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../_providers/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const actionRef = useRef(null);
  const theme = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    if (!actionRef.current) return;
    const ctx = gsap.context(() => {
      const element = actionRef.current;
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
          {t("callToAction.title")}
        </Typography>

        <Typography variant="h6" sx={{ display: "block", mb: 2 }}>
          {t("callToAction.subtitle")}
        </Typography>
        <Typography variant="body1">{t("callToAction.body")}</Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Link href="/quiz" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: gradient,
                "&:hover": { filter: "brightness(0.95)" },
              }}
              aria-label={t("callToAction.quizBtn")}
            >
              {t("callToAction.quizBtn")}
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
              aria-label={t("callToAction.careersBtn")}
            >
              {t("callToAction.careersBtn")}
            </Button>
          </Link>
        </Box>
      </Box>

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
          src="/action.svg"
          alt={t("callToAction.imgAlt")}
          width={500}
          height={400}
        />
      </Box>
    </Box>
  );
}
