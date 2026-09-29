import {
  Anchor, Award, BarChart3, BatteryCharging, Book, BookOpen, Briefcase,
  Building2, CalendarDays, Car, Check, ClipboardList, Clock, Coins, Cog,
  Compass, CookingPot, Cross, Crosshair, Droplets, Dumbbell, Factory,
  FileText, Flame, FlaskConical, FolderOpen, Fuel, Globe, Globe2,
  GraduationCap, Hammer, HandCoins, HandHeart, Handshake, HardHat, Hash,
  Home, Hospital, Landmark, Laptop, Leaf, Library, LifeBuoy, Mail, Map,
  MapPin, Menu, MessageCircle, Package, Palette, PencilLine, Phone, Pickaxe,
  Radar, Radio, Rocket, Route, Satellite, SatelliteDish, School, ScrollText,
  Search, Shield, Ship, ShipWheel, Signal, Siren, Smartphone, Sprout, Star,
  Sun, SunMedium, Target, TreePine, TrendingUp, Truck, Users, UsersRound,
  Wallet, Waves, Wrench, X, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EMOJI_MAP } from "./emojiMap";

/**
 * The icon set, keyed by the name content uses.
 *
 * Names are stored values now, so this is also the vocabulary an admin picker
 * would offer: it should stay small, unambiguous, and cover what the pages
 * actually need rather than every icon the library ships.
 */
export const ICONS = {
  anchor: Anchor,
  award: Award,
  "bar-chart-3": BarChart3,
  "battery-charging": BatteryCharging,
  book: Book,
  "book-open": BookOpen,
  briefcase: Briefcase,
  building: Building2,
  calendar: CalendarDays,
  "calendar-days": CalendarDays,
  car: Car,
  check: Check,
  "clipboard-list": ClipboardList,
  clock: Clock,
  coins: Coins,
  cog: Cog,
  compass: Compass,
  "cooking-pot": CookingPot,
  cross: Cross,
  crosshair: Crosshair,
  droplets: Droplets,
  dumbbell: Dumbbell,
  factory: Factory,
  "file-text": FileText,
  flame: Flame,
  "flask-conical": FlaskConical,
  "folder-open": FolderOpen,
  fuel: Fuel,
  globe: Globe,
  "globe-2": Globe2,
  "graduation-cap": GraduationCap,
  hammer: Hammer,
  "hand-coins": HandCoins,
  "hand-heart": HandHeart,
  handshake: Handshake,
  "hard-hat": HardHat,
  hash: Hash,
  home: Home,
  hospital: Hospital,
  landmark: Landmark,
  laptop: Laptop,
  leaf: Leaf,
  library: Library,
  "life-buoy": LifeBuoy,
  mail: Mail,
  map: Map,
  "map-pin": MapPin,
  menu: Menu,
  "message-circle": MessageCircle,
  package: Package,
  palette: Palette,
  "pencil-line": PencilLine,
  phone: Phone,
  pickaxe: Pickaxe,
  radar: Radar,
  radio: Radio,
  rocket: Rocket,
  route: Route,
  satellite: Satellite,
  "satellite-dish": SatelliteDish,
  school: School,
  "scroll-text": ScrollText,
  search: Search,
  shield: Shield,
  ship: Ship,
  "ship-wheel": ShipWheel,
  signal: Signal,
  siren: Siren,
  smartphone: Smartphone,
  sprout: Sprout,
  star: Star,
  sun: Sun,
  "sun-medium": SunMedium,
  target: Target,
  "tree-pine": TreePine,
  "trending-up": TrendingUp,
  truck: Truck,
  users: Users,
  "users-round": UsersRound,
  wallet: Wallet,
  waves: Waves,
  wrench: Wrench,
  x: X,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

/** The name of an icon in the shared set. */
export type IconName = keyof typeof ICONS;

export function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && value in ICONS;
}

/**
 * Resolves whatever a content row holds - an icon name, or one of the emoji the
 * site has always stored - to an icon name.
 *
 * Returning undefined rather than a default is deliberate: the caller decides
 * what an unrecognised value looks like, because a missing icon on a hero tile
 * should be an obvious gap rather than a silently wrong glyph.
 */
/** Strips the modifiers that vary how a sequence is drawn, not what it is. */
function bare(value: string) {
  return value.replace(/[\uFE0E\uFE0F\u200D\u20E3]/g, "");
}

export function resolveIcon(value: unknown): IconName | undefined {
  if (isIconName(value)) return value;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const original = value.trim();

  // Exact match on the whole value, with the drawing modifiers removed so that
  // ✉ and ✉️ are the same lookup.
  const whole = bare(original);
  if (isIconName(EMOJI_MAP[whole])) return EMOJI_MAP[whole];

  // Then a substring search for a value carrying the emoji alongside something
  // else - a stray space, a pasted label. This runs against the ORIGINAL string,
  // not the stripped one, and longest key first: 👨‍🏫 is a man joined to a
  // school by a zero-width joiner, so a stripped search would find the bare 🏫
  // inside it and draw a school where a teacher was meant.
  const keys = Object.keys(EMOJI_MAP).sort((a, b) => b.length - a.length);
  for (const emoji of keys) {
    if (original.includes(emoji) && isIconName(EMOJI_MAP[emoji])) return EMOJI_MAP[emoji];
  }
  return undefined;
}
