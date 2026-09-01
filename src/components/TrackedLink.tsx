'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { track, type AnalyticsEvent } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number | boolean>;
  external?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

/**
 * Ссылка-конверсия. Внешние адреса (магазины приложений, VK) открываются в новой
 * вкладке с rel="noopener noreferrer", внутренние — обычной клиентской навигацией.
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  external,
  className,
  children,
  ...rest
}: TrackedLinkProps) {
  const onClick = () => track(event, eventParams);

  if (external) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith('tel:')) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
