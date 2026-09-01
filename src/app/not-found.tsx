import Link from 'next/link';

import { routes } from '@/config/routes';
import { site } from '@/config/site';

import styles from './not-found.module.css';

/** Настоящий HTTP 404 (Next отдаёт код 404 для этого файла), человеческий текст. */
export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Ошибка 404</p>
        <h1>Такой страницы нет</h1>
        <p className={styles.lead}>
          Возможно, ссылка устарела или в адресе опечатка. Вода «{site.brandNameRu}» на месте — вот
          куда стоит зайти.
        </p>

        <ul className={styles.links}>
          <li>
            <Link href={routes.catalog.path}>Каталог воды 19 л</Link>
          </li>
          <li>
            <Link href={routes.delivery.path}>Доставка в {site.cityPrepositional}</Link>
          </li>
          <li>
            <Link href={routes.app.path}>Приложение {site.appName}</Link>
          </li>
          <li>
            <Link href={routes.contacts.path}>Контакты</Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <Link href="/" className="btn">
            На главную
          </Link>
          <a href={site.dispatcherPhoneHref} className="btn btn--secondary">
            {site.dispatcherPhoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
