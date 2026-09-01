import type { FaqItem } from '@/content/faq';
import { faqJsonLd } from '@/lib/jsonld';
import { JsonLd } from '@/components/JsonLd';

import styles from './Faq.module.css';

/**
 * Аккордеон на details/summary: ответы присутствуют в HTML и раскрываются
 * без клиентского JavaScript. FAQPage размечает ровно эти вопросы.
 */
export function Faq({ items, title = 'Частые вопросы' }: { items: FaqItem[]; title?: string }) {
  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section__head section__head--center">
          <p className="eyebrow">Вопросы и ответы</p>
          <h2 id="faq-title">{title}</h2>
        </div>

        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.question} className={styles.item} name="utoli-faq">
              <summary className={styles.summary}>
                <span>{item.question}</span>
                <span aria-hidden className={styles.marker} />
              </summary>
              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}
