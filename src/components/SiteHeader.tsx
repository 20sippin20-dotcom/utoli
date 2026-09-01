import Link from 'next/link';

import { mainNav, routes } from '@/config/routes';
import { site } from '@/config/site';
import { Logo } from '@/components/Logo';
import { MobileMenu } from '@/components/MobileMenu';
import { TrackedLink } from '@/components/TrackedLink';
import { AppIcon, DropIcon, PhoneIcon } from '@/components/Icons';

import styles from './SiteHeader.module.css';

/**
 * Верхняя сервисная полоса + шапка.
 * Телефон и ссылки берутся только из site-конфига.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.utility}>
        <div className={`container ${styles.utilityInner}`}>
          <p className={styles.utilityText}>
            <DropIcon size={16} className={styles.utilityIcon} />
            Доставка питьевой воды в {site.cityPrepositional}
          </p>
          <div className={styles.utilityRight}>
            {site.workingHours ? (
              <span className={styles.utilityHours}>
                Приём заказов {site.workingHours.opens}–{site.workingHours.closes}
              </span>
            ) : null}
            <TrackedLink
              href={site.dispatcherPhoneHref}
              event="click_phone_header"
              eventParams={{ place: 'utility_bar' }}
              className={styles.utilityPhone}
            >
              <PhoneIcon size={16} />
              {site.dispatcherPhoneDisplay}
            </TrackedLink>
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <Logo />

          <nav className={styles.nav} aria-label="Основная навигация">
            <ul className={styles.navList}>
              {mainNav.map((route) => (
                <li key={route.path}>
                  <Link href={route.path} className={styles.navLink}>
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <TrackedLink
              href={site.dispatcherPhoneHref}
              event="click_phone_header"
              eventParams={{ place: 'header' }}
              className={styles.phone}
            >
              <PhoneIcon size={18} />
              <span>{site.dispatcherPhoneDisplay}</span>
            </TrackedLink>

            <Link href={routes.app.path} className={`btn ${styles.cta}`}>
              <AppIcon size={18} className="btn__icon" />
              Заказать в приложении
            </Link>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
