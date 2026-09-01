/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Статический экспорт: `npm run build` кладёт готовые HTML, CSS и JS в папку out/.
   * Сервер не нужен — сайт раздаётся с GitHub Pages или любого статического хостинга.
   */
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Завершающий слеш обязателен для статики: каждый маршрут кладётся как
   * <путь>/index.html, и ссылки ведут прямо на него, без редиректов.
   */
  trailingSlash: true,

  images: {
    /**
     * На статическом хостинге нет обработчика /_next/image, поэтому оптимизация
     * выключена, а лёгкие WebP готовятся заранее скриптом `npm run images`.
     */
    unoptimized: true,
  },
};

export default nextConfig;
