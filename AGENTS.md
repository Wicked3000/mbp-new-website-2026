# MBP Education Website

React + Vite + Tailwind CSS website for the Milne Bay Province Division of Education.

## Development Server

Start the Vite development server with `npm run dev`. It listens on `$PORT` (default `8443`) and supports hot reload.

- Frontend: `npm run dev`
- Frontend and API: `npm run dev:all`

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, development proxy, and the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm
- `public/assets/` - Site imagery, referenced by root-absolute path (`/assets/...`) and served statically
- `public/uploads/` - Admin-uploaded files. Deliberately **not** git-ignored: uploads are committed (via git-lfs) and copied into the build by Vite, so anything uploaded must be committed and the site rebuilt for it to deploy

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.
