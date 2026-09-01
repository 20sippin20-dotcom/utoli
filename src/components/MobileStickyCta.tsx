'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { AppIcon, PhoneIcon } from '@/components/Icons';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './MobileStickyCta.module.css';

/**
 * Закреплённая нижняя панель на мобильных: появляется после первого экрана,
 * содержит ровно два действия и уважает safe area.
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} data-visible={visible}>
      <Link href={routes.app.path} className={`btn ${styles.primary}`}>
        <AppIcon size={18} className="btn__icon" />В приложение
      </Link>
      <TrackedLink
        href={site.dispatcherPhoneHref}
        event="click_phone_header"
        eventParams={{ place: 'sticky_bar' }}
        className={`btn btn--secondary ${styles.call}`}
        aria-label={`Позвонить диспетчеру ${site.dispatcherPhoneDisplay}`}
      >
        <PhoneIcon size={20} className="btn__icon" />
        <span className={styles.callLabel}>Позвонить</span>
      </TrackedLink>
    </div>
  );
}
