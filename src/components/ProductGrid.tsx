import { products } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';

import styles from './ProductGrid.module.css';

/** Каталог из трёх карточек. Приоритет загрузки — только первой картинке. */
export function ProductGrid({ priorityFirst = false }: { priorityFirst?: boolean }) {
  return (
    <div className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={priorityFirst && index === 0} />
      ))}
    </div>
  );
}

export function CatalogSection({ title = 'Выберите свою воду' }: { title?: string }) {
  return (
    <section className="section section--ice" aria-labelledby="catalog-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Каталог</p>
          <h2 id="catalog-title">{title}</h2>
          <p className="section__lead">
            Три линейки в одинаковой бутыли 19 л: классическая «Утоли», вода с магнием и Premium.
          </p>
        </div>
        <ProductGrid />
      </div>
    </section>
  );
}
