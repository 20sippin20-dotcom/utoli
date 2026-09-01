import { routes } from '@/config/routes';
import { site } from '@/config/site';

/**
 * Готовность контента к индексации.
 *
 * Страница, состоящая из одних «уточняется», вредит качеству сайта в глазах
 * поиска. Пока данных нет, такие страницы существуют для пользователя, но
 * закрыты от индексации и не попадают в sitemap. Как только данные появятся
 * в конфиге, всё включается автоматически — без правок разметки.
 */

/** Условия доставки и оплаты опубликованы полностью. */
export function deliveryTermsReady(): boolean {
  return site.paymentMethods.length > 0 && site.bottleDepositText !== null;
}

/** Пути, закрытые от индексации в текущем состоянии данных. */
export function noindexPaths(): string[] {
  const paths: string[] = [];
  if (!deliveryTermsReady()) paths.push(routes.deliveryAndPayment.path);
  return paths;
}
