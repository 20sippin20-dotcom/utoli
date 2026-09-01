import type { Product } from '@/config/site';
import { site } from '@/config/site';

import styles from './PriceLine.module.css';

/**
 * Цена выводится только тогда, когда она реально заполнена в конфиге.
 *
 * Пока price = null, не показываем «0 ₽», выдуманную сумму, старую цену,
 * скидку или зачёркнутый ценник — только нейтральную строку о том, где
 * узнать актуальную цену.
 */
export function PriceLine({
  product,
  className,
  variant = 'card',
}: {
  product: Product;
  className?: string;
  variant?: 'card' | 'hero';
}) {
  const classNames = [styles.wrapper, variant === 'hero' ? styles.hero : '', className]
    .filter(Boolean)
    .join(' ');

  if (product.price === null) {
    return (
      <p className={classNames}>
        <span className={styles.note}>
          Актуальную цену и условия уточняйте в приложении {site.appName} или у диспетчера
        </span>
      </p>
    );
  }

  return (
    <p className={classNames}>
      <span className={styles.value}>
        {new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: product.currency,
          maximumFractionDigits: 0,
        }).format(product.price)}
      </span>
      <span className={styles.unit}>за бутыль {product.volumeLiters} л</span>
    </p>
  );
}
