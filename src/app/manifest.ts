import type { MetadataRoute } from 'next';

import { site } from '@/config/site';

// Статический экспорт: манифест генерируется один раз на сборке.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `«${site.brandNameRu}» — доставка воды в ${site.cityPrepositional}`,
    short_name: site.brandNameRu,
    description: `Питьевая вода ${site.brandNameLatin} 19 л с доставкой по ${site.cityPrepositional}.`,
    lang: 'ru',
    start_url: '/',
    display: 'standalone',
    background_color: '#EAF7FC',
    theme_color: '#0B2D4B',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
