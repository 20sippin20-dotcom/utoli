import { site } from '@/config/site';
import { PhoneIcon, VkIcon } from '@/components/Icons';
import { TrackedLink } from '@/components/TrackedLink';

import styles from './ContactBlock.module.css';

/**
 * NAP-данные обычным текстом. Адрес, график и профили организации появляются
 * автоматически, как только будут заполнены в конфиге; до этого блоки скрыты,
 * а не заполнены плейсхолдерами.
 */
export function ContactBlock({ heading = 'Контакты' }: { heading?: string }) {
  return (
    <section className="section" aria-labelledby="contacts-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Связь с нами</p>
          <h2 id="contacts-title">{heading}</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.title}>Диспетчер</h3>
            <TrackedLink
              href={site.dispatcherPhoneHref}
              event="click_phone_product"
              eventParams={{ place: 'contact_block' }}
              className={styles.phone}
            >
              <PhoneIcon size={22} />
              {site.dispatcherPhoneDisplay}
            </TrackedLink>
            <p className={styles.note}>
              Приём заказов по телефону и консультация по линейкам воды.
              {site.workingHours ? null : ' Точный график работы уточняйте у диспетчера.'}
            </p>
            {site.email ? (
              <p className={styles.note}>
                Почта:{' '}
                <a className={styles.link} href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            ) : null}
            {site.workingHours ? (
              <p className={styles.note}>
                Часы приёма: {site.workingHours.opens}–{site.workingHours.closes}
              </p>
            ) : null}
          </div>

          <div className={styles.card}>
            <h3 className={styles.title}>Зона доставки</h3>
            <address className={styles.address}>
              <span className={styles.addressStrong}>
                {site.city}, {site.region}
              </span>
              {site.address ? <span>{site.address}</span> : null}
              {site.postalCode ? <span>{site.postalCode}</span> : null}
            </address>
            <p className={styles.note}>Доставляем: {site.deliveryAreasSummary}.</p>
            <p className={styles.note}>
              Если вашего адреса нет в списке, спросите диспетчера — маршрут часто можно
              согласовать.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.title}>Официальные страницы</h3>
            <ul className={styles.links}>
              <li>
                <TrackedLink href={site.vkUrl} event="click_vk" external className={styles.link}>
                  <VkIcon size={20} />
                  Группа ВКонтакте
                </TrackedLink>
              </li>
              {site.twoGisUrl ? (
                <li>
                  <a
                    href={site.twoGisUrl}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Карточка в 2ГИС
                  </a>
                </li>
              ) : null}
              {site.yandexBusinessUrl ? (
                <li>
                  <a
                    href={site.yandexBusinessUrl}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Карточка в Яндекс Бизнес
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
