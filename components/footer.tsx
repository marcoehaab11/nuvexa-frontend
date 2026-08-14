import { contactLocation, contactPhones } from "@/lib/contact";
import { Locale, t } from "@/lib/data";
import { Logo } from "./logo";

export function Footer({ locale }: { locale: Locale }) {
  return <footer className="footer">
    <div className="footer-main">
      <Logo light/>
      <p>{t(locale,"A considered collection of exceptional places across Egypt and beyond.","مجموعة منتقاة من الأماكن الاستثنائية في مصر وما بعدها.")}</p>
      <div>
        <a href={`/${locale}/properties`}>{t(locale,"Properties","العقارات")}</a>
        <a href={`/${locale}/projects`}>{t(locale,"Projects","المشروعات")}</a>
        <a href={`/${locale}/about`}>{t(locale,"About","عن نوفيكسا")}</a>
      </div>
      <div>
        {contactPhones.map(phone => <a key={phone.whatsapp} href={phone.whatsapp} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${phone.display}`}>{phone.display}</a>)}
        <a href="mailto:hello@nuvexa.com">hello@nuvexa.com</a>
        <span>{contactLocation[locale]}</span>
      </div>
    </div>
    <div className="footer-bottom"><span>© 2026 NUVEXA Properties</span><span>{t(locale,"Privacy · Terms","الخصوصية · الشروط")}</span></div>
  </footer>;
}
