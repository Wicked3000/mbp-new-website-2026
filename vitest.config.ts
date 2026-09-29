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
    // jsdom has no matchMedia. Run for the DOM tests only; the setup file checks
    // for a window itself, so the Node server tests are unaffected.
    setupFiles: ["./src/test/setupDom.ts"],
    /*
     * Two workers. Vitest's default is one per core, and each jsdom worker costs
     * roughly 100MB, so on a 16GB machine also running Vite, the API and MySQL
     * the suite died with "Zone Allocation failed - process out of memory"
     * rather than reporting a result. Every test file passes on its own and the
     * whole suite passes here, so this is contention and not a failing test -
     * but a suite that cannot complete is worse than a slow one.
     */
    maxWorkers: 2,
    minWorkers: 1,
  },
});
