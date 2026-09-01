import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { site } from '@/config/site';

export const alt = `Доставка воды «${site.brandNameRu}» 19 л в ${site.cityPrepositional}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Статический экспорт: картинка рисуется один раз на сборке.
export const dynamic = 'force-static';

/**
 * Уникальная OG-картинка из фирменной композиции и реальной фотографии товара.
 * Без мелкого текста и без цены — цены у нас нет.
 */
export default async function OpengraphImage() {
  // Статические начертания Manrope (кириллица + латиница): переменный шрифт
  // рендерер OG-картинок не читает.
  const [fontCyrillic, fontLatin, bottle, logo] = await Promise.all([
    readFile(path.join(process.cwd(), 'src/assets/fonts/Manrope-700-cyrillic.woff')),
    readFile(path.join(process.cwd(), 'src/assets/fonts/Manrope-700-latin.woff')),
    readFile(path.join(process.cwd(), 'public/images/utoli-liniya-19l.jpg')),
    readFile(path.join(process.cwd(), 'src/assets/brand/logo-wordmark-white.png')),
  ]);

  const bottleSrc = `data:image/jpeg;base64,${bottle.toString('base64')}`;
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0B2D4B 0%, #10527F 58%, #0B87B4 100%)',
          color: '#FFFFFF',
          fontFamily: 'Manrope',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
            padding: '64px 0 64px 72px',
            width: 720,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" height={68} />
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            {`Доставка воды в ${site.cityPrepositional}`}
          </div>
          <div style={{ fontSize: 34, color: '#D3EDF8', lineHeight: 1.3 }}>
            Питьевая вода 19 л для дома и офиса
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <div
              style={{
                display: 'flex',
                background: '#10A8DE',
                borderRadius: 999,
                padding: '13px 28px',
                fontSize: 24,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {`Заказ в приложении ${site.appName}`}
            </div>
            <div style={{ display: 'flex', fontSize: 24, color: '#D3EDF8', whiteSpace: 'nowrap' }}>
              {site.dispatcherPhoneDisplay}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', width: 480, height: 630, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bottleSrc} alt="" width={480} height={630} style={{ objectFit: 'cover' }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: fontCyrillic, style: 'normal', weight: 700 },
        { name: 'Manrope', data: fontLatin, style: 'normal', weight: 700 },
      ],
    },
  );
}
