import { site } from '@/config/site';

import styles from './OrderSteps.module.css';

/**
 * Три шага заказа. Сроки, интервалы доставки и время подтверждения не
 * указываются — они не подтверждены.
 */
const STEPS = [
  {
    title: `Откройте приложение ${site.appName}`,
    text: 'Скачайте его в Google Play или App Store — ссылки есть в блоке выше.',
  },
  {
    title: 'Выберите воду и количество бутылей',
    text: 'Три линейки по 19 л: классическая «Утоли», «Утоли Магний» и «Утоли Premium».',
  },
  {
    title: 'Укажите данные заказа',
    text: 'Оформите заказ в приложении и дождитесь подтверждения.',
  },
];

export function OrderSteps() {
  return (
    <section className="section" aria-labelledby="steps-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Порядок заказа</p>
          <h2 id="steps-title">Как заказать воду</h2>
        </div>

        <ol className={styles.list}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.item}>
              <span aria-hidden className={styles.number}>
                {index + 1}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>

        <p className={styles.alt}>
          Не пользуетесь приложением? Позвоните диспетчеру по номеру{' '}
          <a href={site.dispatcherPhoneHref} className={styles.altPhone}>
            {site.dispatcherPhoneDisplay}
          </a>{' '}
          — заказ примут по телефону.
        </p>
      </div>
    </section>
  );
}
