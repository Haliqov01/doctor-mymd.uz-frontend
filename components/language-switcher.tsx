"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export function LanguageSwitcher({ variant = "default", className = "" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    
    // Eğer ilk segment locale ise değiştir
    if (segments[1] === 'uz' || segments[1] === 'ru') {
      segments[1] = newLocale;
    } else {
      // Locale yoksa ekle
      segments.splice(1, 0, newLocale);
    }
    
    const newPath = segments.join('/') || '/';
    router.push(newPath);
    setOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale);

  // Minimal variant - sadece bayrak göster
  if (variant === "minimal") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/80 hover:bg-white border border-neutral-200 hover:border-green-300 shadow-sm hover:shadow transition-all"
          title={t("title")}
        >
          <span className="text-lg">{currentLang?.flag}</span>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[160px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                  locale === lang.code ? "bg-green-50" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium text-neutral-700">{lang.name}</span>
                {locale === lang.code && (
                  <Check className="h-4 w-4 text-green-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Compact variant - küçük düğme
  if (variant === "compact") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-green-300 shadow-sm hover:shadow transition-all text-sm"
        >
          <span>{currentLang?.flag}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[160px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors ${
                  locale === lang.code ? "bg-green-50" : ""
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-sm font-medium text-neutral-700">{lang.name}</span>
                {locale === lang.code && (
                  <Check className="h-4 w-4 text-green-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant - tam görünüm
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-green-300 shadow-soft hover:shadow-soft-lg transition-all"
      >
        <Globe className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-700">
          {currentLang?.flag} {currentLang?.name}
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[180px]">
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{t("title")}</p>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                locale === lang.code ? "bg-green-50 border-l-2 border-green-500" : ""
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className={`text-sm font-medium ${locale === lang.code ? "text-green-700" : "text-neutral-700"}`}>
                {lang.name}
              </span>
              {locale === lang.code && (
                <Check className="h-4 w-4 text-green-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



