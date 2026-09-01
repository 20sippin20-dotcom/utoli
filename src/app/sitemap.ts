import { statSync } from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';

// Статический экспорт: файл генерируется один раз на сборке.
export const dynamic = 'force-static';

import { indexableRoutes, productPath } from '@/config/routes';
import { products } from '@/config/site';
import { noindexPaths } from '@/lib/status';
import { absoluteUrl } from '@/lib/url';

/**
 * В sitemap попадают только канонические URL, отдающие 200 и разрешённые к
 * индексации. Страницы, временно закрытые из-за незаполненных данных,
 * исключаются автоматически.
 *
 * lastmod берётся из времени изменения исходников страницы и общего конфига,
 * а не из даты сборки — иначе дата обновлялась бы при каждом деплое.
 */

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const SHARED_SOURCES = [
  path.join(process.cwd(), 'src', 'config', 'site.ts'),
  path.join(APP_DIR, 'layout.tsx'),
];

function mtime(file: string): number {
  try {
    return statSync(file).mtimeMs;
  } catch {
    return 0;
  }
}

/** Файл страницы для маршрута: «/voda/» -> src/app/voda/page.tsx. */
function sourceFor(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  return path.join(APP_DIR, ...segments, 'page.tsx');
}

function lastModified(routePath: string, extraSources: string[] = []): Date {
  const candidates = [sourceFor(routePath), ...SHARED_SOURCES, ...extraSources];
  const newest = Math.max(...candidates.map(mtime));
  return new Date(newest || Date.now());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const excluded = new Set(noindexPaths());
  const productTemplate = path.join(APP_DIR, 'voda', '[slug]', 'page.tsx');
  const productPaths = new Set(products.map((product) => productPath(product.slug)));

  return indexableRoutes()
    .filter((route) => !excluded.has(route.path))
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: productPaths.has(route.path)
        ? lastModified(route.path, [productTemplate])
        : lastModified(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
}
