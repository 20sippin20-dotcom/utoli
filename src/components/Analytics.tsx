'use client';

import Script from 'next/script';
import { useCallback, useSyncExternalStore } from 'react';

import styles from './Analytics.module.css';

const STORAGE_KEY = 'utoli-analytics-consent';

const CONSENT_EVENT = 'utoli:analytics-consent';

const metrikaId = process.env.NEXT_PUBLIC_YM_ID?.trim();
const ga4Id = process.env.NEXT_PUBLIC_GA_ID?.trim();
const analyticsConfigured = Boolean(metrikaId || ga4Id);

type Consent = 'unknown' | 'granted' | 'denied';

function subscribeToConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readConsent(): Consent {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
}

/**
 * Аналитика и уведомление о cookie.
 *
 * Пока счётчики не настроены (ID пустые), не грузится ничего и баннер не
 * показывается — показывать его не за что. Как только ID появятся, счётчики
 * подключаются только после явного согласия.
 */
export function Analytics() {
  // На сервере согласие всегда «неизвестно» — так HTML остаётся одинаковым для всех.
  const consent = useSyncExternalStore<Consent>(
    subscribeToConsent,
    readConsent,
    () => 'unknown',
  );

  const decide = useCallback((value: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }, []);

  if (!analyticsConfigured) return null;

  return (
    <>
      {consent === 'granted' ? (
        <>
          {metrikaId ? (
            <Script id="ym-counter" strategy="lazyOnload">
              {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${metrikaId},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
            </Script>
          ) : null}

          {ga4Id ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
                strategy="lazyOnload"
              />
              <Script id="ga4-init" strategy="lazyOnload">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${ga4Id}');`}
              </Script>
            </>
          ) : null}
        </>
      ) : null}

      {consent === 'unknown' ? (
        <aside className={styles.banner} aria-label="Уведомление об аналитике">
          <p className={styles.text}>
            Мы используем аналитику, чтобы понимать, как посетители пользуются сайтом. Без вашего
            согласия счётчики не загружаются.
          </p>
          <div className={styles.actions}>
            <button type="button" className="btn btn--sm" onClick={() => decide('granted')}>
              Разрешить
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => decide('denied')}
            >
              Отказаться
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
