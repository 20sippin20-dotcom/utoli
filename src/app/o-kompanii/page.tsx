import type { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { ContactBlock } from '@/components/ContactBlock';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = pageMetadata({
  title: `О компании «${site.brandNameRu}»`,
  description: `«${site.brandNameRu}» — доставка питьевой воды 19 л в ${site.cityPrepositional}, пригороды и Сосногорск. Как устроен сервис и где смотреть актуальные условия.`,
  path: routes.about.path,
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.about.label, path: routes.about.path }]}
        eyebrow="О нас"
        title={`О сервисе «${site.brandNameRu}»`}
        lead={`Доставка питьевой воды в бутылях 19 литров по ${site.cityPrepositional}. Заказ — в приложении ${site.appName} или у диспетчера.`}
      />

      <section className="section" aria-labelledby="about-title">
        <div className="container">
          <div className="prose">
            <h2 id="about-title">Чем мы занимаемся</h2>
            <p>
              «{site.brandNameRu}» ({site.brandNameLatin}) — питьевая вода в бутылях 19 литров и её
              доставка по {site.cityPrepositional}, пригородам и в Сосногорск. В каталоге три
              линейки: классическая, «{site.brandNameRu} Магний» — вода с магнием — и «
              {site.brandNameRu} Premium» с добавлением ионов серебра. Формат один и тот же, поэтому бутыль подходит и для
              кулера, и для механической помпы.
            </p>

            <h2>Как устроен сервис</h2>
            <p>
              Заказы принимаются двумя способами: через мобильное приложение {site.appName} и по
              телефону у диспетчера. Сайт — это витрина и справочник: здесь видно, какая вода есть,
              как её заказать и куда обратиться с вопросом. Корзина и оплата живут в приложении,
              поэтому на сайте не может появиться устаревшая цена или позиция, которой уже нет в
              наличии.
            </p>

            <h2>Зона доставки</h2>
            <p>
              Возим воду по {site.cityPrepositional} и в пригороды — Шудаяг, Водный, Ярега, — а
              также в Сосногорск. Если ваш адрес рядом с зоной, но в списке его нет, спросите
              диспетчера: маршрут часто можно согласовать.
            </p>

            <h2>Где смотреть актуальное</h2>
            <p>
              Цены и наличие — в приложении {site.appName}. Условия доставки —{' '}
              <Link href={routes.delivery.path}>на странице доставки</Link>. Документы качества —{' '}
              <Link href={routes.documents.path}>в разделе документов</Link>. Быстрее всего получить
              ответ на конкретный вопрос по телефону{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>.
            </p>

            {site.legalName ? (
              <>
                <h2>Реквизиты</h2>
                <p>{site.legalName}</p>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <ContactBlock />
    </>
  );
}
