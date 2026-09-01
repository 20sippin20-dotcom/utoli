import Link from 'next/link';

import { mainNav, productPath, routes } from '@/config/routes';
import { products, site } from '@/config/site';
import { Logo } from '@/components/Logo';
import { PhoneIcon, VkIcon } from '@/components/Icons';
import { StoreBadge } from '@/components/StoreBadge';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './SiteFooter.module.css';

/**
 * Футер. NAP-данные выводятся обычным текстом (не картинкой) и берутся
 * из site-конфига — тот же источник, что и у JSON-LD.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>
            Питьевая вода 19 л с доставкой по {site.cityPrepositional}. Заказ в приложении{' '}
            {site.appName} или у диспетчера.
          </p>
          <TrackedLink href={site.vkUrl} event="click_vk" external className={styles.social}>
            <VkIcon size={20} />
            Мы во ВКонтакте
          </TrackedLink>
        </div>

        <nav className={styles.column} aria-label="Каталог воды">
          <h2 className={styles.columnTitle}>Вода</h2>
          <ul className={styles.list}>
            {products.map((product) => (
              <li key={product.id}>
                <Link href={productPath(product.slug)} className={styles.link}>
                  {product.shortName} 19 л
                </Link>
              </li>
            ))}
            <li>
              <Link href={routes.catalog.path} className={styles.link}>
                Весь каталог
              </Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.column} aria-label="Информация">
          <h2 className={styles.columnTitle}>Информация</h2>
          <ul className={styles.list}>
            {mainNav
              .filter((route) => route.path !== routes.catalog.path)
              .map((route) => (
                <li key={route.path}>
                  <Link href={route.path} className={styles.link}>
                    {route.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href={routes.deliveryAndPayment.path} className={styles.link}>
                {routes.deliveryAndPayment.label}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Контакты</h2>
          <address className={styles.address}>
            <TrackedLink
              href={site.dispatcherPhoneHref}
              event="click_phone_header"
              eventParams={{ place: 'footer' }}
              className={styles.phone}
            >
              <PhoneIcon size={18} />
              {site.dispatcherPhoneDisplay}
            </TrackedLink>
            <span className={styles.addressLine}>
              {site.city}, {site.region}
            </span>
            {site.address ? <span className={styles.addressLine}>{site.address}</span> : null}
            {site.workingHours ? (
              <span className={styles.addressLine}>
                Приём заказов: {site.workingHours.opens}–{site.workingHours.closes}
              </span>
            ) : null}
          </address>

          <div className={styles.stores}>
            <StoreBadge store="google" tone="dark" />
            <StoreBadge store="apple" tone="dark" />
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copy}>
          © {year} {site.legalName ?? `«${site.brandNameRu}»`}
          {site.ogrnip ? `, ОГРНИП ${site.ogrnip}` : null}
          {site.inn ? `, ИНН ${site.inn}` : null}. {site.city}.
        </p>
        <Link href={routes.privacy.path} className={styles.bottomLink}>
          Политика конфиденциальности
        </Link>
        {site.legalDisclaimer ? <p className={styles.disclaimer}>{site.legalDisclaimer}</p> : null}
      </div>
    </footer>
  );
}
