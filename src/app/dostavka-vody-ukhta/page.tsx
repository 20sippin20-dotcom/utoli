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
  description: `Как заказать доставку воды 19 л по ${site.cityPrepositional}: способы заказа, зона доставки, форматы для дома и офиса. Заказ в приложении ${site.appName} или у диспетчера.`,
  path: routes.delivery.path,
});

export default function DeliveryPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.delivery.label, path: routes.delivery.path }]}
        eyebrow="Доставка"
        title={`Доставка питьевой воды в ${site.cityPrepositional}`}
        lead={`Возим бутыли 19 литров домой и в офис. Заказ оформляется в приложении ${site.appName} или у диспетчера по телефону.`}
      />

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="prose">
            <h2 id="how-title">Способы заказа</h2>
            <p>
              Есть два способа заказать воду «{site.brandNameRu}». Первый — приложение{' '}
              {site.appName}: там собран каталог, видны актуальные позиции и условия, а прошлый заказ
              можно повторить целиком. Второй — звонок диспетчеру по номеру{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>: этот вариант
              удобнее, если нужно обсудить количество бутылей, адрес или особенности доставки.
            </p>
            <p>
              Корзина и оплата живут в приложении, поэтому на сайте не может появиться устаревшая
              цена или позиция, которой уже нет в наличии.
            </p>

            <h2>Зона доставки</h2>
            <p>
              Возим воду по {site.cityPrepositional} и в пригороды: Шудаяг, Водный, Ярега. Отдельно
              доставляем в Сосногорск. Если ваш адрес рядом с зоной, но в списке его нет, спросите
              диспетчера — маршрут часто можно согласовать.
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
              с диспетчером индивидуально.
            </p>

            <h2>Что уточнить у диспетчера</h2>
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
      <ContactBlock heading="Контакты диспетчера" />
    </>
  );
}
