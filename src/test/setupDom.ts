// jsdom implements neither matchMedia nor the media query listener API, but the
// site uses it to honour prefers-reduced-motion. Without this, any component
// that reads it throws on mount under test - which is how the rotating banner
// took the whole PageHero suite down with it.
//
// Registered in vitest.config.ts and skipped for the Node-environment server
// tests, which have no window at all.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const list = {
      media: query,
      // Every query reports "no preference" by default. A test that cares about
      // the reduced-motion branch overrides this with its own implementation.
      matches: false,
      onchange: null,
      addEventListener: (_type: string, fn: (event: MediaQueryListEvent) => void) => {
        listeners.add(fn);
      },
      removeEventListener: (_type: string, fn: (event: MediaQueryListEvent) => void) => {
        listeners.delete(fn);
      },
      addListener: (fn: (event: MediaQueryListEvent) => void) => listeners.add(fn),
      removeListener: (fn: (event: MediaQueryListEvent) => void) => listeners.delete(fn),
      dispatchEvent: () => true,
    };
    return list as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
}
