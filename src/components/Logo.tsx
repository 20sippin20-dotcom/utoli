import Image from 'next/image';
import Link from 'next/link';

import { site } from '@/config/site';
import wordmarkNavy from '@/assets/brand/logo-wordmark-navy.png';
import wordmarkWhite from '@/assets/brand/logo-wordmark-white.png';

import styles from './Logo.module.css';

interface LogoProps {
  tone?: 'navy' | 'white';
  /** Высота знака в пикселях. */
  height?: number;
  /** true — знак не является ссылкой (например, на текущей главной). */
  asText?: boolean;
  className?: string;
}

/**
 * Фирменный знак UTOLI. Используется настоящий логотип заказчика,
 * очищенный от подложки, а не наборный текст.
 */
export function Logo({ tone = 'navy', height = 34, asText = false, className }: LogoProps) {
  const source = tone === 'white' ? wordmarkWhite : wordmarkNavy;
  const width = Math.round((source.width / source.height) * height);

  const image = (
    <Image
      src={source}
      alt={`${site.brandNameLatin} — ${site.brandNameRu}`}
      height={height}
      width={width}
      priority
      className={styles.image}
    />
  );

  if (asText) {
    return <span className={`${styles.logo} ${className ?? ''}`}>{image}</span>;
  }

  return (
    <Link href="/" className={`${styles.logo} ${className ?? ''}`} aria-label={`${site.brandNameRu} — на главную`}>
      {image}
    </Link>
  );
}
