import type { Metadata } from 'next';
import Link from 'next/link';

import { productPath, routes } from '@/config/routes';
import { products, site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { AppDownloadBlock } from '@/components/AppDownloadBlock';
import { ContactBlock } from '@/components/ContactBlock';
import { OrderSteps } from '@/components/OrderSteps';
import { PageHeader } from '@/components/PageHeader';
import { ProductGrid } from '@/components/ProductGrid';

export const metadata: Metadata = pageMetadata({
  title: `Доставка питьевой воды в ${site.cityPrepositional} домой и в офис`,
  description: `Как заказать доставку воды 19 л по ${site.cityPrepositional}: способы заказа, зона доставки, форматы для дома и офиса. Заказ в приложении ${site.appName} или у оператора.`,
  path: routes.delivery.path,
});

export default function DeliveryPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.delivery.label, path: routes.delivery.path }]}
        eyebrow="Доставка"
        title={`Доставка питьевой воды в ${site.cityPrepositional}`}
        lead={`Доставляем бутыли 19 литров домой и в офис. Выберите удобный способ заказа: приложение, сайт или звонок оператору.`}
      />

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="prose">
            <h2 id="how-title">Способы заказа</h2>
            <p>
              Заказ можно оформить тремя способами:
            </p>
            <ol>
              <li>
                Через приложение {site.appName} в{' '}
                <a href={site.appStoreUrl}>App Store</a> или{' '}
                <a href={site.googlePlayUrl}>Google Play</a>. В нём собраны каталог, актуальные
                позиции и условия доставки. Заказ можно оформить круглосуточно, без привязки к
                графику оператора, а прошлый заказ — повторить целиком.
              </li>
              <li>
                На сайте: выберите воду в <Link href={routes.catalog.path}>каталоге</Link> и
                перейдите к оформлению в приложении по кнопке заказа.
              </li>
              <li>
                Через оператора по телефону{' '}
                <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneShortDisplay}</a> с 9:00 до 18:00 ежедневно.
                Это удобно, если нужно обсудить детали заказа и особенности доставки.
              </li>
            </ol>

            <h2>Зона доставки</h2>
            <p>
              Доставляем воду по Ухте, в Шудаяг, Водный, Ярегу и Сосногорск. Если вашего адреса нет
              в зоне доставки, уточните возможность доставки по вашему маршруту у оператора по
              телефону <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a> — маршрут
              часто можно согласовать.
            </p>
            <ul>
              {site.deliveryAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>

            <h2>Доставка домой</h2>
            <p>
              Дома бутыль 19 л обычно ставят на кулер или механическую помпу. Такого объёма чаще
              всего хватает семье на несколько дней питья, чая, кофе и приготовления еды. Удобно
              заказывать сразу две бутыли: одна в работе, вторая в запасе.
            </p>

            <h2>Доставка в офис</h2>
            <p>
              В офисе вода расходуется заметно быстрее, чем дома: её пьют сотрудники и гости,
              используют для чая и кофе. Поэтому организации обычно договариваются о регулярных
              заказах. Порядок работы с юридическими лицами, документы и способы оплаты обсуждаются
              с оператором индивидуально.
            </p>

            <h2>Что уточнить у оператора</h2>
            <p>Эти вопросы удобнее решить голосом при первом заказе:</p>
            <ul>
              <li>стоимость доставки и минимальное количество бутылей;</li>
              <li>график приёма заказов и удобные интервалы;</li>
              <li>подъём бутылей на этаж;</li>
              <li>возвратная тара и залог за бутыль;</li>
              <li>доступные способы оплаты;</li>
              <li>условия для организаций.</li>
            </ul>
            <p>
              Условия доставки и оплаты также собраны на странице{' '}
              <Link href={routes.deliveryAndPayment.path}>доставки и оплаты</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--ice" aria-labelledby="what-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Что возим</p>
            <h2 id="what-title">Доступные линейки воды</h2>
            <p className="section__lead">
              Все позиции — в бутыли 19 литров. Подробности на страницах{' '}
              {products.map((product, index) => (
                <span key={product.id}>
                  <Link href={productPath(product.slug)}>{product.shortName}</Link>
                  {index < products.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      <OrderSteps />
      <AppDownloadBlock withQr={false} />
      <ContactBlock heading="Контакты оператора" />
    </>
  );
}
