'use client';

import { useEffect } from 'react';

import { track } from '@/lib/analytics';

/** Отправляет view_product один раз при открытии карточки товара. */
export function ViewProductTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track('view_product', { product: slug });
  }, [slug]);

  return null;
}
