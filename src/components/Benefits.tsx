import { site } from '@/config/site';
import { AppIcon, DropIcon, PhoneIcon, TruckIcon } from '@/components/Icons';

import styles from './Benefits.module.css';

/**
 * Только те преимущества, которые следуют из фактической модели работы.
 *
 * Здесь намеренно нет «100% экологично», «лучшая вода в городе», «тысячи
 * клиентов» и прочих клише: подтверждающих данных нет. Блок расширяется
 * после получения документов качества, условий доставки и способов оплаты.
 */
const ITEMS = [
  {
    icon: AppIcon,
    title: 'Заказ в приложении',
    text: `Каталог, корзина и повтор прошлого заказа — в приложении ${site.appName} для Android и iPhone.`,
  },
  {
    icon: DropIcon,
    title: 'Три линейки воды',
    text: 'Классическая «Утоли», «Утоли Магний» с магнием и «Утоли Premium» с ионами серебра.',
  },
  {
    icon: TruckIcon,
    title: 'Формат 19 литров',
    text: 'Один объём для дома и офиса: подходит для кулера и механической помпы.',
  },
  {
    icon: PhoneIcon,
    title: 'Живой диспетчер',
    text: `Если удобнее договориться голосом — звоните: ${site.dispatcherPhoneDisplay}.`,
  },
];

export function Benefits() {
  return (
    <section className="section" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Коротко о сервисе</p>
          <h2 id="benefits-title">Почему выбирают «{site.brandNameRu}»</h2>
        </div>

        <ul className={styles.grid}>
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <li key={title} className={styles.item}>
              <span className={styles.icon}>
                <Icon size={22} />
              </span>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.text}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
