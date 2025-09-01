"use client";

import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import { useTheme, alpha } from "@mui/material/styles";
import NextLink from "next/link";

import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const theme = useTheme();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const element = footerRef.current;
    gsap.set(element, { opacity: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const bgLeft = theme.palette.primary.main;
  const bgRight = theme.palette.primary.dark;
  const contrast = theme.palette.getContrastText(theme.palette.primary.main);

  return (
    <Box
      ref={footerRef}
      component="footer"
      role="contentinfo"
      sx={{
        mt: { xs: 2, md: 2 },
        color: contrast,
        background: `linear-gradient(135deg, ${bgLeft} 0%, ${bgRight} 100%)`,
        borderTop: `1px solid ${alpha(contrast, 0.12)}`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 2 } }}>
        <Grid container spacing={6} alignItems="flex-start">
          {/* Brand + Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
              PathFinder
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
              Career guidance for Sri Lankan students.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact
            </Typography>
            <Box
              component="address"
              sx={{ fontStyle: "normal", opacity: 0.95 }}
            >
              <Typography variant="body2">Colombo, Sri Lanka</Typography>
              <MuiLink
                component={NextLink}
                href="mailto:support@pathfinder.lk"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{ display: "inline-block", mr: 2, mt: 1 }}
              >
                support@pathfinder.lk
              </MuiLink>
              <MuiLink
                component={NextLink}
                href="tel:+94112345678"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{ display: "inline-block" }}
              >
                +94 11 234 5678
              </MuiLink>
            </Box>

            <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
              <IconButton
                aria-label="Twitter"
                component={NextLink}
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                component={NextLink}
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="GitHub"
                component={NextLink}
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Product */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product
            </Typography>
            <Box component="nav" aria-label="Product">
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 1.5,
                }}
              >
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="#about"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    About PathFinder
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/quiz"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Career Quiz
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/careers"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Career Explorer
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/paths"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Learning Paths
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/chat"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    AI Chatbot
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/forum"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Community Forum
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Support
            </Typography>
            <Box component="nav" aria-label="Support">
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 1.5,
                }}
              >
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/help"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Help Center
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/privacy"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Privacy Policy
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/terms"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Terms of Service
                  </MuiLink>
                </Box>
                <Box component="li">
                  <MuiLink
                    component={NextLink}
                    href="/language"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Sinhala / English
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: 3,
            borderTop: `1px solid ${alpha(contrast, 0.15)}`,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()} PathFinder. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <MuiLink
              component={NextLink}
              href="/privacy"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Privacy
            </MuiLink>
            <MuiLink
              component={NextLink}
              href="/terms"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Terms
            </MuiLink>
            <MuiLink
              component={NextLink}
              href="/contact"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Contact
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
