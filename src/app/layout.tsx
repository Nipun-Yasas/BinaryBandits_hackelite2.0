"use client";

import "./globals.css";
import { Suspense, useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { createTheme } from "@mui/material/styles";
import { enUS, siLK } from "@mui/material/locale";

import { NextAppProvider } from "@toolpad/core/nextjs";
import NAVIGATION from "./_utils/navigation";
import theme from "../theme";
import { LocaleProvider, useLocale } from "./_providers/LocaleContext";
import { I18nProvider } from "./_providers/I18nProvider";
import { AuthProvider } from "./_providers/AuthProvider";
import { Poppins, Inter } from "next/font/google";
import Loading from "./loading";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
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
        className={`${inter.variable} ${poppins.variable}`}
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
