// Server tests run in Node against a fake MySQL pool; the client tests need a DOM
// for localStorage, so they declare `// @vitest-environment jsdom` themselves.
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    include: ["server/**/*.test.js", "src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
