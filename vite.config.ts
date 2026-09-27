import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    sourcemap: false,
    minify: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number.parseInt(process.env.PORT || "8443", 10),
    strictPort: true,
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
      // No /uploads proxy: uploads live in public/uploads and are served as
      // static files, so they work with or without the API running. Proxying
      // them shadowed the static copy and 502'd whenever the API was down.
    },
  },
  preview: {
    host: "0.0.0.0",
    port: Number.parseInt(process.env.PORT || "8443", 10),
  },
});
