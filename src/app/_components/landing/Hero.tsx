"use client";

import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Brain,
  Search,
  MessagesSquare,
  Languages,
  FileDown,
  Bot,
} from "lucide-react";
import { useI18n } from "../../_providers/I18nProvider";

export default function Hero() {
  const theme = useTheme();
  const { t } = useI18n();

  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  // Get features from i18n
  const features = t("hero.features") as unknown as string[];

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
          {t("hero.title")}
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mt: 2.5, mb: 4, fontWeight: 400 }}
        >
          {t("hero.subtitle")}
        </Typography>

        {/* Feature highlights */}
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            mb: 4,
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Brain size={20} color={theme.palette.primary.main} />
            <Typography variant="body2" color="text.secondary">
              {features[0]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Search size={20} color={theme.palette.secondary.main} />
            <Typography variant="body2" color="text.secondary">
              {features[1]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FileDown size={20} color="#FF7A00" />
            <Typography variant="body2" color="text.secondary">
              {features[2]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Languages size={20} color="#2E7D32" />
            <Typography variant="body2" color="text.secondary">
              {features[3]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Bot size={20} color="#0288D1" />
            <Typography variant="body2" color="text.secondary">
              {features[4]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MessagesSquare size={20} color="#9e52b5" />
            <Typography variant="body2" color="text.secondary">
              {features[5]}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
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
                "&:hover": {
                  filter: "brightness(0.95)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s ease",
              }}
            >
              {t("hero.startQuiz")}
            </Button>
          </Link>
          <Link href="/careers" passHref>
            <Button
              variant="outlined"
              size="large"
              sx={{
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
              {t("hero.exploreCareers")}
            </Button>
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: 400, md: 600 },
          height: { xs: 400, md: 600 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/hero.svg"
          alt={t("hero.imgAlt")}
          width={600}
          height={600}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );
}
