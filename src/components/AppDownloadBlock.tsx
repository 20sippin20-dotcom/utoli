import Image from 'next/image';

import { site } from '@/config/site';
import { StoreBadge } from '@/components/StoreBadge';

import styles from './AppDownloadBlock.module.css';

/**
 * Блок приложения. Перечисляются только те возможности, которые описаны в
 * официальном описании приложения. Ничего сверх этого не обещаем.
 */
const APP_FEATURES = [
  'Каталог воды «Утоли» с тремя линейками по 19 л',
  'Корзина и оформление заказа',
  'История заказов и повтор прошлого заказа',
  'Актуальные цены и акции — в самом приложении',
];

export function AppDownloadBlock({ withQr = true }: { withQr?: boolean }) {
  return (
    <section className="section section--navy" aria-labelledby="app-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <p className="eyebrow">Приложение {site.appName}</p>
          <h2 id="app-title">Заказывайте «{site.brandNameRu}» в приложении</h2>
          <p className="section__lead">
            Приложение {site.appName} — основной способ заказать воду в {site.cityPrepositional}:
            каталог, корзина и история заказов в телефоне.
          </p>

          <ul className={styles.features}>
            {APP_FEATURES.map((feature) => (
              <li key={feature} className={styles.feature}>
                <span aria-hidden className={styles.bullet} />
                {feature}
              </li>
            ))}
          </ul>

          <div className={styles.badges}>
            <StoreBadge store="google" tone="dark" />
            <StoreBadge store="apple" tone="dark" />
          </div>
        </div>

        {withQr ? (
          <div className={styles.qrGroup}>
            <QrCard
              title="Google Play"
              caption="Наведите камеру Android"
              src="/qr/google-play.svg"
              alt="QR-код на страницу приложения Utoli в Google Play"
            />
            <QrCard
              title="App Store"
              caption="Наведите камеру iPhone"
              src="/qr/app-store.svg"
              alt="QR-код на страницу приложения Utoli в App Store"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** QR-код сгенерирован из того же URL, что и кнопка магазина. */
function QrCard({
  title,
  caption,
  src,
  alt,
}: {
  title: string;
  caption: string;
  src: string;
  alt: string;
}) {
  return (
    <figure className={styles.qrCard}>
      <Image src={src} alt={alt} width={132} height={132} className={styles.qrImage} />
      <figcaption className={styles.qrCaption}>
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
