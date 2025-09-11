"use client";

import { useEffect } from "react";
import { LocaleProvider } from "@/app/_providers/LocaleContext";
import { I18nProvider } from "@/app/_providers/I18nProvider";
import { NextAppProvider } from "@toolpad/core/nextjs";
import theme from "../../theme";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (!html.getAttribute("data-toolpad-color-scheme")) {
        html.setAttribute("data-toolpad-color-scheme", "light");
      }
    }
  }, []);

  return (
    <NextAppProvider theme={theme}>

    <LocaleProvider>
      <I18nProvider>{children}</I18nProvider>
    </LocaleProvider>
    </NextAppProvider>
  );
}


