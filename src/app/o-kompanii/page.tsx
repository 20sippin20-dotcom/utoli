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
        lead={`Доставка питьевой воды в бутылях 19 литров по ${site.cityPrepositional}. Выберите воду на сайте, закажите в приложении ${site.appName} или через оператора.`}
      />

      <section className="section" aria-labelledby="about-title">
        <div className="container">
          <div className="prose">
            <h2 id="about-title">Чем мы занимаемся</h2>
            <p>
              «{site.brandNameRu}» ({site.brandNameLatin}) производит и доставляет воду в бутылях
              19 литров по Ухте, её пригородам и Сосногорску. В каталоге три линейки: классическая
              вода для ежедневного потребления, особенно для офисов и больших организаций; вода
              премиум-класса «{site.brandNameRu} Магний» с магнием (Mg); вода «{site.brandNameRu}{' '}
              Premium» высшей категории очистки с микрочастицами серебра (Ag). Все бутыли одного
              формата и подходят для кулера и помпы.
            </p>

            <h2>Как устроен сервис</h2>
            <p>
              Заказ можно начать в приложении {site.appName}, на сайте через{' '}
              <Link href={routes.catalog.path}>каталог</Link> или по телефону у оператора. На сайте
              можно выбрать воду и перейти к оформлению в приложении; оператор поможет обсудить
              детали заказа и доставки.
            </p>

            <h2>Зона доставки</h2>
            <p>
              Доставляем воду по Ухте, в Шудаяг, Водный, Ярегу и Сосногорск. Если вашего адреса
              нет в зоне доставки, уточните возможность доставки у оператора по телефону{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>: маршрут часто
              можно согласовать.
            </p>

            <h2>Где смотреть актуальное</h2>
            <p>
              Актуальные цены и наличие приведены в приложении {site.appName}. Уточнить информацию
              через оператора можно с 9:00 до 18:00 по телефону{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneShortDisplay}</a>. Условия доставки —{' '}
              <Link href={routes.delivery.path}>на странице доставки</Link>. Документы качества —{' '}
              <Link href={routes.documents.path}>в разделе документов</Link>.
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
