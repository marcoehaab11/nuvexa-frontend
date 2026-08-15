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

const LOCATION_MAP: Record<string, Record<Locale, string>> = {
  "سهل حشيش": { ar: "سهل حشيش", en: "Sahl Hasheesh", fr: "Sahl Hasheesh", de: "Sahl Hasheesh", es: "Sahl Hasheesh", ru: "Сахл Хашиш", zh: "萨赫勒哈希什" },
  "الجونة": { ar: "الجونة", en: "El Gouna", fr: "El Gouna", de: "El Gouna", es: "El Gouna", ru: "Эль Гуна", zh: "埃尔古纳" },
  "الغردقة": { ar: "الغردقة", en: "Hurghada", fr: "Hurghada", de: "Hurghada", es: "Hurgada", ru: "Хургада", zh: "赫尔格达" },
  "التجمع الخامس": { ar: "التجمع الخامس", en: "New Cairo", fr: "Nouveau Caire", de: "Neu-Kairo", es: "Nuevo Cairo", ru: "Новый Каир", zh: "新开罗" },
  "الشيخ زايد": { ar: "الشيخ زايد", en: "Sheikh Zayed", fr: "Sheikh Zayed", de: "Sheikh Zayed", es: "Sheikh Zayed", ru: "Шейх Заид", zh: "谢赫扎耶德" },
  "الساحل الشمالي": { ar: "الساحل الشمالي", en: "North Coast", fr: "Côte Nord", de: "Nordküste", es: "Costa Norte", ru: "Северное побережье", zh: "北部海岸" },
  "العين السخنة": { ar: "العين السخنة", en: "Ain Sokhna", fr: "Ain Sokhna", de: "Ain Sokhna", es: "Ain Sokhna", ru: "Айн Сохна", zh: "艾因苏赫纳" },
  "شرم الشيخ": { ar: "شرم الشيخ", en: "Sharm El Sheikh", fr: "Charm el-Cheikh", de: "Scharm El-Scheich", es: "Sharm el-Sheij", ru: "Шарм-эль-Шейх", zh: "沙姆沙伊赫" }
};

export function autoTranslateArabicText(text: string, locale: Locale): string {
  if (locale === "ar" || !text) return text;
  if (!/[\u0600-\u06FF]/.test(text)) return text;

  let translated = text;

  // Replace Arabic location names
  Object.entries(LOCATION_MAP).forEach(([arLoc, locDict]) => {
    if (locDict[locale]) {
      translated = translated.replace(new RegExp(arLoc, "g"), locDict[locale]);
    }
  });

  // Translate common title words for English / Target locale
  translated = translated
    .replace(/شقة/g, locale === "fr" ? "Appartement" : locale === "de" ? "Wohnung" : locale === "es" ? "Apartamento" : locale === "ru" ? "Апартаменты" : locale === "zh" ? "公寓" : "Apartment")
    .replace(/فيلا/g, locale === "fr" ? "Villa" : locale === "de" ? "Villa" : locale === "es" ? "Villa" : locale === "ru" ? "Вилла" : locale === "zh" ? "别墅" : "Villa")
    .replace(/دوبلكس/g, "Duplex")
    .replace(/بنتهاوس/g, "Penthouse")
    .replace(/تاون هاوس/g, "Townhouse")
    .replace(/شاليه/g, "Chalet")
    .replace(/للبيع/g, locale === "fr" ? "à vendre" : locale === "de" ? "zum Verkauf" : locale === "es" ? "en venta" : locale === "ru" ? "на продажу" : locale === "zh" ? "出售" : "for Sale")
    .replace(/للإيجار/g, locale === "fr" ? "à louer" : locale === "de" ? "zur Miete" : locale === "es" ? "en alquiler" : locale === "ru" ? "в аренду" : locale === "zh" ? "出租" : "for Rent")
    .replace(/بجانب/g, locale === "fr" ? "près de" : locale === "de" ? "in der Nähe von" : locale === "es" ? "cerca de" : locale === "ru" ? "рядом с" : locale === "zh" ? "靠近" : "near")
    .replace(/في/g, locale === "fr" ? "à" : locale === "de" ? "in" : locale === "es" ? "en" : locale === "ru" ? "в" : locale === "zh" ? "在" : "in")
    .replace(/فندق/g, locale === "fr" ? "Hôtel" : locale === "de" ? "Hotel" : locale === "es" ? "Hotel" : locale === "ru" ? "Отель" : locale === "zh" ? "酒店" : "Hotel")
    .replace(/فاخرة/g, locale === "fr" ? "De Luxe" : locale === "de" ? "Luxus" : locale === "es" ? "De Lujo" : locale === "ru" ? "Роскошный" : locale === "zh" ? "豪华" : "Luxury")
    .replace(/ممتازة/g, "Prime")
    .replace(/عقار/g, "Property")
    .replace(/جديد/g, "New");

  // Replace common Arabic description phrases with natural target locale descriptions
  translated = translated
    .replace(/شقة فاخرة تقع في موقع مميز بالقرب من جميع الخدمات والمرافق الأساسية والترفيهية\./g,
      locale === "fr" ? "Appartement de luxe situé dans un emplacement privilégié à proximité de tous les services et commodités."
      : locale === "de" ? "Luxuswohnung in bester Lage in der Nähe aller wichtigen Dienstleistungen und Einrichtungen."
      : locale === "es" ? "Apartamento de lujo ubicado en una ubicación链接 cerca de todos los servicios y comodidades."
      : locale === "ru" ? "Роскошные апартаменты в первоклассном месте рядом со всеми удобствами."
      : locale === "zh" ? "豪华公寓位于优越位置，靠近所有基本服务和设施。"
      : "Luxury property located in a prime location close to all essential services, amenities, and entertainment.")
    .replace(/تتميز المساحة بالتصميم العصري والتقسيم الذكي للغرف والمساحات المفتوحة\./g,
      locale === "fr" ? "Comprend un design moderne avec un aménagement intelligent de l'espace."
      : locale === "de" ? "Mit modernem Design und intelligenter Raumaufteilung."
      : locale === "es" ? "Cuenta con un diseño moderno y una distribución inteligente del espacio."
      : locale === "ru" ? "Современный дизайн и продуманная планировка."
      : locale === "zh" ? "采用现代设计，空间布局合理。"
      : "Features a modern design with intelligent space layout and open living areas.")
    .replace(/متاحة فوراً للبيع والتسليم بمعايير جودة عالية\./g,
      locale === "fr" ? "Disponible immédiatement à l'achat avec des normes de qualité élevées."
      : locale === "de" ? "Sofort zum Kauf verfügbar mit hohen Qualitätsstandards."
      : locale === "es" ? "Disponible de inmediato para su compra con altos estándares de calidad."
      : locale === "ru" ? "Доступно для немедленной покупки с высокими стандартами качества."
      : locale === "zh" ? "现房可售，高品质交付。"
      : "Available immediately for purchase with high quality standards.")
    .replace(/حمام سباحة خاص/g, t(locale, "Private pool", "حمام سباحة خاص"))
    .replace(/مساحات خضراء/g, t(locale, "Landscaped garden", "مساحات خضراء"))
    .replace(/حراسة 24 ساعة/g, t(locale, "24/7 Security", "حراسة 24 ساعة"))
    .replace(/موقف سيارات/g, t(locale, "Covered parking", "موقف سيارات"));

  return translated;
}

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

  const title = autoTranslateArabicText(rawTitle, locale);
  const description = autoTranslateArabicText(rawDescription, locale);

  return {
    title: title || rawTitle,
    description: description || rawDescription,
    propertyTypeLabel: typeLabel
  };
}
