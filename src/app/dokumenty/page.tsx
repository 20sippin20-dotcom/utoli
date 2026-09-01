import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import {
  composition,
  officialDocuments,
  regulations,
  storage,
  technicalSpec,
  waterCategory,
} from '@/content/documents';
import { pageMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/PageHeader';

import styles from './documents.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Документы и качество воды «Утоли»',
  description:
    'Сертификат соответствия, декларация ЕАЭС и протокол испытаний воды «Утоли» 19 л. Состав воды и условия хранения.',
  path: routes.documents.path,
});

/**
 * Кнопка «Открыть PDF» показывается только если файл действительно лежит
 * в public/documents на момент сборки. Появится новый скан — кнопка
 * добавится сама; пропадёт файл — вместо битой ссылки будет предложение
 * запросить копию у диспетчера.
 */
function hasFile(file: string | null): boolean {
  return file !== null && existsSync(path.join(process.cwd(), 'public', 'documents', file));
}

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.documents.label, path: routes.documents.path }]}
        eyebrow="Качество"
        title="Документы и качество воды"
        lead={`${waterCategory}. Продукция выпускается по ${technicalSpec} и прошла лабораторные испытания.`}
      />

      <section className="section" aria-labelledby="documents-title">
        <div className="container">
          <div className="section__head">
            <h2 id="documents-title">Разрешительные документы</h2>
          </div>

          <ul className={styles.list}>
            {officialDocuments.map((document) => (
              <li key={document.number} className={styles.item}>
                <h3 className={styles.itemTitle}>{document.title}</h3>
                <p className={styles.number}>{document.number}</p>
                <p className={styles.meta}>{document.issuer}</p>
                <p className={styles.meta}>Действует {document.validity}</p>
                {hasFile(document.file) ? (
                  <a
                    className={`btn btn--secondary btn--sm ${styles.download}`}
                    href={`/documents/${document.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Открыть PDF
                  </a>
                ) : (
                  <p className={styles.meta}>
                    Копию можно запросить у диспетчера по телефону{' '}
                    <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--ice" aria-labelledby="composition-title">
        <div className="container">
          <div className="section__head">
            <h2 id="composition-title">Состав воды</h2>
            <p className="section__lead">
              По протоколу испытаний № ДИЛ78-07473 от 19.12.2025. Испытывался образец с маркировкой{' '}
              {site.brandNameLatin}.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Показатель</th>
                  <th scope="col">Значение</th>
                  <th scope="col">Норматив</th>
                </tr>
              </thead>
              <tbody>
                {composition.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                    <td className={styles.limit}>{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.note}>
            Микробиологические, паразитологические и радиологические показатели, а также содержание
            токсичных металлов проверены полностью и соответствуют нормативам — полный перечень в
            протоколе испытаний.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="regulations-title">
        <div className="container">
          <div className="prose">
            <h2 id="regulations-title">Чему соответствует продукция</h2>
            <ul>
              {regulations.map((regulation) => (
                <li key={regulation}>{regulation}</li>
              ))}
            </ul>
            <p>Продукция изготовлена в соответствии с {technicalSpec}.</p>

            <h2>Хранение и срок годности</h2>
            <p>
              Хранить при температуре {storage.temperature}, {storage.humidity}, в затемнённых, хорошо
              проветриваемых помещениях. Срок годности — {storage.shelfLife}.
            </p>

            <h2>Изготовитель</h2>
            <p>
              {site.legalName}. ОГРНИП {site.ogrnip}, ИНН {site.inn}. Адрес производства:{' '}
              {site.postalCode}, {site.region}, г. {site.city}, {site.address}.
            </p>
            <p>
              Каталог воды — на странице <Link href={routes.catalog.path}>«Вода»</Link>. Условия
              доставки — на странице{' '}
              <Link href={routes.delivery.path}>доставки по {site.cityPrepositional}</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
