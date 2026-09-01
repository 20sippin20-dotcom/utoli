/**
 * Приёмочный аудит собранного сайта. Требует запущенного сервера.
 *
 * Проверяет: HTTP-коды, единственный H1, порядок заголовков, canonical,
 * уникальность title/description, валидность JSON-LD, alt у изображений,
 * ошибки в консоли, битые ассеты, горизонтальный скролл на 320 px
 * и наличие контента при выключенном JavaScript.
 *
 * Запуск: npm run audit  (по умолчанию http://localhost:3100)
 */
import { chromium } from 'playwright';

const BASE = (process.env.AUDIT_BASE ?? 'http://localhost:3100').replace(/\/$/, '');

const ROUTES = [
  '/',
  '/voda/',
  '/voda/utoli-19l/',
  '/voda/utoli-magniy-19l/',
  '/voda/utoli-premium-19l/',
  '/dostavka-vody-ukhta/',
  '/prilozhenie/',
  '/dostavka-i-oplata/',
  '/o-kompanii/',
  '/dokumenty/',
  '/kontakty/',
  '/politika-konfidencialnosti/',
];

const problems = [];
const notes = [];
const titles = new Map();
const descriptions = new Map();

function fail(route, message) {
  problems.push(`${route}: ${message}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({ locale: 'ru-RU', viewport: { width: 1280, height: 900 } });

for (const route of ROUTES) {
  const page = await context.newPage();
  const consoleErrors = [];
  const badRequests = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) badRequests.push(`${response.status()} ${response.url()}`);
  });

  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });

  if (response?.status() !== 200) fail(route, `HTTP ${response?.status()}`);
  if (response?.request().redirectedFrom()) fail(route, 'внутренний редирект вместо прямого 200');

  const data = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((node) => ({
      level: Number(node.tagName[1]),
      text: (node.textContent ?? '').trim().slice(0, 60),
    }));
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (node) => node.textContent ?? '',
    );
    const images = [...document.querySelectorAll('img')].map((node) => ({
      src: node.getAttribute('src') ?? '',
      alt: node.getAttribute('alt'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
    }));
    return {
      lang: document.documentElement.lang,
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
      headings,
      jsonLd,
      images,
      telLinks: [...document.querySelectorAll('a[href^="tel:"]')].map((node) => node.getAttribute('href')),
      externalLinks: [...document.querySelectorAll('a[target="_blank"]')].map((node) => ({
        href: node.getAttribute('href'),
        rel: node.getAttribute('rel') ?? '',
      })),
      skipLink: Boolean(document.querySelector('a.skip-link')),
    };
  });

  // Язык и базовые метаданные
  if (data.lang !== 'ru') fail(route, `lang = «${data.lang}», ожидается ru`);
  if (!data.title) fail(route, 'нет title');
  if (!data.description) fail(route, 'нет meta description');
  if (!data.ogTitle) fail(route, 'нет og:title');
  if (!data.ogImage) fail(route, 'нет og:image');
  if (!data.skipLink) fail(route, 'нет skip-link');

  const noindex = data.robots.includes('noindex');
  if (noindex) notes.push(`${route}: закрыт от индексации (ждёт данных)`);

  // Дубли title и description среди индексируемых страниц
  if (!noindex) {
    if (titles.has(data.title)) fail(route, `title дублирует ${titles.get(data.title)}`);
    else titles.set(data.title, route);
    if (descriptions.has(data.description)) {
      fail(route, `description дублирует ${descriptions.get(data.description)}`);
    } else descriptions.set(data.description, route);
  }

  // Canonical
  if (!data.canonical) fail(route, 'нет canonical');
  else if (new URL(data.canonical).pathname !== route) {
    fail(route, `canonical указывает на ${data.canonical}`);
  }

  // Заголовки
  const h1s = data.headings.filter((heading) => heading.level === 1);
  if (h1s.length !== 1) fail(route, `H1 на странице: ${h1s.length}`);
  let previous = 0;
  for (const heading of data.headings) {
    if (previous && heading.level > previous + 1) {
      fail(route, `разрыв в иерархии: h${previous} -> h${heading.level} («${heading.text}»)`);
    }
    previous = heading.level;
  }

  // JSON-LD
  if (data.jsonLd.length === 0) fail(route, 'нет JSON-LD');
  for (const raw of data.jsonLd) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      fail(route, 'JSON-LD не парсится');
      continue;
    }
    const serialized = JSON.stringify(parsed);
    if (serialized.includes('null') || serialized.includes('undefined')) {
      fail(route, 'в JSON-LD есть null/undefined');
    }
    if (/"(url|image|logo|item|downloadUrl)":"(?!http)/.test(serialized)) {
      fail(route, 'в JSON-LD относительный URL');
    }
  }

  // Изображения
  for (const image of data.images) {
    if (image.alt === null) fail(route, `у изображения ${image.src} нет атрибута alt`);
    if (!image.width || !image.height) {
      fail(route, `у изображения ${image.src} нет width/height — риск CLS`);
    }
  }

  // Телефон и внешние ссылки
  for (const href of data.telLinks) {
    if (href !== 'tel:+78216777575') fail(route, `посторонний телефон в ссылке: ${href}`);
  }
  for (const link of data.externalLinks) {
    if (!link.rel.includes('noopener')) fail(route, `внешняя ссылка без rel=noopener: ${link.href}`);
  }

  // Консоль и ассеты
  for (const error of consoleErrors) fail(route, `ошибка в консоли: ${error}`);
  for (const bad of badRequests) fail(route, `битый запрос: ${bad}`);

  // Горизонтальный скролл на узком экране
  await page.setViewportSize({ width: 320, height: 800 });
  await page.waitForTimeout(150);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) fail(route, `горизонтальный скролл на 320 px: +${overflow}px`);

  await page.close();
}

// Клавиатура и мобильное меню
{
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'ru-RU',
  });
  const page = await mobile.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const toggle = page.locator('button[aria-expanded]').first();
  if ((await toggle.getAttribute('aria-expanded')) !== 'false') {
    fail('меню', 'закрытое меню не сообщает aria-expanded="false"');
  }

  await toggle.click();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    fail('меню', 'открытое меню не сообщает aria-expanded="true"');
  }

  const panelId = await toggle.getAttribute('aria-controls');
  if (!panelId || (await page.locator(`#${panelId}`).count()) === 0) {
    fail('меню', 'aria-controls не указывает на существующую панель');
  }

  await page.keyboard.press('Escape');
  if ((await toggle.getAttribute('aria-expanded')) !== 'false') {
    fail('меню', 'Escape не закрывает меню');
  }
  const focusReturned = await page.evaluate(
    () => document.activeElement?.getAttribute('aria-expanded') === 'false',
  );
  if (!focusReturned) fail('меню', 'после Escape фокус не вернулся на кнопку меню');

  // Первый Tab на свежей странице должен попадать на «К основному содержимому»
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const firstStop = await page.evaluate(() => document.activeElement?.className ?? '');
  if (!firstStop.includes('skip-link')) fail('клавиатура', 'первый Tab не попадает на skip-link');

  // Видимый фокус
  const outline = await page.evaluate(() => {
    const link = document.querySelector('a.skip-link');
    return link ? getComputedStyle(link).outlineWidth : '';
  });
  if (outline === '0px') fail('клавиатура', 'у сфокусированного элемента нет видимой обводки');

  await mobile.close();
}

// Уважение prefers-reduced-motion
{
  const reduced = await browser.newContext({ reducedMotion: 'reduce', locale: 'ru-RU' });
  const page = await reduced.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const duration = await page.evaluate(() => {
    const button = document.querySelector('.btn');
    return button ? getComputedStyle(button).transitionDuration : '';
  });
  if (duration && parseFloat(duration) > 0.01) {
    fail('анимации', `при prefers-reduced-motion остаётся переход ${duration}`);
  }
  await reduced.close();
}

// Контент без JavaScript
const noJsContext = await browser.newContext({ javaScriptEnabled: false, locale: 'ru-RU' });
const noJsPage = await noJsContext.newPage();

for (const route of ['/', '/voda/', '/voda/utoli-19l/', '/dostavka-vody-ukhta/']) {
  await noJsPage.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
  const state = await noJsPage.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim() ?? '',
    links: document.querySelectorAll('a[href]').length,
    text: (document.querySelector('main')?.textContent ?? '').replace(/\s+/g, ' ').trim().length,
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    faqAnswers: document.querySelectorAll('details p').length,
  }));
  if (!state.h1) fail(route, 'без JS нет H1');
  if (state.links < 20) fail(route, `без JS мало ссылок: ${state.links}`);
  if (state.text < 800) fail(route, `без JS мало текста: ${state.text} символов`);
  if (state.jsonLd === 0) fail(route, 'без JS нет JSON-LD');
}

// Ответ 404 на несуществующем адресе
const missing = await noJsPage.goto(`${BASE}/takoy-stranicy-net/`);
if (missing?.status() !== 404) problems.push(`/takoy-stranicy-net/: ожидался 404, получен ${missing?.status()}`);

await noJsContext.close();
await browser.close();

for (const note of notes) console.log(`note   ${note}`);

if (problems.length === 0) {
  console.log(`\nАудит пройден: ${ROUTES.length} страниц, замечаний нет.`);
  process.exit(0);
}

console.error(`\nНайдено проблем: ${problems.length}`);
for (const problem of problems) console.error(`  - ${problem}`);
process.exit(1);
