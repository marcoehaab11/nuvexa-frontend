import { BedDouble, Bath, Maximize2, ArrowUpLeft } from "lucide-react";
import Image from "next/image";
import type { PropertyCardData } from "@/lib/api";
import { Locale, t } from "@/lib/data";

export function PropertyCard({ property, locale }: { property: PropertyCardData; locale: Locale }) {
  const price = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.price);
  return <article className="property-card">
    <a className="card-image" href={`/${locale}/properties/${property.slug}`}>
      <Image src={property.coverImage || "/placeholder-property.svg"} alt={property.title} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"/>
      <span>{t(locale, property.status, property.status === "ComingSoon" ? "قريباً" : "متاح")}</span>
      {property.isInstallmentAvailable && (
        <span className="installment-card-badge">💳 {locale === "ar" ? "متاح تقسيط" : "Installments Available"}</span>
      )}
    </a>
    <div className="card-body">
      <p className="eyebrow">{property.company?.name || property.referenceNumber} · {property.location}</p>
      <div className="card-title"><h3>{property.title}</h3><ArrowUpLeft size={20}/></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="price">{price}</p>
        {property.installmentYears && (
          <small style={{ color: "#059669", fontWeight: 600, fontSize: 11 }}>
            {locale === "ar" ? `حتى ${property.installmentYears} سنوات` : `Up to ${property.installmentYears} yrs`}
          </small>
        )}
      </div>
      <div className="card-specs">
        <span><Maximize2/> {property.areaM2} m²</span>
        <span><BedDouble/> {property.bedrooms ?? "—"}</span>
        <span><Bath/> {property.bathrooms ?? "—"}</span>
      </div>
    </div>
  </article>;
}
