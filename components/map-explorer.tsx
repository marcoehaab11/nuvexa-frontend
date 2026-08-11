"use client";
import { useState } from "react";
import { List,Map as MapIcon,MapPin } from "lucide-react";
import type { PropertyCardData } from "@/lib/api";
import { Locale,t } from "@/lib/data";
import { PropertyCard } from "./property-card";

export function MapExplorer({locale,properties}:{locale:Locale;properties:PropertyCardData[]}) {
  const [view,setView]=useState<"map"|"list">("map");
  return <section className="map-explorer"><div className="map-toolbar"><h1>{t(locale,"Explore by map","استكشف عبر الخريطة")}</h1><button onClick={()=>setView(view==="map"?"list":"map")}>{view==="map"?<List/>:<MapIcon/>}{view==="map"?t(locale,"List view","عرض القائمة"):t(locale,"Map view","عرض الخريطة")}</button></div><div className={view==="map"?"map-layout":"map-layout list-only"}><aside>{properties.map(p=><PropertyCard key={p.slug} property={p} locale={locale}/>)}</aside><div className="map-canvas"><div className="map-grid"/>{properties.map((p,i)=><a key={p.slug} href={`/${locale}/properties/${p.slug}`} className={`map-pin pin-${i+1}`}><MapPin/><span>{new Intl.NumberFormat("en",{notation:"compact",style:"currency",currency:p.currency}).format(p.price)}</span></a>)}<div className="map-label cairo">CAIRO</div><div className="map-label giza">GIZA</div><p>{t(locale,"Property locations are loaded from the NUVEXA database.","يتم تحميل مواقع العقارات من قاعدة بيانات نوفيكسا.")}</p></div></div></section>;
}
