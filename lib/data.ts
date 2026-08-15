export type Locale = "ar" | "en" | "fr" | "de" | "es" | "ru" | "zh";

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ru: "Русский",
  zh: "中文"
};

export const localeFlags: Record<Locale, string> = {
  ar: "🇪🇬",
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  ru: "🇷🇺",
  zh: "🇨🇳"
};

export function isLocale(value: string): value is Locale {
  return value in localeNames;
}

const UI_DICTIONARY: Record<string, Record<Locale, string>> = {
  "ASKING PRICE": {
    ar: "السعر المطلوب",
    en: "ASKING PRICE",
    fr: "PRIX DEMANDÉ",
    de: "ANGEBOTSPREIS",
    es: "PRECIO SOLICITADO",
    ru: "ЗАПРАШИВАЕМАЯ ЦЕНА",
    zh: "要价"
  },
  "Price on Request": {
    ar: "السعر عند الاتصال",
    en: "Price on Request",
    fr: "Prix sur demande",
    de: "Preis auf Anfrage",
    es: "Precio a consultar",
    ru: "Цена по запросу",
    zh: "价格面议"
  },
  "Available now": {
    ar: "متاح الآن",
    en: "Available now",
    fr: "Disponible maintenant",
    de: "Jetzt verfügbar",
    es: "Disponible ahora",
    ru: "Доступно сейчас",
    zh: "现房/可售"
  },
  "AREA": {
    ar: "المساحة",
    en: "AREA",
    fr: "SUPERFICIE",
    de: "FLÄCHE",
    es: "SUPERFICIE",
    ru: "ПЛОЩАДЬ",
    zh: "面积"
  },
  "BEDROOMS": {
    ar: "غرف النوم",
    en: "BEDROOMS",
    fr: "CHAMBRES",
    de: "SCHLAFZIMMER",
    es: "DORMITORIOS",
    ru: "СПАЛЬНИ",
    zh: "卧室"
  },
  "BATHROOMS": {
    ar: "الحمامات",
    en: "BATHROOMS",
    fr: "SALLES DE BAIN",
    de: "BADEZIMMER",
    es: "BAÑOS",
    ru: "ВАННЫЕ",
    zh: "浴室"
  },
  "TYPE": {
    ar: "النوع",
    en: "TYPE",
    fr: "TYPE",
    de: "TYP",
    es: "TIPO",
    ru: "ТИП",
    zh: "类型"
  },
  "DOWN PAYMENT": {
    ar: "المقدم المطلوب",
    en: "DOWN PAYMENT",
    fr: "ACOMPTE",
    de: "ANZAHLUNG",
    es: "PAGO INICIAL",
    ru: "ПЕРВОНАЧАЛЬНЫЙ ВЗНОС",
    zh: "首付"
  },
  "INSTALLMENT YEARS": {
    ar: "سنوات التقسيط",
    en: "INSTALLMENT YEARS",
    fr: "ANNÉES DE VERSEMENT",
    de: "RATENJAHRE",
    es: "AÑOS DE PLAZO",
    ru: "ГОДЫ РАССРОЧКИ",
    zh: "分期年限"
  },
  "MONTHLY INSTALLMENT": {
    ar: "القسط الشهري",
    en: "MONTHLY INSTALLMENT",
    fr: "VERSEMENT MENSUEL",
    de: "MONATLICHE RATE",
    es: "CUOTA MENSUAL",
    ru: "ЕЖЕМЕСЯЧНЫЙ ПЛАТЕЖ",
    zh: "月供"
  },
  "Features & amenities": {
    ar: "المزايا والخدمات",
    en: "Features & Amenities",
    fr: "Équipements et services",
    de: "Ausstattung & Merkmale",
    es: "Servicios y comodidades",
    ru: "Удобства и особенности",
    zh: "设施与服务"
  },
  "You may also like": {
    ar: "قد يعجبك أيضاً",
    en: "You May Also Like",
    fr: "Vous aimerez aussi",
    de: "Das könnte Ihnen auch gefallen",
    es: "También te может gustar",
    ru: "Вам также может понравиться",
    zh: "猜你喜欢"
  },
  "Photos": {
    ar: "صور",
    en: "Photos",
    fr: "Photos",
    de: "Fotos",
    es: "Fotos",
    ru: "Фотографии",
    zh: "照片"
  },
  "Years": {
    ar: "سنوات",
    en: "Years",
    fr: "ans",
    de: "Jahre",
    es: "años",
    ru: "лет",
    zh: "年"
  },
  "month": {
    ar: "شهر",
    en: "month",
    fr: "mois",
    de: "Monat",
    es: "mes",
    ru: "месяц",
    zh: "月"
  },
  "Apartment": {
    ar: "شقة",
    en: "Apartment",
    fr: "Appartement",
    de: "Wohnung",
    es: "Apartamento",
    ru: "Апартаменты",
    zh: "公寓"
  },
  "Villa": {
    ar: "فيلا",
    en: "Villa",
    fr: "Villa",
    de: "Villa",
    es: "Villa",
    ru: "Вилла",
    zh: "别墅"
  },
  "Duplex": {
    ar: "دوبلكس",
    en: "Duplex",
    fr: "Duplex",
    de: "Duplex",
    es: "Dúplex",
    ru: "Дуплекс",
    zh: "复式"
  },
  "Penthouse": {
    ar: "بنتهاوس",
    en: "Penthouse",
    fr: "Penthouse",
    de: "Penthouse",
    es: "Ático",
    ru: "Пентхаус",
    zh: "顶层豪宅"
  },
  "Townhouse": {
    ar: "تاون هاوس",
    en: "Townhouse",
    fr: "Maison de ville",
    de: "Stadthaus",
    es: "Casa adosada",
    ru: "Таунхаус",
    zh: "联排别墅"
  },
  "Chalet": {
    ar: "شاليه",
    en: "Chalet",
    fr: "Chalet",
    de: "Chalet",
    es: "Chalet",
    ru: "Шале",
    zh: "度假别墅"
  },
  "Office": {
    ar: "مكتب إداري",
    en: "Office",
    fr: "Bureau",
    de: "Büro",
    es: "Oficina",
    ru: "Офис",
    zh: "办公室"
  },
  "Retail": {
    ar: "محل تجاري",
    en: "Retail",
    fr: "Commerce",
    de: "Einzelhandel",
    es: "Local comercial",
    ru: "Торговое помещение",
    zh: "零售商铺"
  },
  "Commercial": {
    ar: "عقار تجاري",
    en: "Commercial",
    fr: "Commercial",
    de: "Gewerbe",
    es: "Comercial",
    ru: "Коммерческая недвижимость",
    zh: "商业"
  },
  "Land": {
    ar: "أرض",
    en: "Land",
    fr: "Terrain",
    de: "Grundstück",
    es: "Terreno",
    ru: "Земельный участок",
    zh: "土地"
  },
  "Private pool": {
    ar: "حمام سباحة خاص",
    en: "Private pool",
    fr: "Piscine privée",
    de: "Privater Pool",
    es: "Piscina privada",
    ru: "Частный бассейн",
    zh: "私人泳池"
  },
  "Landscaped garden": {
    ar: "حديقة خاصة ومساحات خضراء",
    en: "Landscaped garden",
    fr: "Jardin paysager",
    de: "Landschaftsgarten",
    es: "Jardín paisajístico",
    ru: "Ландшафтный сад",
    zh: "景观花园"
  },
  "24/7 security": {
    ar: "حراسة وأمن 24/7",
    en: "24/7 Security",
    fr: "Sécurité 24/7",
    de: "24/7 Sicherheit",
    es: "Seguridad 24/7",
    ru: "Круглосуточная охрана",
    zh: "24/7 安保"
  },
  "Covered parking": {
    ar: "موقف سيارات مغطى",
    en: "Covered parking",
    fr: "Parking couvert",
    de: "Überdachter Parkplatz",
    es: "Aparcamiento cubierto",
    ru: "Крытая парковка",
    zh: "有棚停车场"
  }
};

export function t(locale: Locale, en: string, ar: string) {
  const normKey = en.trim();
  const dictMatch = UI_DICTIONARY[normKey] || UI_DICTIONARY[en];
  if (dictMatch && dictMatch[locale]) {
    return dictMatch[locale];
  }

  if (locale === "ar") return ar;
  if (locale === "en") return en;

  return dictMatch?.en || en;
}
