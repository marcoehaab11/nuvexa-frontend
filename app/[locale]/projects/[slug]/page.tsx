import { MapPin } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PropertyCard } from "@/components/property-card";
import { getProject } from "@/lib/api";
import { isLocale,t } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Project({params}:{params:Promise<{locale:string,slug:string}>}) {
  const {locale,slug}=await params;
  if(!isLocale(locale)) notFound();
  let project;
  try { project=await getProject(locale,slug); } catch { notFound(); }
  return <main dir={locale==="ar"?"rtl":"ltr"} className={locale==="ar"?"arabic inner-page":"inner-page"}><Header locale={locale}/><section className="project-hero"><img src={project.coverImage || "/placeholder-property.svg"} alt={project.name}/><div><p>NUVEXA SIGNATURE DEVELOPMENT</p><h1>{project.name}</h1><span><MapPin/> {project.location}</span></div></section><section className="project-story section"><div><p className="section-label">{t(locale,"THE VISION","الرؤية")}</p><h2>{t(locale,"Space to live\nbeyond the ordinary.","مساحة لحياةٍ\nتتجاوز المألوف.")}</h2></div><p>{project.description}</p></section><section className="related section"><p className="section-label">{t(locale,"AVAILABLE HOMES","الوحدات المتاحة")}</p><h2>{t(locale,"Find your place at ","اختر مكانك في ")}{project.name}</h2><div className="property-grid">{project.properties.map(x=><PropertyCard key={x.slug} property={x} locale={locale}/>)}</div></section><Footer locale={locale}/></main>;
}
