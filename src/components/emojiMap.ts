// Emoji to SVG.
//
// The admin stores an icon per content row - hero tiles, curriculum areas,
// programme cards, support blocks - and about seventy of those rows hold a
// pictographic emoji. Emoji are drawn by the platform rather than the
// stylesheet, so they arrive in colour, at a size that ignores the font, and
// differently on Windows, macOS, Android and Linux.
//
// Replacing the emoji in the database would be a migration that every future
// edit could undo, and would break any row the admin adds from a habit of
// typing an emoji. So the stored value is kept and translated at render time:
// the database keeps what it has always held, and the page draws an SVG.
//
// Content written before this existed is therefore translated rather than
// migrated, which is also why the lookup below is keyed on the emoji itself.

/** The name of an icon in the shared set. */
export type IconName = string;

/**
 * Every pictographic emoji the site stored or hardcoded, mapped to the icon
 * that replaces it. Grouped by what the icon depicts, not by where it was used.
 */
export const EMOJI_MAP: Record<string, IconName> = {
  // --- places and buildings
  "🏫": "school",
  "🏢": "building",
  "🏭": "factory",
  "🏛": "landmark",
  "🏥": "hospital",
  "🏗": "hard-hat",
  "🏠": "home",

  // --- people
  "👨": "users",
  "👩": "users",
  "👨‍🏫": "users",
  "👩‍🏫": "users",
  "👨‍💻": "users",
  "👩‍💻": "users",
  "👥": "users-round",
  "🤝": "handshake",

  // --- education
  "🎓": "graduation-cap",
  "📖": "book-open",
  "📚": "library",
  "📕": "book",
  "📗": "book-open",
  "📘": "book-open",
  "📙": "book-open",
  "📝": "pencil-line",
  "📋": "clipboard-list",
  "📜": "scroll-text",
  "✝": "cross",
  "✝️": "cross",

  // --- science and technology
  "🔬": "flask-conical",
  "🔢": "hash",
  "💻": "laptop",
  "📱": "smartphone",
  "📡": "satellite",
  "📻": "radio",
  "🛰": "satellite-dish",
  "📊": "bar-chart-3",
  "🎯": "target",
  "🧭": "compass",
  "💪": "dumbbell",

  // --- documents and communication
  "📄": "file-text",
  "📞": "phone",
  "✉": "mail",
  "✉️": "mail",
  "📍": "map-pin",
  "📅": "calendar-days",
  "🕒": "clock",
  "⏰": "clock",
  "💬": "message-circle",
  "📦": "package",
  "💼": "briefcase",
  "💰": "hand-coins",
  "🗣": "message-circle",

  // --- tools, industry and work
  "🔧": "wrench",
  "🔨": "hammer",
  "🛠": "wrench",
  "🛠️": "wrench",
  "⚙": "cog",
  "⚙️": "cog",
  "⚡": "zap",
  "🔋": "battery-charging",
  "🚚": "truck",
  "🚗": "car",
  "🚤": "ship",
  "🚢": "ship-wheel",
  "⛏": "pickaxe",
  "🛢": "flame",
  "🍳": "cooking-pot",
  "☀": "sun",
  "🌱": "sprout",
  "🌿": "leaf",
  "💧": "droplets",
  "🌊": "waves",
  "🌏": "globe-2",
  "🌍": "globe",
  "🏝": "map",
  "⚓": "anchor",
  "🚀": "rocket",
  "🎨": "palette",
  "🛡": "shield",
  "🚨": "siren",

  // --- symbols that were being drawn as emoji
  "✓": "check",
  "✔": "check",
  "✕": "x",
  "☰": "menu",
  "🗺": "map",
  "⌕": "search",
};
