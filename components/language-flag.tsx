import type { Locale } from "@/lib/data";

export function LanguageFlag({ locale }: { locale: Locale }) {
  const common = { viewBox: "0 0 24 16", role: "img", "aria-hidden": true } as const;

  switch (locale) {
    case "ar":
      return <svg {...common}><path fill="#ce1126" d="M0 0h24v5.33H0z"/><path fill="#fff" d="M0 5.33h24v5.34H0z"/><path fill="#000" d="M0 10.67h24V16H0z"/><path fill="#c8a746" d="m12 6.1.8 1.15-.35 2.15h-.9l-.35-2.15z"/></svg>;
    case "en":
      return <svg {...common}><path fill="#012169" d="M0 0h24v16H0z"/><path stroke="#fff" strokeWidth="3.2" d="m0 0 24 16M24 0 0 16"/><path stroke="#c8102e" strokeWidth="1.4" d="m0 0 24 16M24 0 0 16"/><path fill="#fff" d="M9.5 0h5v16h-5zM0 5.5h24v5H0z"/><path fill="#c8102e" d="M10.5 0h3v16h-3zM0 6.5h24v3H0z"/></svg>;
    case "fr":
      return <svg {...common}><path fill="#0055a4" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ef4135" d="M16 0h8v16h-8z"/></svg>;
    case "de":
      return <svg {...common}><path fill="#000" d="M0 0h24v5.33H0z"/><path fill="#dd0000" d="M0 5.33h24v5.34H0z"/><path fill="#ffce00" d="M0 10.67h24V16H0z"/></svg>;
    case "es":
      return <svg {...common}><path fill="#aa151b" d="M0 0h24v4H0zM0 12h24v4H0z"/><path fill="#f1bf00" d="M0 4h24v8H0z"/><circle cx="7" cy="8" r="1.25" fill="#aa151b"/></svg>;
    case "ru":
      return <svg {...common}><path fill="#fff" d="M0 0h24v5.33H0z"/><path fill="#0039a6" d="M0 5.33h24v5.34H0z"/><path fill="#d52b1e" d="M0 10.67h24V16H0z"/></svg>;
    case "zh":
      return <svg {...common}><path fill="#de2910" d="M0 0h24v16H0z"/><path fill="#ffde00" d="m5 2 .7 1.45 1.6.23-1.15 1.13.27 1.59L5 5.65 3.58 6.4l.27-1.59L2.7 3.68l1.6-.23z"/></svg>;
  }
}
