"use client";

import "./globals.css";

import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Inter } from "next/font/google";

import ClientThemeProvider from "./_components/ClientThemeProvider";
import { AuthProvider } from "./_providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <Suspense fallback={<></>}>
            <ClientThemeProvider>
              <AppRouterCacheProvider>
                {children}
              </AppRouterCacheProvider>
            </ClientThemeProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
