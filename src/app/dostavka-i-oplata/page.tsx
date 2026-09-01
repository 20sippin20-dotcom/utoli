import type { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { deliveryTermsReady } from '@/lib/status';
import { pageMetadata } from '@/lib/seo';
import { ContactBlock } from '@/components/ContactBlock';
import { PageHeader } from '@/components/PageHeader';

/**
 * Страница закрыта от индексации, пока не заполнены способы оплаты и условия
 * по таре: публиковать в индексе страницу, состоящую из «уточняется», вредно.
 * Как только данные появятся в конфиге, страница индексируется автоматически
 * и попадает в sitemap.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Доставка и оплата',
  description: `Порядок заказа воды «${site.brandNameRu}» в ${site.cityPrepositional}: способы заказа, оплата и возвратная тара.`,
  path: routes.deliveryAndPayment.path,
  noindex: !deliveryTermsReady(),
});

export default function DeliveryAndPaymentPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.deliveryAndPayment.label, path: routes.deliveryAndPayment.path }]}
        eyebrow="Условия"
        title="Доставка и оплата"
        lead="Здесь мы собираем практическую часть заказа: как проходит доставка, чем можно расплатиться и что происходит с пустой бутылью."
      />

      <section className="section" aria-labelledby="terms-title">
        <div className="container">
          <div className="prose">
            <h2 id="terms-title">Как проходит заказ</h2>
            <p>
              Заказ оформляется в приложении {site.appName} или у диспетчера по номеру{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>. После оформления
              диспетчер подтверждает заказ и согласовывает доставку по{' '}
              {site.cityPrepositional}.
            </p>

            <h2>Оплата</h2>
            {site.paymentMethods.length > 0 ? (
              <>
                <p>Доступные способы оплаты:</p>
                <ul>
                  {site.paymentMethods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>
                Удобный способ оплаты уточните у диспетчера при оформлении заказа — он подскажет,
                какие варианты доступны сейчас.
              </p>
            )}

            <h2>Возвратная тара</h2>
            {site.bottleDepositText ? (
              <p>{site.bottleDepositText}</p>
            ) : (
              <p>
                Бутыль 19 л многооборотная: пустую тару забирают при следующей доставке. Правила
                обмена и вопрос залога уточните у диспетчера.
              </p>
            )}

            <h2>Стоимость доставки</h2>
            {site.freeDeliveryThreshold !== null ? (
              <p>
                Доставка бесплатна при заказе от {site.freeDeliveryThreshold} бутылей.
              </p>
            ) : (
              <p>
                Актуальные условия доставки и минимальный заказ видны при оформлении в приложении{' '}
                {site.appName}. Их также можно уточнить у диспетчера.
              </p>
            )}

            <p className="muted">
              Подробнее о самой доставке — на странице{' '}
              <Link href={routes.delivery.path}>доставки воды в {site.cityPrepositional}</Link>.
            </p>
          </div>
        </div>
      </section>

      <ContactBlock heading="Спросить у диспетчера" />
    </>
  );
}
