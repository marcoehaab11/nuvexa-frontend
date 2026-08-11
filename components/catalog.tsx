"use client";
import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { PropertyCardData } from "@/lib/api";
import { Locale, t } from "@/lib/data";
import { PropertyCard } from "./property-card";

export function Catalog({ locale, properties }: { locale: Locale; properties: PropertyCardData[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(false);
  const shown = useMemo(() => properties.filter(p => `${p.title} ${p.location} ${p.referenceNumber}`.toLowerCase().includes(query.toLowerCase())), [properties, query]);
  return <><section className="catalog-hero"><p className="section-label">NUVEXA COLLECTION</p><h1>{t(locale,"Find a place\nthat feels yours.","ابحث عن مكانٍ\nيشبهك.")}</h1><p>{t(locale,"Explore a considered collection of homes across Egypt's most desirable destinations.","استكشف مجموعة منتقاة من المنازل في أرقى وجهات مصر.")}</p></section><div className="catalog-bar"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t(locale,"Search by location or name","ابحث بالموقع أو الاسم")}/></label><button onClick={()=>setFilters(!filters)}><SlidersHorizontal/> {t(locale,"Filters","التصفية")} {filters ? <X/> : <ChevronDown/>}</button></div>{filters&&<div className="filter-strip"><button>{t(locale,"For sale","للبيع")}</button><button>{t(locale,"Price range","نطاق السعر")}</button><button>{t(locale,"Bedrooms","غرف النوم")}</button><button>{t(locale,"Area","المساحة")}</button></div>}<section className="catalog-results section"><div className="result-count"><span>{shown.length} {t(locale,"properties","عقارات")}</span><span>{t(locale,"Sorted by Featured","الترتيب: المميز")}</span></div><div className="property-grid">{shown.map(p=><PropertyCard key={p.slug} property={p} locale={locale}/>)}</div>{!shown.length&&<p className="empty-state">{t(locale,"No properties match your search.","لا توجد عقارات مطابقة لبحثك.")}</p>}</section></>;
}
