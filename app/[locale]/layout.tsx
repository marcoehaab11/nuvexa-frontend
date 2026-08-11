import type { Metadata } from "next";import { isLocale,localeNames } from "@/lib/data";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const{locale}=await params;if(!isLocale(locale))return{};const languages=Object.fromEntries(Object.keys(localeNames).map(code=>[code,`https://nuvexa.com/${code}`]));return{alternates:{canonical:`https://nuvexa.com/${locale}`,languages},openGraph:{locale:locale==="ar"?"ar_EG":locale}}}
export default function LocaleLayout({children}:{children:React.ReactNode}){return children}
