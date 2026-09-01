/**
 * QR-коды на официальные страницы магазинов приложений.
 *
 * URL читаются из src/config/site.ts — единственного источника истины,
 * поэтому QR и кнопки не могут разойтись. Формат SVG: меньше килобайта
 * и идеальная резкость на любом экране.
 *
 * Запуск: npm run qr
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import QRCode from 'qrcode';

const CONFIG_PATH = 'src/config/site.ts';

function readUrl(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*'([^']+)'`));
  if (!match?.[1]) throw new Error(`Не найден ${field} в ${CONFIG_PATH}`);
  return match[1];
}

const source = await readFile(CONFIG_PATH, 'utf8');

const targets = [
  ['google-play.svg', readUrl(source, 'googlePlayUrl')],
  ['app-store.svg', readUrl(source, 'appStoreUrl')],
];

await mkdir('public/qr', { recursive: true });

for (const [file, url] of targets) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: '#0B2D4B', light: '#FFFFFF' },
  });
  await writeFile(`public/qr/${file}`, svg, 'utf8');
  console.log(`qr     ${file.padEnd(20)} -> ${url}`);
}
