import Link from 'next/link';

import { productPath, routes } from '@/config/routes';
import { products, site } from '@/config/site';

import styles from './LocalSeoContent.module.css';

/** Основной текстовый блок главной: что заказать, в каком объёме, как и куда возим. */
export function LocalSeoContent() {
  return (
    <section className="section section--ice" aria-labelledby="about-title">
      <div className="container">
        <div className="section__head section__head--center">
          <p className="eyebrow">О сервисе</p>
          <h2 id="about-title">Доставка питьевой воды по {site.cityPrepositional}</h2>
        </div>

        <div className={`prose ${styles.body}`}>
          <p>
            «{site.brandNameRu}» — это питьевая вода в бутылях по 19 литров и доставка по{' '}
            {site.cityPrepositional}, пригородам и в Сосногорск. Заказ оформляется двумя способами: в
            мобильном приложении {site.appName} или звонком диспетчеру по номеру{' '}
            <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>. Корзины и
            онлайн-оплаты на сайте нет: всё оформление живёт в приложении, где видны актуальные
            позиции и условия.
          </p>

          <h3>Что можно заказать</h3>
          <p>
            В каталоге три позиции, все — в одинаковой бутыли 19 л с ручкой:{' '}
            {products.map((product, index) => (
              <span key={product.id}>
                <Link href={productPath(product.slug)}>{product.name}</Link>
                {index < products.length - 1 ? ', ' : '. '}
              </span>
            ))}
            Классическая «{site.brandNameRu}» — базовая питьевая вода, «{site.brandNameRu} Магний» —
            вода с магнием, «{site.brandNameRu} Premium» — премиальная линейка с ионами серебра.
          </p>

          <h3>Почему 19 литров</h3>
          <p>
            Девятнадцатилитровая бутыль — стандартный формат для кулера и механической помпы. Дома
            такого объёма обычно хватает на несколько дней питья, чая, кофе и готовки, а в офисе
            расход выше, поэтому воду чаще заказывают сразу по несколько бутылей. Тара
            многооборотная: пустую бутыль забирают при следующей доставке. Условия по возвратной
            таре уточняйте у диспетчера — их также опишем на странице{' '}
            <Link href={routes.deliveryAndPayment.path}>доставки и оплаты</Link>.
          </p>

          <h3>Как оформить заказ</h3>
          <p>
            Быстрее всего — через приложение: каталог, количество бутылей и данные доставки
            указываются в несколько касаний, а прошлый заказ можно повторить целиком. Приложение{' '}
            {site.appName} есть и для Android, и для iPhone; ссылки и QR-коды собраны на{' '}
            <Link href={routes.app.path}>странице приложения</Link>. Если удобнее договориться
            голосом — обсудить количество бутылей, адрес и удобное время можно с диспетчером по
            телефону.
          </p>

          <h3>Кому подходит</h3>
          <p>
            Семьям, которые не хотят каждый раз нести воду из магазина; квартирам без фильтра;
            офисам, кофейням и небольшим производствам, где вода нужна регулярно и в понятном
            объёме. Для организаций порядок работы и оплату проще обсудить с диспетчером напрямую.
          </p>

          <h3>Куда возим</h3>
          <p>
            Зона доставки — {site.deliveryAreasSummary}. Если ваш адрес рядом с зоной, но в списке
            его нет, спросите диспетчера: маршрут часто можно согласовать. Подробности собраны на
            странице{' '}
            <Link href={routes.delivery.path}>доставки воды в {site.cityPrepositional}</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
