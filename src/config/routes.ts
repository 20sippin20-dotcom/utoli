import { products } from '@/config/site';

/**
 * Карта маршрутов. Отсюда берут данные навигация, хлебные крошки, sitemap
 * и внутренняя перелинковка — чтобы ни одна страница не осталась orphan page.
 */

export interface RouteMeta {
  /** Всегда с завершающим слешем — совпадает с trailingSlash: true. */
  path: string;
  /** Подпись в навигации и хлебных крошках. */
  label: string;
  /** Приоритет и частота для sitemap.xml. */
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const routes = {
  home: { path: '/', label: 'Главная', priority: 1, changeFrequency: 'weekly' },
  catalog: { path: '/voda/', label: 'Вода', priority: 0.9, changeFrequency: 'weekly' },
  delivery: {
    path: '/dostavka-vody-ukhta/',
    label: 'Доставка',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  app: { path: '/prilozhenie/', label: 'Приложение', priority: 0.8, changeFrequency: 'monthly' },
  deliveryAndPayment: {
    path: '/dostavka-i-oplata/',
    label: 'Доставка и оплата',
    priority: 0.6,
    changeFrequency: 'monthly',
  },
  about: { path: '/o-kompanii/', label: 'О компании', priority: 0.5, changeFrequency: 'yearly' },
  documents: { path: '/dokumenty/', label: 'Документы', priority: 0.5, changeFrequency: 'yearly' },
  contacts: { path: '/kontakty/', label: 'Контакты', priority: 0.8, changeFrequency: 'monthly' },
  privacy: {
    path: '/politika-konfidencialnosti/',
    label: 'Политика конфиденциальности',
    priority: 0.2,
    changeFrequency: 'yearly',
  },
} as const satisfies Record<string, RouteMeta>;

export function productPath(slug: string): string {
  return `${routes.catalog.path}${slug}/`;
}

/** Все индексируемые URL — основа sitemap.xml. */
export function indexableRoutes(): RouteMeta[] {
  const productRoutes: RouteMeta[] = products.map((product) => ({
    path: productPath(product.slug),
    label: product.shortName,
    priority: 0.8,
    changeFrequency: 'monthly',
  }));
  return [...Object.values(routes), ...productRoutes];
}

/** Главное меню. Порядок одинаковый на desktop и в мобильном меню. */
export const mainNav: RouteMeta[] = [
  routes.catalog,
  routes.delivery,
  routes.app,
  routes.about,
  routes.documents,
  routes.contacts,
];
