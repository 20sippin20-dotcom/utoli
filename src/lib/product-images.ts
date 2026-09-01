import type { StaticImageData } from 'next/image';

import utoli19l from '@/assets/images/utoli-19l.webp';
import utoliLiniya from '@/assets/images/utoli-liniya-19l.webp';
import utoliMagniy from '@/assets/images/utoli-magniy-19l.webp';
import utoliPremium from '@/assets/images/utoli-premium-19l.webp';
import utoliTrio from '@/assets/images/utoli-trio-19l.webp';

/**
 * Статические импорты фотографий: Next получает реальные width/height (нет CLS).
 *
 * На страницах показываем WebP — сайт собирается как статика, оптимизатора
 * изображений на хостинге нет, поэтому лёгкий формат готовится заранее
 * скриптом `npm run images`. JPEG-копии лежат в /public/images и нужны для
 * абсолютных ссылок в JSON-LD и Open Graph.
 *
 * Ключ — имя JPEG-файла из site.ts, чтобы конфиг не знал про формат показа.
 */
const byFile: Record<string, StaticImageData> = {
  'utoli-19l.jpg': utoli19l,
  'utoli-magniy-19l.jpg': utoliMagniy,
  'utoli-premium-19l.jpg': utoliPremium,
  'utoli-trio-19l.jpg': utoliTrio,
  'utoli-liniya-19l.jpg': utoliLiniya,
};

export function productImage(file: string): StaticImageData {
  const image = byFile[file];
  if (!image) throw new Error(`Нет импорта для изображения «${file}» в src/lib/product-images.ts`);
  return image;
}

/** Композиция из трёх линеек — первый экран главной. */
export const lineupImage = utoliLiniya;

/** Три классические бутыли — иллюстрация для доставки домой и в офис. */
export const trioImage = utoliTrio;
