import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site=process.env.NEXT_PUBLIC_SITE_URL || "https://nuvexa.com";
  const locales=["ar","en","fr","de","es","ru","zh"];
  const routes=["","properties","projects","map","about","contact"];
  return locales.flatMap(locale=>routes.map(route=>({url:`${site}/${locale}/${route}`,lastModified:new Date(),changeFrequency:route?"weekly" as const:"daily" as const,priority:route?0.8:1})));
}
