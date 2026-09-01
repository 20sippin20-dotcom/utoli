import type { JsonLdObject } from '@/lib/jsonld';

/**
 * Вывод JSON-LD в исходном HTML (без клиентского JS).
 * Пустые объекты не выводятся вообще — лучше отсутствие разметки, чем разметка с дырами.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item) => item && Object.keys(item).length > 0,
  );

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
