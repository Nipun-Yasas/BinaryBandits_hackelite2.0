"use client"

import "./globals.css";

import {  useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { createTheme } from "@mui/material/styles";
import { enUS, siLK } from "@mui/material/locale";

import { NextAppProvider } from "@toolpad/core/nextjs";
import NAVIGATION from "./_utils/navigation";
import theme from "../theme";
import { LocaleProvider, useLocale } from "./_providers/LocaleContext";
import { I18nProvider } from "./_providers/I18nProvider";
import { AuthProvider } from "./_providers/AuthProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


function AppThemeBridge({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const themedWithLocale = useMemo(
    () => createTheme(theme, locale === "siLK" ? siLK : enUS),
    [locale]
  );

  return (
    <NextAppProvider navigation={NAVIGATION} theme={themedWithLocale}>
      <AuthProvider>
        <I18nProvider>{children}</I18nProvider>
      </AuthProvider>
    </NextAppProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable}`}
        suppressHydrationWarning
      >
        <AppRouterCacheProvider>
          <LocaleProvider>
            <AppThemeBridge>{children}</AppThemeBridge>
          </LocaleProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
