import Link from 'next/link';

import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from '@/components/JsonLd';

import styles from './Breadcrumbs.module.css';

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Видимые хлебные крошки + BreadcrumbList, построенный из тех же данных.
 * На главной не выводятся.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: 'Главная', path: '/' }, ...items];
  const last = trail[trail.length - 1];

  return (
    <>
      <nav aria-label="Хлебные крошки" className={styles.wrapper}>
        <ol className={styles.list}>
          {trail.map((crumb) => {
            const isLast = crumb === last;
            return (
              <li key={crumb.path} className={styles.item}>
                {isLast ? (
                  <span aria-current="page" className={styles.current}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className={styles.link}>
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
