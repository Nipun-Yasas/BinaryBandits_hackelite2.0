"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type LocaleKey = "enUS" | "siLK";

type Ctx = {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
};

const LocaleContext = createContext<Ctx>({
  locale: "enUS",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<LocaleKey>("enUS");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("mui-locale")) as LocaleKey | null;
    if (saved === "siLK" || saved === "enUS") setLocale(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mui-locale", locale);
      document.documentElement.lang = locale === "siLK" ? "si-LK" : "en-US";
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}