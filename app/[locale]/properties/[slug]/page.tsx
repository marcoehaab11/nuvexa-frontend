import { Bath, BedDouble, Building, Check, MapPin, Maximize2, MessageCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { contactPhones } from "@/lib/contact";
import { getProperties, getProperty } from "@/lib/api";
import { isLocale, t } from "@/lib/data";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { CopyButton } from "@/components/copy-button";

import { PropertyGallery } from "@/components/property-gallery";
import { PropertyInquirySection } from "@/components/property-inquiry";

export default async function PropertyPage({params}:{params:Promise<{locale:string,slug:string}>}) {
  const {locale,slug}=await params;
  if(!isLocale(locale)) notFound();
  const decodedSlug = decodeURIComponent(slug);
  let p;
  try { p=await getProperty(locale,decodedSlug); } catch {
    try { p=await getProperty(locale,slug); } catch { notFound(); }
  }
  const related=(await getProperties(locale)).filter(x=>x.slug!==slug && x.slug!==decodedSlug).slice(0,3);

  return <main dir={locale==="ar"?"rtl":"ltr"} className={locale==="ar"?"arabic inner-page":"inner-page"}>
    <Header locale={locale} overlay={false}/>
    
    <PropertyGallery images={p.images} title={p.title} locale={locale} />

    <section className="detail-head section">
      <div>
        <p className="section-label">{p.propertyType} · REF {p.referenceNumber}</p>
        <h1>{p.title}</h1>
        <p><MapPin/> {p.location}</p>
      </div>
      <div className="detail-price" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
        {p.price > 0 ? (
          <div>
            <small>{t(locale,"ASKING PRICE","السعر المطلوب")}</small>
            <strong>{new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.price)}</strong>
            <span>{t(locale,"Available now","متاح الآن")}</span>
          </div>
        ) : (
          <div style={{ background: "#fef3c7", color: "#b45309", padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "14px", border: "1px solid #fde68a" }}>
            {locale === "ar" ? "السعر عند الاتصال" : "Price on Request"}
          </div>
        )}
        <CopyButton slug={p.slug} variant="icon" />
      </div>
    </section>
    <section className="detail-content section">
      <div className="detail-copy">
        <h2>{p.title}</h2>
        <div className="rich-description-body prose" dangerouslySetInnerHTML={{ __html: p.description }} />
        <h3>{t(locale,"Features & amenities","المزايا والخدمات")}</h3>
        <div className="amenities">{["Private pool","Landscaped garden","24/7 security","Covered parking"].map(x=><span key={x}><Check/> {x}</span>)}</div>
      </div>
      <aside className="spec-panel">
        {Boolean(p.areaM2 && p.areaM2 > 0) && <div><Maximize2/><small>{t(locale,"AREA","المساحة")}</small><strong>{p.areaM2} m²</strong></div>}
        {Boolean(p.bedrooms && p.bedrooms > 0) && <div><BedDouble/><small>{t(locale,"BEDROOMS","غرف النوم")}</small><strong>{p.bedrooms}</strong></div>}
        {Boolean(p.bathrooms && p.bathrooms > 0) && <div><Bath/><small>{t(locale,"BATHROOMS","الحمامات")}</small><strong>{p.bathrooms}</strong></div>}
        {Boolean(p.propertyType) && <div><Building/><small>{t(locale,"TYPE","النوع")}</small><strong>{p.propertyType}</strong></div>}
        {p.isInstallmentAvailable && (
          <div className="installment-detail-card" style={{ gridColumn: "1 / -1", background: "#f8fafc", border: "1px solid #cbd5e1", padding: "20px", borderRadius: "4px", marginTop: "15px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              💳 {locale === "ar" ? "نظام التقسيط والتسهيلات" : "Installment Payment Plan"}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              {p.downPayment ? (
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>{t(locale,"DOWN PAYMENT","المقدم المطلوب")}</small>
                  <strong style={{ color: "#0f172a", fontSize: "15px" }}>
                    {new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.downPayment)}
                  </strong>
                </div>
              ) : null}
              {p.installmentYears ? (
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>{t(locale,"INSTALLMENT YEARS","سنوات التقسيط")}</small>
                  <strong style={{ color: "#0f172a", fontSize: "15px" }}>
                    {p.installmentYears} {t(locale,"Years","سنوات")}
                  </strong>
                </div>
              ) : null}
              {p.monthlyInstallment ? (
                <div style={{ gridColumn: "1 / -1" }}>
                  <small style={{ color: "#64748b", display: "block" }}>{t(locale,"MONTHLY INSTALLMENT","القسط الشهري")}</small>
                  <strong style={{ color: "#059669", fontSize: "16px" }}>
                    {new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.monthlyInstallment)} / {t(locale,"month","شهر")}
                  </strong>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </aside>
    </section>

    <PropertyInquirySection propertyId={p.id} propertyTitle={p.title} locale={locale} />
    <section className="related section">
      <h2>{t(locale,"You may also like","قد يعجبك أيضاً")}</h2>
      <div className="property-grid">{related.map(x=><PropertyCard key={x.slug} property={x} locale={locale}/>)}</div>
    </section>
    <div className="mobile-contact">
      {contactPhones.map((phone,index)=><a key={phone.whatsapp} href={phone.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp {index+1}</a>)}
    </div>
    <Footer locale={locale}/>
  </main>;
}
