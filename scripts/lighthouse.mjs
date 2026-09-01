/**
 * Lighthouse на собранном сайте. Требует запущенного сервера.
 *
 * Chrome поднимается через Playwright и отдаётся Lighthouse по CDP —
 * так не нужен отдельно установленный системный Chrome.
 *
 * Запуск: npm run lighthouse  (по умолчанию http://localhost:3100)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const BASE = (process.env.LH_BASE ?? 'http://localhost:3100').replace(/\/$/, '');
const OUT = 'qa/lighthouse';
const PORT = 9222;

const PAGES = [
  ['home', '/'],
  ['product', '/voda/utoli-magniy-19l/'],
];

const FORM_FACTORS = [
  [
    'mobile',
    {
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675 },
    },
  ],
  [
    'desktop',
    {
      formFactor: 'desktop',
      screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
    },
  ],
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const summary = [];

for (const [device, settings] of FORM_FACTORS) {
  for (const [name, path] of PAGES) {
    const result = await lighthouse(`${BASE}${path}`, { port: PORT, output: ['json', 'html'], logLevel: 'error' }, {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        ...settings,
      },
    });

    if (!result) throw new Error(`Lighthouse не вернул отчёт для ${path}`);

    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]),
    );
    const metrics = {
      LCP: result.lhr.audits['largest-contentful-paint']?.displayValue,
      CLS: result.lhr.audits['cumulative-layout-shift']?.displayValue,
      TBT: result.lhr.audits['total-blocking-time']?.displayValue,
    };

    await writeFile(`${OUT}/${name}-${device}.report.html`, result.report[1], 'utf8');
    await writeFile(`${OUT}/${name}-${device}.report.json`, result.report[0], 'utf8');

    summary.push({ page: name, device, ...scores, ...metrics });
    console.log(
      `${device.padEnd(8)} ${name.padEnd(9)} perf ${String(scores.performance).padStart(3)}  a11y ${String(scores.accessibility).padStart(3)}  bp ${String(scores['best-practices']).padStart(3)}  seo ${String(scores.seo).padStart(3)}   LCP ${metrics.LCP}  CLS ${metrics.CLS}`,
    );
  }
}

await writeFile(`${OUT}/summary.json`, JSON.stringify(summary, null, 2), 'utf8');
await browser.close();
