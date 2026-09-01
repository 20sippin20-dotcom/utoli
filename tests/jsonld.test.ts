import { describe, expect, it } from 'vitest';

import { products } from '@/config/site';
import { homeFaq } from '@/content/faq';
import {
  breadcrumbJsonLd,
  clean,
  faqJsonLd,
  itemListJsonLd,
  mobileAppJsonLd,
  organizationJsonLd,
  productJsonLd,
  webSiteJsonLd,
  type JsonLdObject,
  type JsonLdValue,
} from '@/lib/jsonld';

/** Рекурсивный обход всех значений разметки. */
function walk(value: JsonLdValue, visit: (key: string, value: JsonLdValue) => void, key = '$'): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visit, `${key}[${index}]`));
    return;
  }
  if (typeof value === 'object' && value !== null) {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (childValue === null || childValue === undefined) continue;
      walk(childValue, visit, `${key}.${childKey}`);
    }
    return;
  }
  visit(key, value);
}

const allMarkup: [string, JsonLdObject][] = [
  ['WebSite', webSiteJsonLd()],
  ['LocalBusiness', organizationJsonLd()],
  ['ItemList', itemListJsonLd()],
  ['MobileApplication', mobileAppJsonLd()],
  ['FAQPage', faqJsonLd(homeFaq)],
  ['BreadcrumbList', breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Вода', path: '/voda/' }])],
  ...products.map((product): [string, JsonLdObject] => [`Product ${product.slug}`, productJsonLd(product)]),
];

describe('clean()', () => {
  it('убирает null, undefined, пустые строки, объекты и массивы', () => {
    const result = clean({
      keep: 'ok',
      nothing: null,
      empty: '',
      emptyObject: {},
      emptyArray: [],
      nested: { inner: null, value: 'да' },
    });
    expect(result).toEqual({ keep: 'ok', nested: { value: 'да' } });
  });
});

describe('структурированные данные', () => {
  it.each(allMarkup)('%s: нет пустых значений и undefined', (_name, markup) => {
    walk(markup, (key, value) => {
      expect(value, `${key} пустое`).not.toBe('');
      expect(value, `${key} undefined`).not.toBe(undefined);
      expect(value, `${key} NaN`).not.toBeNaN();
    });
  });

  it.each(allMarkup)('%s: все URL абсолютные', (_name, markup) => {
    walk(markup, (key, value) => {
      if (typeof value !== 'string') return;
      if (!/^(url|item|logo|image|downloadUrl|sameAs|@id)/.test(key.split('.').pop() ?? '')) return;
      expect(value.startsWith('http'), `${key} = ${value} не абсолютный`).toBe(true);
    });
  });

  it.each(allMarkup)('%s: сериализуется в валидный JSON', (_name, markup) => {
    expect(() => JSON.parse(JSON.stringify(markup))).not.toThrow();
  });
});

describe('Product', () => {
  it('без подтверждённой цены Offer не выводится вообще', () => {
    for (const product of products) {
      const markup = productJsonLd(product);
      if (product.price === null) {
        expect(markup.offers).toBeUndefined();
      }
    }
  });

  it('в разметке нет цены 0 и текста «уточняется»', () => {
    for (const product of products) {
      const serialized = JSON.stringify(productJsonLd(product));
      expect(serialized).not.toMatch(/"price":\s*0/);
      expect(serialized.toLowerCase()).not.toContain('уточня');
    }
  });

  it('нет рейтингов и отзывов, которых у нас нет', () => {
    for (const product of products) {
      const markup = productJsonLd(product);
      expect(markup.aggregateRating).toBeUndefined();
      expect(markup.review).toBeUndefined();
    }
  });
});

describe('LocalBusiness', () => {
  it('используется существующий тип Schema.org, а не выдуманный', () => {
    expect(organizationJsonLd()['@type']).toBe('LocalBusiness');
  });

  it('адрес выводится из конфига целиком', () => {
    const address = organizationJsonLd().address as Record<string, string>;
    expect(address['@type']).toBe('PostalAddress');
    expect(address.addressLocality).toBe('Ухта');
    expect(address.addressCountry).toBe('RU');
    expect(address.streetAddress).toBeTruthy();
    expect(address.postalCode).toBeTruthy();
  });

  it('незаполненный график не выводится', () => {
    expect(organizationJsonLd().openingHoursSpecification).toBeUndefined();
  });

  it('реквизиты изготовителя заполнены', () => {
    const markup = organizationJsonLd();
    expect(markup.legalName).toBe('ИП Колбаско Леонид Владимирович');
    expect(markup.email).toBe('utoli-ukhta@mail.ru');
  });

  it('sameAs содержит только подтверждённый VK', () => {
    expect(organizationJsonLd().sameAs).toEqual(['https://vk.ru/utoli11']);
  });
});

describe('FAQPage', () => {
  it('размечены ровно те вопросы, что видны на странице', () => {
    const markup = faqJsonLd(homeFaq);
    expect(Array.isArray(markup.mainEntity)).toBe(true);
    expect((markup.mainEntity as unknown[]).length).toBe(homeFaq.length);
  });
});
