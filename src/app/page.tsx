import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { homeFaq } from '@/content/faq';
import { itemListJsonLd, organizationJsonLd, webSiteJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { AppDownloadBlock } from '@/components/AppDownloadBlock';
import { Benefits } from '@/components/Benefits';
import { ContactBlock } from '@/components/ContactBlock';
import { DeliveryScenarios } from '@/components/DeliveryScenarios';
import { Faq } from '@/components/Faq';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { LocalSeoContent } from '@/components/LocalSeoContent';
import { OrderSteps } from '@/components/OrderSteps';
import { CatalogSection } from '@/components/ProductGrid';

export const metadata: Metadata = pageMetadata({
  title: `Доставка воды в ${site.cityPrepositional} — «${site.brandNameRu}» | Вода 19 л`,
  description: `Закажите питьевую воду «${site.brandNameRu}» 19 л с доставкой по ${site.cityPrepositional}. Классическая, Магний и Premium. Заказ в приложении ${site.appName} или у диспетчера.`,
  path: routes.home.path,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CatalogSection />
      <AppDownloadBlock />
      <Benefits />
      <DeliveryScenarios />
      <OrderSteps />
      <LocalSeoContent />
      <Faq items={homeFaq} />
      <ContactBlock />

      <JsonLd data={[webSiteJsonLd(), organizationJsonLd(), itemListJsonLd()]} />
    </>
  );
}
