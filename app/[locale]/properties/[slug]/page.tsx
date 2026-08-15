import { Bath, BedDouble, Building, Check, MapPin, Maximize2, MessageCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { contactPhones } from "@/lib/contact";
import { getProperties, getProperty } from "@/lib/api";
import { isLocale, t } from "@/lib/data";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property-card";

export default async function PropertyPage({params}:{params:Promise<{locale:string,slug:string}>}) {
  const {locale,slug}=await params;
  if(!isLocale(locale)) notFound();
  let p;
  try { p=await getProperty(locale,slug); } catch { notFound(); }
  const related=(await getProperties(locale)).filter(x=>x.slug!==slug).slice(0,3);
  const gallery=p.images.length?p.images:["/placeholder-property.svg"];
  return <main dir={locale==="ar"?"rtl":"ltr"} className={locale==="ar"?"arabic inner-page":"inner-page"}>
    <Header locale={locale} overlay={false}/>
    <section className="detail-gallery-container">
      <div className={`detail-gallery count-${Math.min(gallery.length, 6)}`}>
        {gallery.map((image,i)=><img key={`${image}-${i}`} className={i===0?"detail-main":undefined} src={image} alt={`${p.title} - ${i+1}`}/>)}
      </div>
      {gallery.length > 1 && <span className="gallery-count-badge">📸 {gallery.length} {t(locale,"Photos","صور")}</span>}
    </section>
    <section className="detail-head section">
      <div>
        <p className="section-label">{p.propertyType} · REF {p.referenceNumber}</p>
        <h1>{p.title}</h1>
        <p><MapPin/> {p.location}</p>
      </div>
      <div className="detail-price">
        <small>{t(locale,"ASKING PRICE","السعر المطلوب")}</small>
        <strong>{new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.price)}</strong>
        <span>{t(locale,"Available now","متاح الآن")}</span>
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
        <div><Maximize2/><small>{t(locale,"AREA","المساحة")}</small><strong>{p.areaM2} m²</strong></div>
        <div><BedDouble/><small>{t(locale,"BEDROOMS","غرف النوم")}</small><strong>{p.bedrooms ?? "—"}</strong></div>
        <div><Bath/><small>{t(locale,"BATHROOMS","الحمامات")}</small><strong>{p.bathrooms ?? "—"}</strong></div>
        <div><Building/><small>{t(locale,"TYPE","النوع")}</small><strong>{p.propertyType}</strong></div>
      </aside>
    </section>
    <section className="map-placeholder">
      <div>
        <MapPin/>
        <h2>{t(locale,"Perfectly placed","موقع مثالي")}</h2>
        <p>{p.location}</p>
        <a href={`/${locale}/map`}>{t(locale,"Explore on the map","استكشف على الخريطة")}</a>
      </div>
    </section>
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
