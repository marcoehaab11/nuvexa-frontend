import { ArrowLeft, ArrowUpLeft, Building2, ChevronDown, MapPin, Search } from "lucide-react";
import type { ProjectCardData, PropertyCardData } from "@/lib/api";
import { Locale, t } from "@/lib/data";
import { Footer } from "./footer";
import { Header } from "./header";
import { PropertyCard } from "./property-card";

export function HomePage({ locale, properties, projects }: { locale: Locale; properties: PropertyCardData[]; projects: ProjectCardData[] }) {
  const rtl = locale === "ar";
  const countLocation = (...terms: string[]) => properties.filter(property => terms.some(term => property.location.toLowerCase().includes(term))).length;
  const cairoCount = countLocation("cairo", "القاهرة");
  const northCoastCount = countLocation("north coast", "الساحل الشمالي");
  const redSeaCount = countLocation("red sea", "البحر الأحمر", "soma bay");
  return <main dir={rtl ? "rtl" : "ltr"} lang={locale} className={rtl ? "arabic" : ""}>
    <section className="hero">
      <Header locale={locale}/>
      <img className="hero-image" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=90" alt="Contemporary villa overlooking a calm pool"/>
      <div className="hero-shade"/><div className="hero-content"><p className="kicker">NUVEXA PROPERTIES · CAIRO</p><h1>{t(locale,"Exceptional places.\nConsidered living.","أماكن استثنائية.\nلحياةٍ ملهمة.")}</h1><p className="hero-copy">{t(locale,"A carefully curated collection of homes and landmark developments across Egypt's most sought-after destinations.","مجموعة مختارة بعناية من المنازل والمشروعات المميزة في أرقى الوجهات بمصر.")}</p><a className="hero-cta" href={`/${locale}/properties`}>{t(locale,"Explore our collection","اكتشف مجموعتنا")} <ArrowLeft size={18}/></a></div>
      <div className="hero-index"><span>01</span><div/><span>04</span></div>
    </section>

    <section className="search-panel" aria-label="Property search"><div className="search-field"><label>{t(locale,"I am looking to","أبحث عن")}</label><button>{t(locale,"Buy a property","شراء عقار")} <ChevronDown/></button></div><div className="search-field"><label>{t(locale,"Property type","نوع العقار")}</label><button>{t(locale,"All properties","كل العقارات")} <ChevronDown/></button></div><div className="search-field"><label>{t(locale,"Preferred location","الموقع المفضل")}</label><button><MapPin/>{t(locale,"Cairo, Red Sea...","القاهرة، البحر الأحمر...")}</button></div><a className="search-submit" href={`/${locale}/properties`} aria-label="Search"><Search/></a></section>

    <section className="intro section"><div><p className="section-label">01 · {t(locale,"THE NUVEXA EDIT","اختيارات نوفيكسا")}</p><h2>{t(locale,"Property,\nconsidered.","عقارات،\nبرؤية مختلفة.")}</h2></div><div className="intro-copy"><p>{t(locale,"We look beyond square metres. Every property in our collection is selected for its architecture, setting and ability to elevate everyday life.","ننظر إلى ما هو أبعد من المساحات. نختار كل عقار في مجموعتنا لعمارته وموقعه وقدرته على الارتقاء بتفاصيل الحياة اليومية.")}</p><a href={`/${locale}/about`}>{t(locale,"Discover our approach","اكتشف رؤيتنا")} <ArrowUpLeft/></a></div></section>

    <section className="featured section"><div className="section-heading"><div><p className="section-label">02 · {t(locale,"FEATURED PROPERTIES","عقارات مختارة")}</p><h2>{t(locale,"Homes of distinction","منازل استثنائية")}</h2></div><a href={`/${locale}/properties`}>{t(locale,"View all properties","عرض كل العقارات")} <ArrowUpLeft/></a></div>{properties.length?<div className="property-grid">{properties.slice(0,3).map(p => <PropertyCard key={p.slug} property={p} locale={locale}/>)}</div>:<p className="home-empty">{t(locale,"No properties have been added yet.","لم تتم إضافة عقارات بعد.")}</p>}</section>

    <section className="location-break"><img src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=2200&q=88" alt="Cairo skyline at golden hour"/><div className="location-overlay"/><div className="location-content"><p className="section-label">03 · {t(locale,"EXPLORE BY LOCATION","اكتشف حسب الموقع")}</p><h2>{t(locale,"Where will life\ntake you next?","إلى أين ستأخذك\nالحياة؟")}</h2><div className="location-list"><a href={`/${locale}/properties?city=cairo`}><span>{t(locale,"Cairo","القاهرة")}</span><small>{cairoCount} {t(locale,"properties","عقار")}</small><ArrowUpLeft/></a><a href={`/${locale}/properties?city=north-coast`}><span>{t(locale,"North Coast","الساحل الشمالي")}</span><small>{northCoastCount} {t(locale,"properties","عقار")}</small><ArrowUpLeft/></a><a href={`/${locale}/properties?city=red-sea`}><span>{t(locale,"Red Sea","البحر الأحمر")}</span><small>{redSeaCount} {t(locale,"properties","عقار")}</small><ArrowUpLeft/></a></div></div></section>

    <section className="projects section"><div className="section-heading"><div><p className="section-label">04 · {t(locale,"SIGNATURE DEVELOPMENTS","مشروعات مميزة")}</p><h2>{t(locale,"Built for what comes next","مصممة للمستقبل")}</h2></div><a href={`/${locale}/projects`}>{t(locale,"Explore developments","استكشف المشروعات")} <ArrowUpLeft/></a></div>{projects.length?<div className="project-grid">{projects.map((project,i) => <a className="project-card" href={`/${locale}/projects/${project.slug}`} key={project.slug}><img src={project.coverImage || "/placeholder-property.svg"} alt={project.name}/><div className="project-number">0{i+1}</div><div className="project-info"><p>{project.location}</p><h3>{project.name}</h3><span>{project.startingPrice ? new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", { style: "currency", currency: project.currency, maximumFractionDigits: 0 }).format(project.startingPrice) : t(locale,"Price on request","السعر عند الطلب")}</span></div></a>)}</div>:<p className="home-empty">{t(locale,"No projects have been added yet.","لم تتم إضافة مشروعات بعد.")}</p>}</section>

    <section className="why section"><div className="why-image"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85" alt="Refined modern interior"/><span><Building2/> N</span></div><div className="why-copy"><p className="section-label">05 · {t(locale,"WHY NUVEXA","لماذا نوفيكسا")}</p><h2>{t(locale,"Clarity at every step.","وضوح في كل خطوة.")}</h2><p>{t(locale,"Property decisions deserve care, context and honest expertise. From first conversation to final signature, our advisors make every step feel considered.","تستحق القرارات العقارية العناية والمعرفة والخبرة الصادقة. من أول محادثة وحتى التوقيع، يجعل مستشارونا كل خطوة مدروسة وواضحة.")}</p><div className="why-points"><div><strong>01</strong><span>{t(locale,"Curated, not crowded","اختيارات منتقاة")}</span></div><div><strong>02</strong><span>{t(locale,"Local intelligence","خبرة محلية")}</span></div><div><strong>03</strong><span>{t(locale,"Personal advisory","استشارة شخصية")}</span></div></div></div></section>

    <section className="contact-cta"><p>NUVEXA PRIVATE OFFICE</p><h2>{t(locale,"Let’s find your next place.","لنجد مكانك القادم.")}</h2><a href={`/${locale}/contact`}>{t(locale,"Start a conversation","ابدأ محادثة")} <ArrowLeft/></a></section>
    <Footer locale={locale}/>
  </main>;
}
