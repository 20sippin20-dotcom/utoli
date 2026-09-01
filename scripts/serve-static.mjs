/**
 * Простой статический сервер для проверки собранной папки out/.
 *
 * Ведёт себя как GitHub Pages: отдаёт <путь>/index.html, сжимает текстовые
 * ответы (gzip/brotli), а на неизвестный
 * адрес — 404.html с настоящим кодом 404. Нужен только для QA-скриптов
 * (audit, lighthouse, shots), в продакшене файлы раздаёт хостинг.
 *
 * Запуск: npm run serve  (порт по умолчанию 3100)
 */
import { createReadStream } from 'node:fs';
import { createBrotliCompress, createGzip } from 'node:zlib';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.env.PORT ?? 3100);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const unsafe = path.normalize(path.join(ROOT, decoded));
  if (!unsafe.startsWith(ROOT)) return null;

  const candidates = unsafe.endsWith(path.sep)
    ? [path.join(unsafe, 'index.html')]
    : [unsafe, `${unsafe}.html`, path.join(unsafe, 'index.html')];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // пробуем следующий вариант
    }
  }
  return null;
}

/** Что имеет смысл сжимать: картинки и шрифты уже сжаты. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest|javascript))/;

function send(response, status, file, acceptEncoding) {
  const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' };
  const stream = createReadStream(file);

  if (COMPRESSIBLE.test(type)) {
    if (acceptEncoding.includes('br')) {
      response.writeHead(status, { ...headers, 'Content-Encoding': 'br' });
      stream.pipe(createBrotliCompress()).pipe(response);
      return;
    }
    if (acceptEncoding.includes('gzip')) {
      response.writeHead(status, { ...headers, 'Content-Encoding': 'gzip' });
      stream.pipe(createGzip()).pipe(response);
      return;
    }
  }

  response.writeHead(status, headers);
  stream.pipe(response);
}

const server = http.createServer(async (request, response) => {
  const acceptEncoding = String(request.headers['accept-encoding'] ?? '');
  const file = await resolveFile(request.url ?? '/');

  if (file) {
    send(response, 200, file, acceptEncoding);
    return;
  }

  // Как на GitHub Pages: собственная страница 404 с честным кодом ответа.
  const notFound = await resolveFile('/404.html');
  if (notFound) {
    send(response, 404, notFound, acceptEncoding);
    return;
  }
  response.writeHead(404, { 'Content-Type': TYPES['.html'] });
  response.end('404');
});

server.listen(PORT, () => {
  console.log(`Статика из ${ROOT} на http://localhost:${PORT}`);
});
