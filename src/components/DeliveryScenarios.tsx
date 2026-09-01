import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { trioImage } from '@/lib/product-images';
import { HomeIcon, OfficeIcon } from '@/components/Icons';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './DeliveryScenarios.module.css';

/** Два сценария доставки: домой и в офис. */
export function DeliveryScenarios() {
  return (
    <section className="section section--ice" aria-labelledby="scenarios-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Куда возим</p>
          <h2 id="scenarios-title">Доставка домой и в офис</h2>
          <p className="section__lead">
            Бутыль 19 л — базовый формат и для квартиры, и для рабочего места. Возим по{' '}
            {site.cityPrepositional}, пригородам и в Сосногорск.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.icon}>
              <HomeIcon size={24} />
            </span>
            <h3 className={styles.title}>Домой</h3>
            <p className={styles.text}>
              Вода для питья, чая, кофе и приготовления еды. Одной бутыли обычно хватает семье на
              несколько дней — заказ можно повторить в приложении в пару касаний.
            </p>
            <div className={styles.actions}>
              <TrackedLink
                href={routes.app.path}
                event="click_delivery_cta"
                eventParams={{ place: 'scenario_home' }}
                className="btn btn--sm"
              >
                Заказать в приложении
              </TrackedLink>
            </div>
          </article>

          <article className={styles.card}>
            <span className={styles.icon}>
              <OfficeIcon size={24} />
            </span>
            <h3 className={styles.title}>В офис</h3>
            <p className={styles.text}>
              Регулярный запас воды для сотрудников и гостей. Расход в офисе выше, чем дома, поэтому
              удобно заранее договориться о графике заказов.
            </p>
            <div className={styles.actions}>
              <TrackedLink
                href={routes.app.path}
                event="click_delivery_cta"
                eventParams={{ place: 'scenario_office' }}
                className="btn btn--sm"
              >
                Заказать в приложении
              </TrackedLink>
            </div>
          </article>

          <figure className={styles.media}>
            <Image
              src={trioImage}
              alt="Три бутыли питьевой воды Утоли по 19 литров"
              sizes="(max-width: 1023px) 72vw, 380px"
              quality={72}
              className={styles.image}
            />
            <figcaption className={styles.caption}>
              Подробные условия — на странице{' '}
              <Link href={routes.delivery.path}>доставки воды в {site.cityPrepositional}</Link>.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
