/**
 * Финальные скриншоты для приёмки: главная и три товарные страницы
 * на mobile и desktop. Требует запущенного сервера.
 *
 * Запуск: npm run shots  (по умолчанию http://localhost:3100)
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = process.env.SHOT_BASE ?? 'http://localhost:3100';
const OUT = process.env.SHOT_OUT ?? 'qa/screenshots';

const PAGES = [
  ['home', '/'],
  ['catalog', '/voda/'],
  ['product-classic', '/voda/utoli-19l/'],
  ['product-magniy', '/voda/utoli-magniy-19l/'],
  ['product-premium', '/voda/utoli-premium-19l/'],
  ['delivery', '/dostavka-vody-ukhta/'],
  ['app', '/prilozhenie/'],
  ['contacts', '/kontakty/'],
  ['documents', '/dokumenty/'],
  ['404', '/net-takoy-stranicy/'],
];

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const [device, viewport] of VIEWPORTS) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: device === 'mobile' ? 2 : 1,
    isMobile: device === 'mobile',
    hasTouch: device === 'mobile',
    locale: 'ru-RU',
  });
  const page = await context.newPage();

  for (const [name, path] of PAGES) {
    const response = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const file = `${OUT}/${name}-${device}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`${String(response?.status()).padEnd(4)} ${device.padEnd(8)} ${path.padEnd(28)} -> ${file}`);
  }

  await context.close();
}

await browser.close();
