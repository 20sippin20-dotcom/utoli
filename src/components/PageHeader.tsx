import type { ReactNode } from 'react';

import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs';

import styles from './PageHeader.module.css';

/** Шапка внутренней страницы: хлебные крошки, единственный H1 и вводный абзац. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className={styles.head}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
