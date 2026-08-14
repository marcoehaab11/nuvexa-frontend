"use client";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Locale, localeNames, t } from "@/lib/data";
import { Logo } from "./logo";
import { LanguageFlag } from "./language-flag";

export function Header({ locale, overlay = true }: { locale: Locale; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const languageHref = (code: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length && segments[0] in localeNames) segments[0] = code;
    else segments.unshift(code);
    return `/${segments.join("/")}`;
  };
  const links = [["", "Home", "الرئيسية"], ["properties", "Properties", "العقارات"], ["projects", "Projects", "المشروعات"], ["map", "Map", "الخريطة"], ["about", "About", "عن نوفيكسا"]];
  return <header className={`site-header ${overlay ? "header-overlay" : "header-solid"}`}>
    <Logo light={overlay} />
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([path,en,ar]) => <a key={path} href={`/${locale}/${path}`}>{t(locale,en,ar)}</a>)}</nav>
    <div className="header-actions">
      <details className="language-menu"><summary aria-label={`Change language. Current language: ${localeNames[locale]}`}><span className="language-flag"><LanguageFlag locale={locale}/></span><span className="current-language">{localeNames[locale]}</span><ChevronDown size={14}/></summary><div role="menu">{Object.entries(localeNames).map(([code,name]) => {const active=code===locale;return <a key={code} href={languageHref(code as Locale)} lang={code} hrefLang={code} aria-current={active?"page":undefined} role="menuitem"><span className="language-flag"><LanguageFlag locale={code as Locale}/></span><span>{name}</span>{active&&<Check className="language-check" aria-hidden="true"/>}</a>})}</div></details>
      <a className="contact-link" href={`/${locale}/contact`}>{t(locale,"Talk to us","تحدث معنا")}</a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="mobile-nav">{links.map(([path,en,ar]) => <a key={path} href={`/${locale}/${path}`} onClick={() => setOpen(false)}>{t(locale,en,ar)}</a>)}</div>}
  </header>;
}
