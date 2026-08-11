"use client";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Locale, localeFlags, localeNames, t } from "@/lib/data";
import { Logo } from "./logo";

export function Header({ locale, overlay = true }: { locale: Locale; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const links = [["", "Home", "الرئيسية"], ["properties", "Properties", "العقارات"], ["projects", "Projects", "المشروعات"], ["map", "Map", "الخريطة"], ["about", "About", "عن نوفيكسا"]];
  return <header className={`site-header ${overlay ? "header-overlay" : "header-solid"}`}>
    <Logo light={overlay} />
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([path,en,ar]) => <a key={path} href={`/${locale}/${path}`}>{t(locale,en,ar)}</a>)}</nav>
    <div className="header-actions">
      <details className="language-menu"><summary aria-label={`Change language. Current language: ${localeNames[locale]}`}><span className="language-flag" aria-hidden="true">{localeFlags[locale]}</span><ChevronDown size={14}/></summary><div>{Object.entries(localeNames).map(([code,name]) => <a key={code} href={`/${code}`} lang={code}><span className="language-flag" aria-hidden="true">{localeFlags[code as Locale]}</span><span>{name}</span></a>)}</div></details>
      <a className="contact-link" href={`/${locale}/contact`}>{t(locale,"Talk to us","تحدث معنا")}</a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="mobile-nav">{links.map(([path,en,ar]) => <a key={path} href={`/${locale}/${path}`} onClick={() => setOpen(false)}>{t(locale,en,ar)}</a>)}</div>}
  </header>;
}
