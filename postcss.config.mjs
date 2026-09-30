// Tailwind CSS v4 for Next.js. The Vite build used the @tailwindcss/vite plugin;
// Next.js has no Vite, so the same Tailwind is driven through PostCSS instead.
//
// There is deliberately no tailwind.config.js. v4 reads its theme from the
// @theme block in app/globals.css (ported from src/index.css), and scans source
// files itself - a config file would be a second, competing source of truth.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
