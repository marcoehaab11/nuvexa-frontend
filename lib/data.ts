export type Locale = "ar" | "en" | "fr" | "de" | "es" | "ru" | "zh";

export const localeNames: Record<Locale, string> = { ar: "العربية", en: "English", fr: "Français", de: "Deutsch", es: "Español", ru: "Русский", zh: "中文" };
export const localeFlags: Record<Locale, string> = { ar: "🇪🇬", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", es: "🇪🇸", ru: "🇷🇺", zh: "🇨🇳" };

export function isLocale(value: string): value is Locale { return value in localeNames; }
export function t(locale: Locale, en: string, ar: string) { return locale === "ar" ? ar : en; }
