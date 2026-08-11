import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MapExplorer } from "@/components/map-explorer";
import { getProperties } from "@/lib/api";
import { isLocale } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function MapPage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if(!isLocale(locale)) notFound();
  const properties=await getProperties(locale);
  return <main dir={locale==="ar"?"rtl":"ltr"} className={locale==="ar"?"arabic inner-page":"inner-page"}><Header locale={locale} overlay={false}/><MapExplorer locale={locale} properties={properties}/><Footer locale={locale}/></main>;
}
