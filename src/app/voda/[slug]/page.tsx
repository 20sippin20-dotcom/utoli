import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { productPath, routes } from '@/config/routes';
import { getProduct, otherProducts, products, site } from '@/config/site';
import { technicalSpec } from '@/content/documents';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/jsonld';
import { productImage } from '@/lib/product-images';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppIcon, CheckIcon, PhoneIcon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { PriceLine } from '@/components/PriceLine';
import { ProductCard } from '@/components/ProductCard';
import { TrackedLink } from '@/components/TrackedLink';
import { ViewProductTracker } from '@/components/ViewProductTracker';

import styles from './product.module.css';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const image = productImage(product.image);

  return pageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: productPath(product.slug),
    image: {
      url: `/images/${product.image}`,
      width: image.width,
      height: image.height,
      alt: product.imageAlt,
    },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const image = productImage(product.image);
  const related = otherProducts(product.slug);
  const crumbs = [
    { name: routes.catalog.label, path: routes.catalog.path },
    { name: product.shortName, path: productPath(product.slug) },
  ];

  return (
    <div style={{ ['--accent' as string]: product.accentColor }}>
      <div className={styles.top}>
        <div className="container">
          <Breadcrumbs items={crumbs} />

          <div className={styles.hero}>
            <figure className={styles.media}>
              <Image
                src={image}
                alt={product.imageAlt}
                sizes="(max-width: 900px) 72vw, 460px"
                className={styles.image}
                quality={72}
                priority
                fetchPriority="high"
              />
            </figure>

            <div className={styles.info}>
              <p className="eyebrow">Вода «{site.brandNameRu}» · {product.volumeLiters} л</p>
              <h1 className={styles.title}>{product.seo.h1}</h1>
              <p className={styles.description}>{product.shortDescription}</p>

              <PriceLine product={product} variant="hero" className={styles.price} />

              <div className={styles.actions}>
                <TrackedLink
                  href={routes.app.path}
                  event="select_product"
                  eventParams={{ product: product.slug, place: 'product_hero' }}
                  className="btn"
                >
                  <AppIcon size={20} className="btn__icon" />
                  Заказать в приложении
                </TrackedLink>
                <TrackedLink
                  href={site.dispatcherPhoneHref}
                  event="click_phone_product"
                  eventParams={{ product: product.slug }}
                  className="btn btn--secondary"
                >
                  <PhoneIcon size={20} className="btn__icon" />
                  {site.dispatcherPhoneDisplay}
                </TrackedLink>
              </div>

              <ul className={styles.facts}>
                {product.verifiedFacts.map((fact) => (
                  <li key={fact.label} className={styles.fact}>
                    <CheckIcon size={18} className={styles.factIcon} />
                    <span className={styles.factLabel}>{fact.label}:</span> {fact.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="section" aria-labelledby="description-title">
        <div className="container">
          <div className="prose">
            <h2 id="description-title">Описание</h2>
            <ProductDescription slug={product.slug} />

            <h2>Характеристики</h2>
            <dl className={styles.specs}>
              {product.verifiedFacts.map((fact) => (
                <div key={fact.label} className={styles.specRow}>
                  <dt className={styles.specTerm}>{fact.label}</dt>
                  <dd className={styles.specValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>


            <p>
              Продукция выпускается по {technicalSpec} и имеет сертификат соответствия и
              декларацию ЕАЭС. Полный состав и сканы документов — на{' '}
              <Link href={routes.documents.path}>странице документов</Link>.
            </p>

            <h2>Доставка и заказ</h2>
            <p>
              Воду «{site.brandNameRu}» доставляем по {site.cityPrepositional}. Заказ оформляется в
              приложении {site.appName} или у оператора по номеру{' '}
              <a href={site.dispatcherPhoneHref}>{site.dispatcherPhoneDisplay}</a>. Возим по{' '}
              {site.cityPrepositional}, пригородам и в Сосногорск — подробности на странице{' '}
              <Link href={routes.delivery.path}>доставки</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--ice" aria-labelledby="related-title">
        <div className="container">
          <div className="section__head">
            <h2 id="related-title">Другие виды воды «{site.brandNameRu}»</h2>
          </div>
          <div className={styles.related}>
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
            <aside className={styles.relatedCta}>
              <h3 className={styles.relatedTitle}>Не определились?</h3>
              <p className={styles.relatedText}>
                Все три линейки — в одинаковой бутыли 19 л. Посмотрите каталог целиком или спросите
                оператора, что чаще берут в {site.cityPrepositional}.
              </p>
              <Link href={routes.catalog.path} className="btn btn--secondary btn--sm">
                Весь каталог
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <ViewProductTracker slug={product.slug} />
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([{ name: 'Главная', path: '/' }, ...crumbs]),
        ]}
      />
    </div>
  );
}

/** Описания линеек воды. */
function ProductDescription({ slug }: { slug: string }) {
  if (slug === 'utoli-magniy-19l') {
    return (
      <>
        <p>
          «{site.brandNameRu} Магний» — вода премиум-класса с содержанием магния (Mg): не просто
          вода, а эликсир бодрости, обогащённый природным магнием.
        </p>
        <p>Полезные свойства магния:</p>
        <ul>
          <li>заряд энергии — магний участвует в производстве энергии в клетках, помогает бороться с усталостью и повышает работоспособность;</li>
          <li>спокойствие и ясность ума — снижает уровень стресса, улучшает качество сна и поддерживает нервную систему;</li>
          <li>здоровье сердца — способствует нормализации сердечного ритма и поддержанию здорового артериального давления;</li>
          <li>крепкие кости — работает в синергии с кальцием, укрепляя костную ткань.</li>
        </ul>
        <p>
          Идеальный выбор для активных людей, спортсменов и тех, кто много работает и часто
          чувствует напряжение. Бутыль 19 л подходит для кулера и помпы.
        </p>
      </>
    );
  }

  if (slug === 'utoli-premium-19l') {
    return (
      <>
        <p>
          «{site.brandNameRu} Premium» — вода высшей категории очистки, дополненная
          микрочастицами серебра (Ag), известного своими уникальными свойствами на протяжении
          веков.
        </p>
        <p>Полезные свойства серебра:</p>
        <ul>
          <li>естественная чистота — серебро обладает мощным бактерицидным действием, обеспечивая воде дополнительную защиту от микроорганизмов;</li>
          <li>поддержка иммунитета — помогает укрепить защитные силы организма, особенно в периоды сезонных простуд;</li>
          <li>польза для пищеварения — способствует созданию здоровой микрофлоры в кишечнике;</li>
          <li>эталон вкуса — отсутствие посторонних примесей и бактерий делает вкус этой воды невероятно мягким и чистым.</li>
        </ul>
        <p>Бутыль 19 л подходит для кулера и помпы.</p>
      </>
    );
  }

  return (
    <>
      <p>
        Классическая «{site.brandNameRu}» — базовая позиция каталога: питьевая вода в многооборотной
        бутыли 19 литров с ручкой. Это тот же формат, что и у линеек Магний и Premium, поэтому её
        можно ставить на любой стандартный кулер или механическую помпу.
      </p>
      <p>
        Один такой объём обычно закрывает потребность семьи в питьевой воде на несколько дней:
        питьё, чай, кофе, приготовление еды. В офисе расход выше, поэтому воду чаще заказывают сразу
        по несколько бутылей.
      </p>
      <p>
        Природная питьевая вода первой категории. Результаты лабораторных испытаний и сканы
        документов опубликованы на сайте.
      </p>
    </>
  );
}
