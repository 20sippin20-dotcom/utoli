/**
 * Абсолютные URL для canonical, Open Graph, sitemap и JSON-LD.
 *
 * NEXT_PUBLIC_SITE_URL обязателен в production: без него нельзя выпускать сайт
 * с относительными canonical и og:image. В dev допускается localhost.
 */

const FALLBACK_DEV_URL = 'http://localhost:3000';

function resolveBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NEXT_PUBLIC_SITE_URL не задан. Production-сборка остановлена: без канонического ' +
          'домена нельзя сгенерировать canonical, sitemap.xml, Open Graph и JSON-LD.',
      );
    }
    return FALLBACK_DEV_URL;
  }

  const normalized = raw.replace(/\/+$/, '');

  if (!/^https?:\/\//.test(normalized)) {
    throw new Error(`NEXT_PUBLIC_SITE_URL должен начинаться с http:// или https://, получено: ${raw}`);
  }
  const host = new URL(normalized).hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';

  if (process.env.NODE_ENV === 'production') {
    if (isLocal) {
      // Локальная production-сборка для QA и Lighthouse — это нормально,
      // но выкладывать её наружу нельзя: canonical будет указывать на localhost.
      console.warn(
        '[utoli] NEXT_PUBLIC_SITE_URL указывает на localhost. Для публикации задайте боевой HTTPS-домен.',
      );
    } else if (!normalized.startsWith('https://')) {
      throw new Error('В production NEXT_PUBLIC_SITE_URL должен использовать HTTPS.');
    }
  }

  return normalized;
}

export const baseUrl = resolveBaseUrl();

/** Абсолютный URL для канонического пути вида «/voda/utoli-19l/». */
export function absoluteUrl(path: string): string {
  if (path === '/') return `${baseUrl}/`;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  const withTrailing = withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
  return `${baseUrl}${withTrailing}`;
}

/** Абсолютный URL статического ассета (og-изображения, иконки). */
export function absoluteAsset(path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
