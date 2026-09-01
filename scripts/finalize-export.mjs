/**
 * Доводка статической сборки до готовности к GitHub Pages.
 *
 * 1. `.nojekyll` — без него Pages выкидывает папку `_next`, потому что она
 *    начинается с подчёркивания, и сайт остаётся без стилей и скриптов.
 * 2. `CNAME` — свой домен. Берётся из NEXT_PUBLIC_SITE_URL, чтобы домен
 *    не пришлось держать в двух местах.
 *
 * Запускается автоматически после `npm run build`.
 */
import { copyFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'out';

/**
 * Next 16 кладёт файлы посегментного префетча в подпапки `__next.<сегмент>/`,
 * а браузер запрашивает их одним именем через точку:
 * `__next.voda/__PAGE__.txt` на диске против `__next.voda.__PAGE__.txt` в запросе.
 * На сервере Next разница незаметна, на статике это 404 при каждом наведении
 * на ссылку. Дублируем файлы под тем именем, которое реально запрашивается.
 */
async function flattenPrefetchFiles(dir) {
  let created = 0;

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (!entry.isDirectory()) continue;

    if (entry.name.startsWith('__next.')) {
      created += await copyFlattened(full, dir, entry.name);
      continue;
    }

    created += await flattenPrefetchFiles(full);
  }

  return created;
}

/** Рекурсивно копирует содержимое `__next.*` рядом, склеивая путь точками. */
async function copyFlattened(dir, targetDir, prefix) {
  let created = 0;

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      created += await copyFlattened(full, targetDir, `${prefix}.${entry.name}`);
    } else {
      await copyFile(full, path.join(targetDir, `${prefix}.${entry.name}`));
      created += 1;
    }
  }

  return created;
}

await writeFile(path.join(OUT, '.nojekyll'), '');
console.log('.nojekyll  создан');

const flattened = await flattenPrefetchFiles(OUT);
console.log(`префетч    продублировано файлов: ${flattened}`);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (siteUrl) {
  const { hostname } = new URL(siteUrl);
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('CNAME      пропущен: NEXT_PUBLIC_SITE_URL указывает на localhost');
  } else {
    await writeFile(path.join(OUT, 'CNAME'), `${hostname}\n`);
    console.log(`CNAME      ${hostname}`);
  }
} else {
  console.log('CNAME      пропущен: NEXT_PUBLIC_SITE_URL не задан');
}

const entries = await readdir(OUT);
console.log(`\nПапка ${OUT}/ готова к публикации: ${entries.length} элементов в корне.`);
