/**
 * ЕДИНСТВЕННЫЙ источник истины по бизнес-данным «Утоли».
 *
 * Правила:
 * 1. Ни один телефон, URL, цена или режим работы не дублируется в компонентах.
 * 2. Неподтверждённое значение = null (или пустой массив). Компонент обязан скрыть
 *    соответствующий блок, а не подставить догадку.
 * 3. Всё, что помечено TODO_OWNER, ждёт данных от владельца бизнеса. Список
 *    незаполненного собирается автоматически — см. missingBusinessData().
 */

export type Nullable<T> = T | null;

export type ProductVariant = 'classic' | 'magnesium' | 'premium';

export interface ProductSeo {
  title: string;
  description: string;
  h1: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Полное имя в русскоязычном тексте. */
  name: string;
  /** Короткое имя для карточек и хлебных крошек. */
  shortName: string;
  volumeLiters: number;
  variant: ProductVariant;
  /** Имя файла внутри src/assets/images (импорт — в src/lib/product-images.ts). */
  image: string;
  imageAlt: string;
  /** null = цена не подтверждена. Никогда не 0 и не строка «уточняется». */
  price: Nullable<number>;
  currency: 'RUB';
  /** null = наличие не подтверждено, Offer в JSON-LD не выводится. */
  availability: Nullable<'InStock' | 'OutOfStock' | 'PreOrder'>;
  sku: Nullable<string>;
  shortDescription: string;
  /** Только проверяемые факты: то, что видно на этикетке или подтверждено владельцем. */
  verifiedFacts: { label: string; value: string }[];
  /** CSS-переменная акцента варианта. */
  accentColor: string;
  /** Второй акцент: у Premium — умеренное золото с этикетки, у остальных совпадает с основным. */
  accentColorSecondary: string;
  seo: ProductSeo;
}

export interface WorkingHours {
  opens: string;
  closes: string;
  /** Дни в формате Schema.org: Monday, Tuesday, ... */
  days: string[];
}

export interface SiteConfig {
  brandNameRu: string;
  brandNameLatin: string;
  legalName: Nullable<string>;
  /** ОГРНИП и ИНН — из карты партнёра и сертификата соответствия. */
  ogrnip: Nullable<string>;
  inn: Nullable<string>;
  email: Nullable<string>;
  /** Берётся из NEXT_PUBLIC_SITE_URL, а не прописывается руками. */
  domain: Nullable<string>;
  city: string;
  cityPrepositional: string;
  region: string;
  country: string;
  postalCode: Nullable<string>;
  address: Nullable<string>;
  dispatcherPhoneDisplay: string;
  dispatcherPhoneHref: string;
  vkUrl: string;
  twoGisUrl: Nullable<string>;
  yandexBusinessUrl: Nullable<string>;
  googlePlayUrl: string;
  appStoreUrl: string;
  appName: string;
  appBundleId: string;
  workingHours: Nullable<WorkingHours>;
  /** Населённые пункты зоны доставки. Используется в списках и в areaServed. */
  deliveryAreas: string[];
  /** Та же зона обычной фразой — для текста на странице. */
  deliveryAreasSummary: string;
  paymentMethods: string[];
  bottleDepositText: Nullable<string>;
  freeDeliveryThreshold: Nullable<number>;
  legalDisclaimer: Nullable<string>;
  analytics: { yandexMetrikaId: Nullable<string>; ga4Id: Nullable<string> };
  searchVerification: { google: Nullable<string>; yandex: Nullable<string> };
}

function env(name: string): Nullable<string> {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : null;
}

export const site: SiteConfig = {
  brandNameRu: 'Утоли',
  brandNameLatin: 'UTOLI',

  legalName: 'ИП Колбаско Леонид Владимирович',
  ogrnip: '325110000037204',
  inn: '110205292498',
  email: 'utoli-ukhta@mail.ru',
  domain: env('NEXT_PUBLIC_SITE_URL'),

  city: 'Ухта',
  cityPrepositional: 'Ухте',
  region: 'Республика Коми',
  country: 'Россия',
  postalCode: '169300',
  // Адрес места осуществления деятельности из декларации и сертификата.
  address: 'ул. Печорская, д. 31',

  dispatcherPhoneDisplay: '+7 (8216) 77-75-75',
  dispatcherPhoneHref: 'tel:+78216777575',

  vkUrl: 'https://vk.ru/utoli11',
  twoGisUrl: null, // TODO_OWNER
  yandexBusinessUrl: null, // TODO_OWNER

  googlePlayUrl: 'https://play.google.com/store/apps/details?id=ru.aquadelivery.utoli.client',
  appStoreUrl: 'https://apps.apple.com/ru/app/id6758051720',
  appName: 'Utoli',
  appBundleId: 'ru.aquadelivery.utoli.client',

  workingHours: null, // TODO_OWNER
  deliveryAreas: ['Ухта', 'Шудаяг', 'Водный', 'Ярега', 'Сосногорск'],
  deliveryAreasSummary: 'Ухта и пригороды — Шудаяг, Водный, Ярега, — а также Сосногорск',
  paymentMethods: [], // TODO_OWNER
  bottleDepositText: null, // TODO_OWNER
  freeDeliveryThreshold: null, // TODO_OWNER
  legalDisclaimer: null, // TODO_OWNER

  analytics: {
    yandexMetrikaId: env('NEXT_PUBLIC_YM_ID'),
    ga4Id: env('NEXT_PUBLIC_GA_ID'),
  },
  searchVerification: {
    google: env('NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION'),
    yandex: env('NEXT_PUBLIC_YANDEX_VERIFICATION'),
  },
};

export const products: Product[] = [
  {
    id: 'utoli-19l',
    slug: 'utoli-19l',
    name: 'Вода «Утоли» 19 л',
    shortName: '«Утоли»',
    volumeLiters: 19,
    variant: 'classic',
    image: 'utoli-19l.jpg',
    imageAlt: 'Бутыль питьевой воды Утоли 19 л',
    price: null,
    currency: 'RUB',
    availability: null,
    sku: null,
    shortDescription: 'Питьевая вода «Утоли» в бутыли 19 л.',
    verifiedFacts: [
      { label: 'Объём', value: '19 л' },
      { label: 'Категория', value: 'Природная питьевая вода первой категории' },
      { label: 'Срок годности', value: '24 месяца' },
      { label: 'Тара', value: 'Бутыль с ручкой, многооборотная' },
    ],
    accentColor: 'var(--accent-classic)',
    accentColorSecondary: 'var(--accent-classic)',
    seo: {
      h1: 'Вода «Утоли» 19 л с доставкой в Ухте',
      title: 'Вода «Утоли» 19 л — доставка в Ухте',
      description:
        'Питьевая вода «Утоли» в бутыли 19 л с доставкой по Ухте. Заказ в приложении Utoli или у диспетчера.',
    },
  },
  {
    id: 'utoli-magniy-19l',
    slug: 'utoli-magniy-19l',
    name: 'Вода «Утоли Магний» 19 л',
    shortName: '«Утоли Магний»',
    volumeLiters: 19,
    variant: 'magnesium',
    image: 'utoli-magniy-19l.jpg',
    imageAlt: 'Бутыль воды Утоли Магний 19 л',
    price: null,
    currency: 'RUB',
    availability: null,
    sku: null,
    shortDescription: 'Питьевая вода «Утоли» с магнием, бутыль 19 л.',
    verifiedFacts: [
      { label: 'Объём', value: '19 л' },
      { label: 'Особенность', value: 'Вода с магнием' },
      { label: 'Категория', value: 'Природная питьевая вода первой категории' },
      { label: 'Срок годности', value: '24 месяца' },
    ],
    accentColor: 'var(--accent-magnesium)',
    accentColorSecondary: 'var(--accent-magnesium)',
    seo: {
      h1: 'Вода «Утоли Магний» 19 л с доставкой в Ухте',
      title: 'Вода «Утоли Магний» 19 л — доставка в Ухте',
      description:
        'Питьевая вода «Утоли» с магнием в бутыли 19 л и доставкой по Ухте. Заказ в приложении Utoli или по телефону.',
    },
  },
  {
    id: 'utoli-premium-19l',
    slug: 'utoli-premium-19l',
    name: 'Вода «Утоли Premium» 19 л',
    shortName: '«Утоли Premium»',
    volumeLiters: 19,
    variant: 'premium',
    image: 'utoli-premium-19l.jpg',
    imageAlt: 'Бутыль воды Утоли Premium 19 л',
    price: null,
    currency: 'RUB',
    availability: null,
    sku: null,
    shortDescription: 'Премиальная линейка «Утоли» 19 л с добавлением ионов серебра.',
    verifiedFacts: [
      { label: 'Объём', value: '19 л' },
      { label: 'Особенность', value: 'С добавлением ионов серебра' },
      { label: 'Категория', value: 'Природная питьевая вода первой категории' },
      { label: 'Срок годности', value: '24 месяца' },
    ],
    accentColor: 'var(--accent-premium)',
    accentColorSecondary: 'var(--accent-gold)',
    seo: {
      h1: 'Вода «Утоли Premium» 19 л с доставкой в Ухте',
      title: 'Вода «Утоли Premium» 19 л — доставка в Ухте',
      description:
        'Премиальная линейка «Утоли» 19 л с ионами серебра и доставкой по Ухте. Заказ в приложении Utoli или у диспетчера.',
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function otherProducts(slug: string): Product[] {
  return products.filter((product) => product.slug !== slug);
}

/** Бизнес-данные, которых ещё нет. Используется в README-чеклисте и в тестах. */
export function missingBusinessData(): string[] {
  const missing: string[] = [];
  if (!site.legalName) missing.push('legalName — юридическое название');
  if (!site.address) missing.push('address — подтверждённый адрес');
  if (!site.postalCode) missing.push('postalCode — почтовый индекс');
  if (!site.workingHours) missing.push('workingHours — график приёма заказов');
  if (site.paymentMethods.length === 0) missing.push('paymentMethods — способы оплаты');
  if (!site.bottleDepositText) missing.push('bottleDepositText — условия по возвратной таре');
  if (site.freeDeliveryThreshold === null) {
    missing.push('freeDeliveryThreshold — порог бесплатной доставки');
  }
  if (!site.twoGisUrl) missing.push('twoGisUrl — карточка 2ГИС');
  if (!site.yandexBusinessUrl) missing.push('yandexBusinessUrl — карточка Яндекс Бизнес');
  if (!site.legalDisclaimer) missing.push('legalDisclaimer — согласованная юридическая оговорка');
  for (const product of products) {
    if (product.price === null) missing.push(`price — цена для «${product.name}»`);
  }
  return missing;
}
