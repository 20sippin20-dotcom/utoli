import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { productPath, routes } from '@/config/routes';
import type { Product } from '@/config/site';
import { productImage } from '@/lib/product-images';
import { ArrowIcon } from '@/components/Icons';
import { PriceLine } from '@/components/PriceLine';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './ProductCard.module.css';

/**
 * Карточка товара. Структура одинаковая для всех трёх линеек — различается
 * только цветовой акцент, чтобы Premium не выглядела отдельным брендом.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = productImage(product.image);

  return (
    <article
      className={styles.card}
      style={
        {
          ['--accent']: product.accentColor,
          ['--accent-2']: product.accentColorSecondary,
        } as CSSProperties
      }
    >
      {/* Ссылка одна — на заголовке; она растянута на карточку через ::after. */}
      <div className={styles.media}>
        <Image
          src={image}
          alt=""
          sizes="(max-width: 620px) 74vw, (max-width: 900px) 44vw, 30vw"
          className={styles.image}
          quality={72}
          priority={priority}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={productPath(product.slug)} className={styles.titleLink}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.description}>{product.shortDescription}</p>

        <PriceLine product={product} className={styles.price} />

        <div className={styles.actions}>
          <TrackedLink
            href={routes.app.path}
            event="select_product"
            eventParams={{ product: product.slug, place: 'card' }}
            className="btn btn--sm"
          >
            Заказать в приложении
          </TrackedLink>
          <Link href={productPath(product.slug)} className={`btn btn--ghost btn--sm ${styles.more}`}>
            Подробнее
            <ArrowIcon size={18} className="btn__icon" />
          </Link>
        </div>
      </div>
    </article>
  );
}
