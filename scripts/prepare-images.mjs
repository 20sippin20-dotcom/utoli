/**
 * Подготовка ассетов из оригиналов заказчика (_source-assets) в исходники приложения.
 * Фотографии не перерисовываются: только копирование, лёгкая оптимизация и вырезание
 * логотипа с плоской фирменной подложки в прозрачный PNG.
 *
 * Запуск: npm run images
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '_source-assets';
const IMAGES = 'src/assets/images';
const BRAND = 'src/assets/brand';
const APP = 'src/app';
const PUBLIC_IMAGES = 'public/images';

const PHOTOS = [
  ['utoli-19l-source.jpg', 'utoli-19l.jpg'],
  ['utoli-magniy-19l-source.jpg', 'utoli-magniy-19l.jpg'],
  ['utoli-premium-19l-source.jpg', 'utoli-premium-19l.jpg'],
  ['utoli-trio-classic-source.jpg', 'utoli-trio-19l.jpg'],
  ['utoli-line-source.jpg', 'utoli-liniya-19l.jpg'],
];

// Плоский фон исходного логотипа, по нему строится альфа-канал.
const LOGO_BG = '#547e8e';
const LOGO_BG_LUMA = 0.299 * 0x54 + 0.587 * 0x7e + 0.114 * 0x8e;
const A = 255 / (255 - LOGO_BG_LUMA);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function copyPhotos() {
  for (const [from, to] of PHOTOS) {
    // JPEG с постоянным URL: нужен для абсолютных image в JSON-LD и Open Graph,
    // где WebP поддерживают не все соцсети.
    const jpeg = await sharp(path.join(SRC, from))
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(PUBLIC_IMAGES, to));
    console.log(`jpeg   ${to.padEnd(26)} ${jpeg.width}x${jpeg.height}  ${kb(jpeg.size)}`);

    // WebP для показа на страницах: на статическом хостинге оптимизатора Next нет,
    // поэтому лёгкий формат готовим заранее.
    const webpName = to.replace(/\.jpg$/, '.webp');
    const webp = await sharp(path.join(SRC, from))
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(IMAGES, webpName));
    console.log(`webp   ${webpName.padEnd(26)} ${webp.width}x${webp.height}  ${kb(webp.size)}`);
  }
}

/** Белая марка на плоской подложке -> прозрачный PNG нужного цвета. */
async function makeMark(tint, file) {
  const trimmed = await sharp(path.join(SRC, 'logo-source.jpg'))
    .trim({ background: LOGO_BG, threshold: 20 })
    .toBuffer();

  const alpha = await sharp(trimmed)
    .greyscale()
    .linear(A, -LOGO_BG_LUMA * A)
    .toColourspace('b-w')
    .toBuffer();

  const { width, height } = await sharp(alpha).metadata();

  const info = await sharp({ create: { width, height, channels: 3, background: tint } })
    .joinChannel(alpha)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND, file));

  console.log(`mark   ${file.padEnd(26)} ${info.width}x${info.height}  ${kb(info.size)}`);
}

/** Версия без строки-дескриптора: только знак UTOLI (для шапки и футера). */
async function makeWordmarks() {
  const pairs = [
    ['logo-mark-white.png', 'logo-wordmark-white.png'],
    ['logo-mark-navy.png', 'logo-wordmark-navy.png'],
  ];
  for (const [from, to] of pairs) {
    const src = path.join(BRAND, from);
    const meta = await sharp(src).metadata();
    const info = await sharp(src)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.74) })
      .trim({ threshold: 1 })
      .png({ compressionLevel: 9 })
      .toFile(path.join(BRAND, to));
    console.log(`mark   ${to.padEnd(26)} ${info.width}x${info.height}`);
  }
}

/** Квадратные иконки: белая марка на фирменном тёмно-синем. */
async function makeIcons() {
  const mark = path.join(BRAND, 'logo-wordmark-white.png');
  for (const [size, file] of [[512, 'icon.png'], [180, 'apple-icon.png']]) {
    const inner = await sharp(mark).resize({ width: Math.round(size * 0.72), fit: 'inside' }).toBuffer();
    const info = await sharp({ create: { width: size, height: size, channels: 4, background: '#0B2D4B' } })
      .composite([{ input: inner, gravity: 'centre' }])
      .png()
      .toFile(path.join(APP, file));
    console.log(`icon   ${file.padEnd(26)} ${info.width}x${info.height}`);
  }
}

for (const dir of [IMAGES, BRAND, APP, PUBLIC_IMAGES]) await mkdir(dir, { recursive: true });
console.log('источники:', (await readdir(SRC)).join(', '), '\n');
await copyPhotos();
await makeMark({ r: 255, g: 255, b: 255 }, 'logo-mark-white.png');
await makeMark({ r: 0x0b, g: 0x2d, b: 0x4b }, 'logo-mark-navy.png');
await makeWordmarks();
await makeIcons();
console.log('\nготово');
