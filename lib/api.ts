import type { Locale } from "@/lib/data";

export type CompanySummaryData = { id: string; name: string; slug: string; logoUrl: string | null; };
export type CompanyData = CompanySummaryData & { legalName: string | null; website: string | null; email: string | null; phone: string | null; address: string | null; description: string | null; isActive: boolean; propertyCount: number; };
export type PropertyCardData = { id: string; referenceNumber: string; title: string; slug: string; location: string; price: number; currency: string; areaM2: number; bedrooms: number | null; bathrooms: number | null; coverImage: string | null; isFeatured: boolean; status: string; company: CompanySummaryData | null; isInstallmentAvailable?: boolean; downPayment?: number | null; installmentYears?: number | null; monthlyInstallment?: number | null; };
export type PropertyDetailData = PropertyCardData & { description: string; propertyType: string; latitude: number | null; longitude: number | null; images: string[]; isInstallmentAvailable?: boolean; downPayment?: number | null; installmentYears?: number | null; monthlyInstallment?: number | null; };
export type ProjectCardData = { id: string; referenceNumber: string; name: string; slug: string; location: string; startingPrice: number | null; currency: string; coverImage: string | null; isFeatured: boolean; };
export type ProjectDetailData = ProjectCardData & { description: string; deliveryDate: string | null; latitude: number | null; longitude: number | null; properties: PropertyCardData[]; };

const apiBase = () => (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://nuvexa.runasp.net").replace(/\/$/, "");
async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`NUVEXA API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}
export function getProperties(locale: Locale, query = "") { return apiGet<PropertyCardData[]>(`/api/public/properties?locale=${locale}${query}`).catch(() => []); }
export function getProperty(locale: Locale, slug: string) { return apiGet<PropertyDetailData>(`/api/public/properties/${encodeURIComponent(slug)}?locale=${locale}`); }
export function getProjects(locale: Locale) { return apiGet<ProjectCardData[]>(`/api/public/projects?locale=${locale}`).catch(() => []); }
export function getProject(locale: Locale, slug: string) { return apiGet<ProjectDetailData>(`/api/public/projects/${encodeURIComponent(slug)}?locale=${locale}`); }
export function getCompanies(search = "") { return apiGet<CompanyData[]>(`/api/public/companies${search ? `?search=${encodeURIComponent(search)}` : ""}`).catch(() => []); }
