import type { Metadata } from 'next';

import { site } from '@/config/site';
import { absoluteUrl } from '@/lib/url';

/**
 * Общая OG-картинка сайта. Путь со слешем на конце — совпадает с
 * trailingSlash: true, поэтому соцсети не ходят через 308-редирект.
 */
const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image/',
  width: 1200,
  height: 630,
  alt: 'Доставка воды «Утоли» 19 л в Ухте',
};

interface PageMetaInput {
  title: string;
  description: string;
  /** Канонический путь с завершающим слешем. */
  path: string;
  /** Страница исключается из индекса (служебные страницы). */
  noindex?: boolean;
  /** Своё og:image (например, фотография товара). */
  image?: { url: string; width: number; height: number; alt: string };
}

/**
 * Единая сборка метаданных: canonical, Open Graph и Twitter-карточка
 * всегда согласованы между собой и с абсолютным production-доменом.
 */
export function pageMetadata({ title, description, path, noindex, image }: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: `«${site.brandNameRu}» — доставка воды в ${site.cityPrepositional}`,
      title,
      description,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}
