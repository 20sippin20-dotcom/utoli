import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      // Домен-заглушка только для тестов: боевой задаётся через NEXT_PUBLIC_SITE_URL.
      NEXT_PUBLIC_SITE_URL: 'https://test.local',
    },
  },
  resolve: {
    alias: { '@': new URL('./src/', import.meta.url).pathname },
  },
});
