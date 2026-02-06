import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 60000,
    sequence: {
      concurrent: false,
    },
    include: ["tests/live/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**", "tests/e2e-real-world.test.ts"],
  },
});
