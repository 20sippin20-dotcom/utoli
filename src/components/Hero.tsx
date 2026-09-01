import Image from 'next/image';
import Link from 'next/link';

import { productPath, routes } from '@/config/routes';
import { products, site } from '@/config/site';
import { lineupImage } from '@/lib/product-images';
import { AppIcon, ArrowIcon, PhoneIcon } from '@/components/Icons';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './Hero.module.css';

/**
 * Первый экран. Ничего не обещаем про сроки, стоимость и график: в тексте
 * только подтверждённые факты — город, объём, три линейки и два способа заказа.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <p className="eyebrow">
            {site.city} · {site.region}
          </p>

          <h1 className={styles.title}>
            Доставка воды «{site.brandNameRu}» в {site.cityPrepositional}
          </h1>

          <p className={styles.lead}>
            Питьевая вода 19 л для дома и офиса. Выберите свою «{site.brandNameRu}» и оформите заказ
            в приложении или у диспетчера.
          </p>

          <div className={styles.actions}>
            <TrackedLink
              href={routes.app.path}
              event="click_delivery_cta"
              eventParams={{ place: 'hero' }}
              className="btn"
            >
              <AppIcon size={20} className="btn__icon" />
              Заказать в приложении
            </TrackedLink>

            <TrackedLink
              href={site.dispatcherPhoneHref}
              event="click_phone_header"
              eventParams={{ place: 'hero' }}
              className="btn btn--secondary"
            >
              <PhoneIcon size={20} className="btn__icon" />
              <span>Позвонить<span className={styles.callLabel}>&nbsp;диспетчеру</span></span>
            </TrackedLink>
          </div>

          <p className={styles.phoneHint}>
            Диспетчер: <span className={styles.phoneValue}>{site.dispatcherPhoneDisplay}</span>
          </p>

          <div className={styles.chips}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={productPath(product.slug)}
                className={styles.chip}
                style={{ ['--accent' as string]: product.accentColor }}
              >
                <span aria-hidden className={styles.chipDot} />
                {product.shortName}
              </Link>
            ))}
            <Link href={routes.catalog.path} className={styles.chipAll}>
              Выбрать воду
              <ArrowIcon size={16} className="btn__icon" />
            </Link>
          </div>
        </div>

        <div className={styles.media}>
          <Image
            src={lineupImage}
            alt="Линейка воды Утоли 19 л: Premium, Магний и классическая"
            className={styles.image}
            sizes="(max-width: 900px) 72vw, 520px"
            quality={72}
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
