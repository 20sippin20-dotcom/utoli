import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { organizationJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { AppDownloadBlock } from '@/components/AppDownloadBlock';
import { ContactBlock } from '@/components/ContactBlock';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = pageMetadata({
  title: `Контакты — доставка воды «${site.brandNameRu}» в ${site.cityPrepositional}`,
  description: `Телефон диспетчера ${site.dispatcherPhoneDisplay}, официальная группа ВКонтакте и зона доставки воды «${site.brandNameRu}» в ${site.cityPrepositional}.`,
  path: routes.contacts.path,
});

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.contacts.label, path: routes.contacts.path }]}
        eyebrow="Контакты"
        title={`Контакты «${site.brandNameRu}» в ${site.cityPrepositional}`}
        lead="Заказ и вопросы по доставке — у диспетчера. Ниже собраны все официальные способы связи."
      />

      <ContactBlock heading="Как с нами связаться" />

      <section className="section section--ice" aria-labelledby="contacts-note-title">
        <div className="container">
          <div className="prose">
            <h2 id="contacts-note-title">Что уточнить по телефону</h2>
            <p>
              Диспетчер принимает заказы, подсказывает по линейкам воды и отвечает на вопросы о
              доставке: сколько бутылей удобно взять, как обменивается тара, какие условия действуют
              для организаций. Если вы заказываете впервые — это самый быстрый способ разобраться.
            </p>
            <p>
              Телефон: <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>.
              {site.workingHours
                ? ` Приём заказов: ${site.workingHours.opens}–${site.workingHours.closes}.`
                : ' График приёма заказов уточняйте у диспетчера.'}
            </p>
            <p>
              Официальная группа ВКонтакте:{' '}
              <a href={site.vkUrl} target="_blank" rel="noopener noreferrer">
                {site.vkUrl.replace('https://', '')}
              </a>
              . Других официальных аккаунтов и каналов заказа у сервиса нет.
            </p>
            <p>
              Доставляем по {site.deliveryAreasSummary}. Если вашего адреса нет в списке, спросите
              диспетчера — маршрут часто можно согласовать.
            </p>
          </div>
        </div>
      </section>

      <AppDownloadBlock withQr={false} />

      <JsonLd data={organizationJsonLd()} />
    </>
  );
}
