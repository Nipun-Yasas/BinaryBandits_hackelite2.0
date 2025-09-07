"use client";

import { useEffect, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { enUS, siLK } from "@mui/material/locale";
import { ThemeProvider } from '@mui/material';

import theme from "../../theme";
import { useLocale } from "../_providers/LocaleContext";
import { I18nProvider } from "../_providers/I18nProvider";
import { LocaleProvider } from "../_providers/LocaleContext";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useLocale();

  const themedWithLocale = useMemo(
    () => createTheme(theme, locale === "siLK" ? siLK : enUS),
    [locale]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (!html.getAttribute("data-toolpad-color-scheme")) {
        html.setAttribute("data-toolpad-color-scheme", "light");
      }
    }
  }, []);

  return (
    <LocaleProvider>
      <ThemeProvider theme={themedWithLocale}>
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
