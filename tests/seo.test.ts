import { describe, expect, it } from 'vitest';

import { indexableRoutes, productPath, routes } from '@/config/routes';
import { products, site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { noindexPaths } from '@/lib/status';
import { absoluteUrl, baseUrl } from '@/lib/url';
import sitemap from '@/app/sitemap';

describe('canonical', () => {
  it('строится от абсолютного домена и всегда со слешем на конце', () => {
    expect(absoluteUrl('/')).toBe(`${baseUrl}/`);
    expect(absoluteUrl('/voda')).toBe(`${baseUrl}/voda/`);
    expect(absoluteUrl('/voda/')).toBe(`${baseUrl}/voda/`);
  });

  it('в метаданных страницы canonical абсолютный', () => {
    const meta = pageMetadata({ title: 'T', description: 'D', path: routes.catalog.path });
    expect(meta.alternates?.canonical).toBe(`${baseUrl}/voda/`);
  });

  it('og:url совпадает с canonical', () => {
    const meta = pageMetadata({ title: 'T', description: 'D', path: routes.contacts.path });
    expect(meta.openGraph?.url).toBe(meta.alternates?.canonical);
  });

  it('локаль и тип карточки заданы', () => {
    const meta = pageMetadata({ title: 'T', description: 'D', path: '/' });
    expect(meta.openGraph?.locale).toBe('ru_RU');
    expect(meta.twitter && 'card' in meta.twitter ? meta.twitter.card : null).toBe('summary_large_image');
  });
});

describe('sitemap.xml', () => {
  const entries = sitemap();

  it('все URL абсолютные и канонические', () => {
    for (const entry of entries) {
      expect(entry.url.startsWith(baseUrl)).toBe(true);
      expect(entry.url.endsWith('/')).toBe(true);
      expect(entry.url).not.toContain('?');
    }
  });

  it('нет дублей', () => {
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('страницы, закрытые от индексации, исключены', () => {
    for (const path of noindexPaths()) {
      expect(entries.some((entry) => entry.url === absoluteUrl(path))).toBe(false);
    }
  });

  it('все товарные страницы присутствуют', () => {
    for (const product of products) {
      expect(entries.some((entry) => entry.url === absoluteUrl(productPath(product.slug)))).toBe(true);
    }
  });

  it('lastmod — реальная дата, а не будущее', () => {
    for (const entry of entries) {
      const date = new Date(entry.lastModified as Date);
      expect(Number.isNaN(date.getTime())).toBe(false);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now() + 1000);
    }
  });

  it('в карте нет страниц, которых нет в маршрутах', () => {
    const known = new Set(indexableRoutes().map((route) => absoluteUrl(route.path)));
    for (const entry of entries) {
      expect(known.has(entry.url)).toBe(true);
    }
  });
});

describe('title и description', () => {
  /** Заголовки всех страниц: собраны так же, как в самих page.tsx. */
  const pages: { title: string; description: string }[] = [
    {
      title: `Доставка воды в ${site.cityPrepositional} — «${site.brandNameRu}» | Вода 19 л`,
      description: `Закажите питьевую воду «${site.brandNameRu}» 19 л с доставкой по ${site.cityPrepositional}. Классическая, Магний и Premium. Заказ в приложении ${site.appName} или у диспетчера.`,
    },
    {
      title: `Вода «${site.brandNameRu}» 19 л — каталог и доставка в ${site.cityPrepositional}`,
      description: `Три линейки воды «${site.brandNameRu}» в бутылях 19 л: классическая, Магний и Premium. Сравните и закажите с доставкой по ${site.cityPrepositional}.`,
    },
    {
      title: `Доставка питьевой воды в ${site.cityPrepositional} домой и в офис`,
      description: `Как заказать доставку воды 19 л по ${site.cityPrepositional}: способы заказа, зона доставки, форматы для дома и офиса. Заказ в приложении ${site.appName} или у диспетчера.`,
    },
    {
      title: `Скачать ${site.appName} — приложение для заказа воды в ${site.cityPrepositional}`,
      description: `Официальное приложение ${site.appName}: каталог воды «${site.brandNameRu}» 19 л, корзина, история и повтор заказа. Ссылки на Google Play и App Store.`,
    },
    ...products.map((product) => ({ title: product.seo.title, description: product.seo.description })),
  ];

  it('уникальны', () => {
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length);
    expect(new Set(pages.map((page) => page.description)).size).toBe(pages.length);
  });

  it('разумной длины', () => {
    for (const page of pages) {
      expect(page.title.length).toBeGreaterThan(20);
      expect(page.title.length).toBeLessThanOrEqual(75);
      expect(page.description.length).toBeGreaterThan(70);
      expect(page.description.length).toBeLessThanOrEqual(190);
    }
  });

  it('бренд в title не повторяется дважды', () => {
    for (const page of pages) {
      const occurrences = page.title.split(site.brandNameRu).length - 1;
      expect(occurrences).toBeLessThanOrEqual(1);
    }
  });
});
