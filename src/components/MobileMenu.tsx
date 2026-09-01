'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { mainNav, routes } from '@/config/routes';
import { site } from '@/config/site';
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/Icons';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './MobileMenu.module.css';

/**
 * Мобильное меню: кнопка с aria-expanded, закрытие по Escape и по смене маршрута,
 * возврат фокуса на кнопку. Разметка навигации в HTML присутствует всегда.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="visually-hidden">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
      </button>

      <div id={panelId} ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Мобильная навигация">
          <ul className={styles.list}>
            {mainNav.map((route) => (
              <li key={route.path}>
                <Link href={route.path} className={styles.link} onClick={() => setOpen(false)}>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          <Link href={routes.app.path} className="btn btn--block" onClick={() => setOpen(false)}>
            Заказать в приложении
          </Link>
          <TrackedLink
            href={site.dispatcherPhoneHref}
            event="click_phone_header"
            eventParams={{ place: 'mobile_menu' }}
            className="btn btn--secondary btn--block"
          >
            <PhoneIcon size={18} className="btn__icon" />
            {site.dispatcherPhoneDisplay}
          </TrackedLink>
        </div>
      </div>

      {open ? <button type="button" className={styles.scrim} tabIndex={-1} aria-hidden onClick={() => setOpen(false)} /> : null}
    </div>
  );
}
