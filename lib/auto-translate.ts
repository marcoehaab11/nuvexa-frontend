import type { Locale } from "./data";
import { t } from "./data";

export interface PropertyLocalizedData {
  title: string;
  description: string;
  propertyTypeLabel: string;
}

const PROPERTY_TYPE_MAP: Record<string, Record<Locale, string>> = {
  Apartment: { ar: "شقة سكنية", en: "Apartment", fr: "Appartement", de: "Wohnung", es: "Apartamento", ru: "Апартаменты", zh: "公寓" },
  Villa: { ar: "فيلا فاخرة", en: "Luxury Villa", fr: "Villa de luxe", de: "Luxusvilla", es: "Villa de lujo", ru: "Роскошная вилла", zh: "豪华别墅" },
  Duplex: { ar: "دوبلكس", en: "Duplex", fr: "Duplex", de: "Duplex", es: "Dúplex", ru: "Дуплекс", zh: "复式住宅" },
  Penthouse: { ar: "بنتهاوس", en: "Penthouse", fr: "Penthouse", de: "Penthouse", es: "Ático", ru: "Пентхаус", zh: "顶层豪宅" },
  Townhouse: { ar: "تاون هاوس", en: "Townhouse", fr: "Maison de ville", de: "Stadthaus", es: "Casa adosada", ru: "Таунхаус", zh: "联排别墅" },
  Chalet: { ar: "شاليه شاطئي", en: "Beach Chalet", fr: "Chalet de plage", de: "Strand-Chalet", es: "Chalet de playa", ru: "Пляжное шале", zh: "海滩木屋" },
  Office: { ar: "مكتب إداري", en: "Administrative Office", fr: "Bureau administratif", de: "Verwaltungsbüro", es: "Oficina administrativa", ru: "Офисное помещение", zh: "行政办公室" },
  Retail: { ar: "محل تجاري", en: "Retail Store", fr: "Local commercial", de: "Ladenlokal", es: "Local comercial", ru: "Торговая точка", zh: "零售店铺" },
  Commercial: { ar: "عقار تجاري", en: "Commercial Property", fr: "Propriété commerciale", de: "Gewerbeimmobilie", es: "Propiedad comercial", ru: "Коммерческий объект", zh: "商业地产" },
  Land: { ar: "أرض للبيع", en: "Land Plot", fr: "Terrain à vendre", de: "Baugrundstück", es: "Terreno en venta", ru: "Земельный участок", zh: "土地出售" }
};

export function getLocalizedPropertyContent(
  rawTitle: string,
  rawDescription: string,
  propertyType: string,
  location: string,
  locale: Locale
): PropertyLocalizedData {
  const typeKey = Object.keys(PROPERTY_TYPE_MAP).find(
    (k) => k.toLowerCase() === propertyType?.toLowerCase()
  ) || "Apartment";

  const typeLabel = PROPERTY_TYPE_MAP[typeKey]?.[locale] || propertyType;

  let title = rawTitle;
  let description = rawDescription;

  // If locale is not Arabic/English and raw title contains Arabic, present clean multi-lingual title:
  if (locale !== "ar" && locale !== "en") {
    const isArabicTitle = /[\u0600-\u06FF]/.test(rawTitle);
    if (isArabicTitle) {
      title = `${typeLabel} - ${location}`;
    }
  }

  // Format description & replace features / specs for the 7 locales
  if (description) {
    description = description
      .replace(/حمام سباحة خاص/g, t(locale, "Private pool", "حمام سباحة خاص"))
      .replace(/مساحات خضراء/g, t(locale, "Landscaped garden", "مساحات خضراء"))
      .replace(/حراسة 24 ساعة/g, t(locale, "24/7 Security", "حراسة 24 ساعة"))
      .replace(/موقف سيارات/g, t(locale, "Covered parking", "موقف سيارات"));
  }

  return {
    title: title || rawTitle,
    description: description || rawDescription,
    propertyTypeLabel: typeLabel
  };
}
