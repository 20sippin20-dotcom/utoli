import { site } from '@/config/site';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './StoreBadge.module.css';

type Store = 'google' | 'apple';

const CONFIG = {
  google: {
    href: site.googlePlayUrl,
    // Доступное имя ссылки собирается из видимого текста: «Скачать Utoli
    // для Android · Google Play». Отдельный aria-label не нужен и создавал бы
    // расхождение между видимой подписью и именем для скринридера.
    caption: `Скачать ${site.appName} для Android`,
    name: 'Google Play',
    event: 'click_googleplay',
  },
  apple: {
    href: site.appStoreUrl,
    caption: `Скачать ${site.appName} для iPhone`,
    name: 'App Store',
    event: 'click_appstore',
  },
} as const;

/**
 * Нейтральная кнопка магазина.
 *
 * Логотипы Google Play и App Store — чужие товарные знаки: вручную мы их не
 * перерисовываем. Когда заказчик пришлёт официальные бейджи, они подставляются
 * здесь, разметка страниц не меняется.
 */
export function StoreBadge({ store, tone = 'light' }: { store: Store; tone?: 'light' | 'dark' }) {
  const config = CONFIG[store];

  return (
    <TrackedLink
      href={config.href}
      event={config.event}
      external
      className={`${styles.badge} ${tone === 'dark' ? styles.dark : styles.light}`}
    >
      <DownloadGlyph />
      <span className={styles.text}>
        <span className={styles.caption}>{config.caption}</span>
        <span className={styles.name}>{config.name}</span>
      </span>
    </TrackedLink>
  );
}

function DownloadGlyph() {
  return (
    <svg
      className={styles.glyph}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17.5v1.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-1.5" />
    </svg>
  );
}
