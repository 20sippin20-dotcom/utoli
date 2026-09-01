'use client';

/**
 * Конверсионные события. Счётчики опциональны: при пустых ID ничего не грузится
 * и ничего не падает.
 *
 * В параметры событий не попадают телефон, адрес и любые персональные данные —
 * только имя события и обезличенный контекст (например, slug товара).
 */

export type AnalyticsEvent =
  | 'click_appstore'
  | 'click_googleplay'
  | 'click_phone_header'
  | 'click_phone_product'
  | 'click_vk'
  | 'view_product'
  | 'select_product'
  | 'click_delivery_cta';

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    ym?: (id: number, action: string, target: string, params?: EventParams) => void;
    gtag?: (command: string, target: string, params?: EventParams) => void;
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;

  const metrikaId = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (window.ym && Number.isFinite(metrikaId) && metrikaId > 0) {
    window.ym(metrikaId, 'reachGoal', event, params);
  }

  if (window.gtag) {
    window.gtag('event', event, params);
  }
}
