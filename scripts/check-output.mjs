/**
 * Защита от публикации плейсхолдеров и чужих данных.
 *
 * Сканирует собранную статику (out/) на строки, которых
 * не должно быть в продакшене: незаполненные маркеры, тестовые телефоны,
 * следы референса и «нулевые» цены.
 *
 * Запуск: npm run check:output (после npm run build)
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOTS = ['out'];
const EXTENSIONS = new Set(['.html', '.txt', '.xml', '.json', '.svg', '.webmanifest']);
// Служебные бандлы Next пропускаем: там встречаются слова вроде «placeholder»
// из самого фреймворка, а весь наш текст и так есть в готовом HTML.
const SKIP_DIRS = new Set(['_next']);

/** [регулярное выражение, объяснение, критично ли] */
const RULES = [
  [/\bTODO\b(?!_OWNER)/i, 'незакрытый TODO', true],
  [/PLACEHOLDER/i, 'плейсхолдер', true],
  [/ВСТАВИТЬ|ЗАПОЛНИТЬ/i, 'незаполненные данные', true],
  [/lorem ipsum/i, 'рыба в тексте', true],
  [/example\.(com|org)/i, 'демо-домен', true],
  [/\[\s*(вставьте|укажите|адрес|телефон)\b/i, 'квадратный маркер', true],
  [/\+7\s?\(?000/, 'тестовый телефон', true],
  [/\+7\s?\(?123/, 'тестовый телефон', true],
  [/яркофф/i, 'следы чужого бренда', true],
  [/тобольск/i, 'чужой город', true],
  [/0\s?₽|"price"\s*:\s*0/, 'нулевая цена', true],
  [/18[,.]9\s?л|19[,.]9\s?л/, 'посторонний объём бутыли', true],
  [/localhost:\d+/, 'ссылка на localhost', false],
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    }
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

const problems = [];
let scanned = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    scanned += 1;
    const content = await readFile(file, 'utf8');
    for (const [pattern, reason, critical] of RULES) {
      const match = content.match(pattern);
      if (match) problems.push({ file, reason, critical, sample: match[0] });
    }
  }
}

console.log(`Проверено файлов: ${scanned}`);

if (problems.length === 0) {
  console.log('Плейсхолдеров и чужих данных не найдено.');
  process.exit(0);
}

const critical = problems.filter((problem) => problem.critical);

for (const problem of problems) {
  const mark = problem.critical ? 'ОШИБКА ' : 'внимание';
  console.log(`${mark}  ${problem.reason}: «${problem.sample}»  ->  ${problem.file}`);
}

if (critical.length > 0) {
  console.error(`\nНайдено критичных проблем: ${critical.length}. Публиковать нельзя.`);
  process.exit(1);
}
