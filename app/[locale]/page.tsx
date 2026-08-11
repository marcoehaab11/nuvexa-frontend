import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { isLocale } from "@/lib/data";
import { getProjects, getProperties } from "@/lib/api";

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [properties, projects] = await Promise.all([getProperties(locale), getProjects(locale)]);
  return <HomePage locale={locale} properties={properties} projects={projects}/>;
}
