import type { MetadataRoute } from 'next';

// Статический экспорт: файл генерируется один раз на сборке.
export const dynamic = 'force-static';

import { noindexPaths } from '@/lib/status';
import { absoluteUrl } from '@/lib/url';

/**
 * robots.txt для production — минимальный.
 *
 * CSS, JavaScript и изображения не закрываются: без них поисковик не может
 * отрендерить страницу. Sitemap указывается абсолютным URL.
 *
 * На staging и preview (NEXT_PUBLIC_NOINDEX=true) индексация запрещена целиком,
 * плюс отдаётся заголовок X-Robots-Tag — см. next.config.mjs.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === 'true') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Страницы, временно закрытые до заполнения данных.
        disallow: noindexPaths(),
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml').replace(/\/$/, ''),
    host: absoluteUrl('/').replace(/\/$/, ''),
  };
}
