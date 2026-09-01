import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

import { site } from '@/config/site';
import { baseUrl } from '@/lib/url';
import { Analytics } from '@/components/Analytics';
import { MobileStickyCta } from '@/components/MobileStickyCta';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

import '@/styles/globals.css';

/**
 * Manrope: одна гарнитура на заголовки и текст, кириллица, только нужные
 * начертания. Next скачивает шрифт на сборке и раздаёт локально в WOFF2 —
 * внешних запросов к Google в рантайме нет.
 */
const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `Доставка воды в ${site.cityPrepositional} — «${site.brandNameRu}» | Вода 19 л`,
    template: `%s | «${site.brandNameRu}»`,
  },
  description: `Питьевая вода «${site.brandNameRu}» 19 л с доставкой по ${site.cityPrepositional}. Заказ в приложении ${site.appName} или у диспетчера.`,
  applicationName: site.brandNameLatin,
  formatDetection: { telephone: true },
  verification: {
    google: site.searchVerification.google ?? undefined,
    yandex: site.searchVerification.yandex ?? undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#0B2D4B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <a className="skip-link" href="#main">
          К основному содержимому
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <div className="page-bottom-space" aria-hidden />
        <MobileStickyCta />
        <Analytics />
      </body>
    </html>
  );
}
