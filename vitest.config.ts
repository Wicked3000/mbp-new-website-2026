// Client tests only. The server suite (server/__tests__/*.test.js) tested the
// Express app through supertest and went away with it; the Route Handlers in
// app/api are exercised through `npm run build` plus manual checks until they
// get their own suite - see the migration notes.
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  // Stated explicitly rather than inherited from tsconfig.json.
  //
  // This was load-bearing during the migration and is now belt-and-braces.
  // Next 16 sets "jsx": "react-jsx" in tsconfig, which Vite's transform would
  // pick up correctly on its own. But Vite 8 transforms with oxc (rolldown),
  // not esbuild, and it reads tsconfig.json independently of Next - so if
  // anything ever sets that field back to "preserve", every .tsx test fails to
  // parse with "make sure to not set jsx to preserve" and the cause is a single
  // line in a file the failing tests do not mention. Note the key is `oxc`:
  // Vite 8 dropped esbuild, and an `esbuild: { jsx }` option is silently
  // ignored. `runtime` is an object because that is how Vite 8 types it.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@app": path.resolve(import.meta.dirname, "./app"),
    },
  },
  test: {
    // app/ is included because app/__tests__/template.test.tsx covers the
    // fragment-scroll behaviour that replaced the old useScrollOnRouteChange
    // hook - it is a route-level concern now, not a component one.
    include: ["src/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
    environment: "node",
    // jsdom has no matchMedia. Run for the DOM tests only; the setup file checks
    // for a window itself, so any Node-environment tests are unaffected.
    setupFiles: ["./src/test/setupDom.ts"],
    /*
     * Two workers. Vitest's default is one per core, and each jsdom worker costs
     * roughly 100MB, so on a 16GB machine also running Next and MySQL the suite
     * died with "Zone Allocation failed - process out of memory" rather than
     * reporting a result. Every test file passes on its own and the whole suite
     * passes here, so this is contention and not a failing test - but a suite
     * that cannot complete is worse than a slow one.
     */
    maxWorkers: 2,
  },
});
