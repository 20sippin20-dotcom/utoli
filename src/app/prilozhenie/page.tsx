import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { appFaq } from '@/content/faq';
import { mobileAppJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { AppDownloadBlock } from '@/components/AppDownloadBlock';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = pageMetadata({
  title: `Скачать ${site.appName} — приложение для заказа воды в ${site.cityPrepositional}`,
  description: `Официальное приложение ${site.appName}: каталог воды «${site.brandNameRu}» 19 л, корзина, история и повтор заказа. Ссылки на Google Play и App Store.`,
  path: routes.app.path,
});

export default function AppPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.app.label, path: routes.app.path }]}
        eyebrow="Приложение"
        title={`Приложение ${site.appName} для заказа воды в ${site.cityPrepositional}`}
        lead={`Основной способ заказать воду «${site.brandNameRu}»: каталог, корзина и история заказов в телефоне. Приложение доступно для Android и iPhone.`}
      />

      <AppDownloadBlock />

      <section className="section" aria-labelledby="app-about-title">
        <div className="container">
          <div className="prose">
            <h2 id="app-about-title">Что есть в приложении</h2>
            <p>
              В приложении собран каталог воды «{site.brandNameRu}» с тремя линейками по 19 литров.
              Вы выбираете позицию и количество бутылей, добавляете их в корзину и оформляете заказ.
              История покупок позволяет повторить прошлый заказ целиком, не набирая его заново.
              Актуальные цены и акции показываются там же — сайт их не дублирует, чтобы данные не
              расходились.
            </p>

            <h2>Как скачать</h2>
            <p>
              Приложение публикуется только в официальных магазинах: Google Play для Android и App
              Store для iPhone. Мы не размещаем сборки в APK-каталогах и сторонних магазинах — такие
              копии небезопасны и не обновляются. С компьютера удобно отсканировать QR-код выше:
              каждый код ведёт на официальную страницу магазина.
            </p>

            <h2>Если приложение не подходит</h2>
            <p>
              Заказ по телефону работает независимо от приложения. Позвоните диспетчеру по номеру{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a> — он примет заказ
              и ответит на вопросы о доставке.
            </p>
          </div>
        </div>
      </section>

      <Faq items={appFaq} title="Вопросы о приложении" />

      <JsonLd data={mobileAppJsonLd()} />
    </>
  );
}
