/**
 * Типы для импорта картинок (`.webp`, `.png`) и остальных возможностей Next.
 *
 * Обычно их даёт файл next-env.d.ts, но он лежит в .gitignore и создаётся
 * только при локальном запуске `next dev` или `next build`. На чистой машине —
 * например, в GitHub Actions — его нет, и `tsc --noEmit` падает на строках
 * вроде `import utoli from '@/assets/images/utoli-19l.webp'`.
 *
 * Поэтому те же ссылки на типы держим в репозитории явно.
 */

/// <reference types="next" />
/// <reference types="next/image-types/global" />
