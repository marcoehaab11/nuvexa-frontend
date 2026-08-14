import type { Locale } from "./data";

export const contactPhones = [
  { display: "+20 12 21042717", whatsapp: "https://wa.me/201221042717" },
  { display: "+20 10 05030131", whatsapp: "https://wa.me/201005030131" },
] as const;

export const contactLocation: Record<Locale, string> = {
  ar: "الغردقة، مصر، البحر الأحمر",
  en: "Hurghada, Egypt, Red Sea",
  fr: "Hurghada, Égypte, mer Rouge",
  de: "Hurghada, Ägypten, Rotes Meer",
  es: "Hurgada, Egipto, mar Rojo",
  ru: "Хургада, Египет, Красное море",
  zh: "埃及赫尔格达，红海",
};
