import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'out/**'] },
  ...coreWebVitals,
  ...typescript,
  {
    // Телефон живёт только в src/config/site.ts: в разметке — ссылка из конфига.
    files: ['src/components/**/*.tsx', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^tel:\+?\d/]',
          message: 'Телефон берётся из site.dispatcherPhoneHref, а не пишется в разметке.',
        },
      ],
    },
  },
];

export default config;
