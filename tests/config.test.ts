import { describe, expect, it } from 'vitest';

import { products, site } from '@/config/site';
import { indexableRoutes, mainNav, productPath, routes } from '@/config/routes';

describe('контакты и ссылки', () => {
  it('телефон для клика нормализован', () => {
    expect(site.dispatcherPhoneHref).toBe('tel:+78216777575');
  });

  it('визуальный и кликабельный телефон — это один и тот же номер', () => {
    const digitsFromDisplay = site.dispatcherPhoneDisplay.replace(/\D/g, '');
    const digitsFromHref = site.dispatcherPhoneHref.replace(/\D/g, '');
    expect(digitsFromHref).toBe(digitsFromDisplay);
  });

  it('VK ведёт напрямую на официальную группу, без away.php и трекинга', () => {
    expect(site.vkUrl).toBe('https://vk.ru/utoli11');
    expect(site.vkUrl).not.toContain('away.php');
    expect(site.vkUrl).not.toContain('?');
  });

  it('приложение скачивается только в официальных магазинах', () => {
    expect(site.googlePlayUrl.startsWith('https://play.google.com/')).toBe(true);
    expect(site.appStoreUrl.startsWith('https://apps.apple.com/')).toBe(true);
  });
});

describe('товары', () => {
  it('в каталоге ровно три позиции по 19 л', () => {
    expect(products).toHaveLength(3);
    for (const product of products) {
      expect(product.volumeLiters).toBe(19);
    }
  });

  it('цена либо не указана, либо положительная — «0 ₽» невозможно', () => {
    for (const product of products) {
      expect(product.price === null || product.price > 0).toBe(true);
    }
  });

  it('slug, id и изображения уникальны', () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.image)).size).toBe(products.length);
  });

  it('alt описывает изображение и не набит ключевыми словами', () => {
    for (const product of products) {
      expect(product.imageAlt.length).toBeGreaterThan(10);
      expect(product.imageAlt.toLowerCase()).not.toMatch(/купить|заказать|цена|доставка/);
    }
  });

  it('title и description у товаров уникальны', () => {
    expect(new Set(products.map((p) => p.seo.title)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.seo.description)).size).toBe(products.length);
  });
});

describe('маршруты', () => {
  it('все пути канонические: со слешем в начале и в конце', () => {
    for (const route of indexableRoutes()) {
      expect(route.path.startsWith('/')).toBe(true);
      expect(route.path.endsWith('/')).toBe(true);
    }
  });

  it('URL товаров построены из slug', () => {
    for (const product of products) {
      expect(productPath(product.slug)).toBe(`/voda/${product.slug}/`);
    }
  });

  it('нет дублей URL', () => {
    const paths = indexableRoutes().map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('главное меню состоит из существующих маршрутов', () => {
    const known = new Set<string>(Object.values(routes).map((route) => route.path));
    for (const item of mainNav) {
      expect(known.has(item.path)).toBe(true);
    }
  });
});

describe('фактическая безопасность данных', () => {
  const forbidden = [
    /гост/i,
    /санпин/i,
    /артезианск/i,
    /высшей категории/i,
    /круглосуточн/i,
    /бесплатн/i,
    /скидк/i,
    /акци[яи]/i,
    /скважин/i,
    /лучш(ая|ий|ие)/i,
    /100\s?%/,
  ];

  const strings = products.flatMap((product) => [
    product.name,
    product.shortDescription,
    product.seo.title,
    product.seo.description,
    product.seo.h1,
    ...product.verifiedFacts.map((fact) => `${fact.label} ${fact.value}`),
  ]);

  it('в данных товаров нет непроверяемых утверждений', () => {
    for (const value of strings) {
      for (const pattern of forbidden) {
        expect(value, `«${value}» содержит ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('объём везде указан как 19 л, без 18,9 и 19,9', () => {
    for (const value of strings) {
      expect(value).not.toMatch(/18[,.]9|19[,.]9/);
    }
  });

  it('зона доставки перечисляет реальные населённые пункты', () => {
    expect(site.deliveryAreas).toEqual(['Ухта', 'Шудаяг', 'Водный', 'Ярега', 'Сосногорск']);
    expect(new Set(site.deliveryAreas).size).toBe(site.deliveryAreas.length);
    for (const area of site.deliveryAreas) {
      expect(site.deliveryAreasSummary.includes(area) || area === site.city).toBe(true);
    }
  });
});
