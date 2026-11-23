import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/coddz";
import { TRANSLATIONS } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof TRANSLATIONS)[Lang];
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "coddz_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored === "ar" || stored === "fr" || stored === "en" ? stored : "ar";
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: TRANSLATIONS[lang],
    dir: lang === "ar" ? "rtl" : "ltr",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}