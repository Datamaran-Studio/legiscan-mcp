import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable globals for describe, it, expect
    globals: true,
    // Increase timeout for API calls
    testTimeout: 30000,
    // Run tests sequentially to avoid API rate limits
    sequence: {
      concurrent: false
    },
    // Enable coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/types/**/*.ts']
    }
  }
});
