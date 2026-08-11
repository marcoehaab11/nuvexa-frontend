import { ArrowUpLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getProjects } from "@/lib/api";
import { isLocale,t } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Projects({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if(!isLocale(locale)) notFound();
  const projects=await getProjects(locale);
  return <main dir={locale==="ar"?"rtl":"ltr"} className={locale==="ar"?"arabic inner-page":"inner-page"}><Header locale={locale} overlay={false}/><section className="catalog-hero"><p className="section-label">NUVEXA DEVELOPMENTS</p><h1>{t(locale,"Landmarks for\nmodern life.","معالم لحياةٍ\nعصرية.")}</h1></section><section className="project-list section">{projects.map((p,i)=><a href={`/${locale}/projects/${p.slug}`} key={p.slug}><div className="project-list-image"><img src={p.coverImage || "/placeholder-property.svg"} alt={p.name}/><span>0{i+1}</span></div><div><p>{p.location}</p><h2>{p.name}</h2><span>{p.startingPrice ? new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.startingPrice) : t(locale,"Price on request","السعر عند الطلب")}</span></div><ArrowUpLeft/></a>)}</section><Footer locale={locale}/></main>;
}
