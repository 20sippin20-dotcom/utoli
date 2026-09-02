import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { itemListJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { AppDownloadBlock } from '@/components/AppDownloadBlock';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { ProductGrid } from '@/components/ProductGrid';

export const metadata: Metadata = pageMetadata({
  title: `Вода «${site.brandNameRu}» 19 л — каталог и доставка в ${site.cityPrepositional}`,
  description: `Три линейки воды «${site.brandNameRu}» в бутылях 19 л: классическая, Магний и Premium. Сравните и закажите с доставкой по ${site.cityPrepositional}.`,
  path: routes.catalog.path,
});

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: routes.catalog.label, path: routes.catalog.path }]}
        eyebrow="Каталог"
        title={`Вода «${site.brandNameRu}» 19 л`}
        lead={`Три линейки в одинаковой бутыли 19 литров: классическая «${site.brandNameRu}», «${site.brandNameRu} Магний» с магнием и премиальная серия Premium.`}
      />

      <section className="section" aria-labelledby="grid-title">
        <div className="container">
          <div className="section__head">
            <h2 id="grid-title">Выберите свою воду</h2>
          </div>
          <ProductGrid priorityFirst />
        </div>
      </section>

      <section className="section section--ice" aria-labelledby="compare-title">
        <div className="container">
          <div className="section__head">
            <h2 id="compare-title">Чем линейки отличаются друг от друга</h2>
          </div>
          <div className="prose">
            <p>
              Все три позиции поставляются в одинаковой многооборотной бутыли 19 л с ручкой — она
              подходит и для кулера, и для механической помпы. Классическая «{site.brandNameRu}» —
              базовая питьевая вода на каждый день. «{site.brandNameRu} Магний» — вода с магнием, её
              легко узнать по фиолетово-синей этикетке. «{site.brandNameRu} Premium» — премиальная
              линейка с добавлением ионов серебра.
            </p>
            <p>
              Документы на продукцию — декларации и протоколы исследований — можно запросить у
              диспетчера, см. <a href={routes.documents.path}>страницу документов</a>.
            </p>
            <p>
              Актуальные цены и наличие показываются в приложении {site.appName}. Их также можно
              уточнить у диспетчера по номеру{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>.
            </p>
          </div>
        </div>
      </section>

      <AppDownloadBlock withQr={false} />

      <JsonLd data={itemListJsonLd()} />
    </>
  );
}
