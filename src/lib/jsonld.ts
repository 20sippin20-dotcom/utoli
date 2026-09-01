import type { Product } from '@/config/site';
import { products, site } from '@/config/site';
import { productPath, routes } from '@/config/routes';
import { absoluteAsset, absoluteUrl } from '@/lib/url';

/**
 * JSON-LD собирается из того же конфига, что и видимый контент.
 *
 * Главное правило: неизвестное поле не выводится вообще. Пустая строка, null,
 * относительный URL и price: 0 недопустимы — их отсекает clean().
 */

export type JsonLdValue = string | number | boolean | JsonLdObject | JsonLdValue[];
export interface JsonLdObject {
  [key: string]: JsonLdValue | null | undefined;
}

/** Рекурсивно убирает null, undefined, пустые строки, пустые объекты и массивы. */
export function clean<T extends JsonLdObject>(input: T): JsonLdObject {
  const output: JsonLdObject = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') {
      if (value.trim().length === 0) continue;
      output[key] = value;
      continue;
    }
    if (Array.isArray(value)) {
      const items = value
        .map((item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
            ? clean(item as JsonLdObject)
            : item,
        )
        .filter((item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
            ? Object.keys(item).length > 0
            : item !== null && item !== undefined && item !== '',
        );
      if (items.length === 0) continue;
      output[key] = items as JsonLdValue[];
      continue;
    }
    if (typeof value === 'object') {
      const nested = clean(value as JsonLdObject);
      if (Object.keys(nested).length === 0) continue;
      output[key] = nested;
      continue;
    }
    output[key] = value;
  }

  return output;
}

const ORGANIZATION_ID = () => `${absoluteUrl('/')}#organization`;
const WEBSITE_ID = () => `${absoluteUrl('/')}#website`;

/** Подтверждённые профили организации. 2ГИС и Яндекс Бизнес добавятся сами, когда появятся. */
function sameAs(): string[] {
  return [site.vkUrl, site.twoGisUrl, site.yandexBusinessUrl].filter(
    (url): url is string => typeof url === 'string' && url.length > 0,
  );
}

function postalAddress(): JsonLdObject | null {
  if (!site.address) return null;
  return {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.postalCode,
    addressCountry: 'RU',
  };
}

function openingHours(): JsonLdObject | null {
  if (!site.workingHours) return null;
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: site.workingHours.days,
    opens: site.workingHours.opens,
    closes: site.workingHours.closes,
  };
}

/**
 * Базовый LocalBusiness: более узкого типа для доставки воды в словаре Schema.org нет,
 * выдумывать WaterDeliveryService нельзя.
 */
export function organizationJsonLd(): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORGANIZATION_ID(),
    name: `«${site.brandNameRu}» — доставка воды в ${site.cityPrepositional}`,
    legalName: site.legalName,
    alternateName: site.brandNameLatin,
    url: absoluteUrl('/'),
    logo: absoluteAsset('/icon.png'),
    image: absoluteAsset('/icon.png'),
    telephone: site.dispatcherPhoneDisplay,
    email: site.email,
    address: postalAddress(),
    openingHoursSpecification: openingHours(),
    areaServed: site.deliveryAreas.map((area) => ({ '@type': 'City', name: area })),
    sameAs: sameAs(),
  });
}

export function webSiteJsonLd(): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID(),
    name: `«${site.brandNameRu}» ${site.brandNameLatin}`,
    url: absoluteUrl('/'),
    inLanguage: 'ru-RU',
    publisher: { '@id': ORGANIZATION_ID() },
  });
}

/**
 * Product без Offer, пока цена не подтверждена.
 * price: 0, пустая строка и «уточняется» недопустимы.
 */
export function productJsonLd(product: Product): JsonLdObject {
  const hasOffer = product.price !== null && product.price > 0 && product.availability !== null;

  return clean({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: absoluteAsset(`/images/${product.image}`),
    sku: product.sku,
    brand: { '@type': 'Brand', name: site.brandNameRu },
    url: absoluteUrl(productPath(product.slug)),
    offers: hasOffer
      ? {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: `https://schema.org/${product.availability}`,
          url: absoluteUrl(productPath(product.slug)),
          seller: { '@id': ORGANIZATION_ID() },
        }
      : null,
  });
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function itemListJsonLd(): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Вода «${site.brandNameRu}» 19 л`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: absoluteUrl(productPath(product.slug)),
    })),
  });
}

/** FAQPage — только для вопросов, реально видимых на этой странице. */
export function faqJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });
}

/** Без aggregateRating, числа скачиваний и цены: этих данных у нас нет. */
export function mobileAppJsonLd(): JsonLdObject {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: `${site.brandNameLatin} — доставка воды в ${site.cityPrepositional}`,
    applicationCategory: 'ShoppingApplication',
    operatingSystem: 'Android, iOS',
    url: absoluteUrl(routes.app.path),
    downloadUrl: [site.googlePlayUrl, site.appStoreUrl],
    publisher: { '@id': ORGANIZATION_ID() },
  });
}
