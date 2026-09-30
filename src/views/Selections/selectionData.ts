/**
 * Shapes, fallback rows and normalisers for the Grade 9 / Grade 11 selection
 * lists. The API returns loosely typed JSON, so every value is coerced here
 * instead of being trusted inside the table components.
 */
export type JsonRecord = Record<string, string | number | boolean | null>;

export type Grade9Row = {
  id?: number | string;
  school: string;
  district: string;
  type: string;
  capacity: number;
  placed: number;
  stream: string;
  cutoff: number;
};

export type Grade11Row = {
  id?: number | string;
  school: string;
  district: string;
  type: string;
  capacity: number;
  placed: number;
  cutoff: number;
};

export const FALLBACK_GRADE9_DATA: Grade9Row[] = [
  {
    school: "Cameron Secondary School",
    district: "Alotau",
    type: "National High",
    capacity: 300,
    placed: 298,
    stream: "Science, Humanities, Business",
    cutoff: 185,
  },

  {
    school: "Alotau Secondary School",
    district: "Alotau",
    type: "Provincial High",
    capacity: 250,
    placed: 248,
    stream: "Science, Humanities, Business, Technical",
    cutoff: 165,
  },

  {
    school: "Bwesiruru Secondary",
    district: "Alotau",
    type: "Provincial High",
    capacity: 180,
    placed: 178,
    stream: "Science, Humanities, Business",
    cutoff: 145,
  },

  {
    school: "Hagita Secondary School",
    district: "Alotau",
    type: "Provincial High",
    capacity: 160,
    placed: 158,
    stream: "Humanities, Business, Technical",
    cutoff: 135,
  },

  {
    school: "Kiriwina Secondary School",
    district: "Kiriwina-Goodenough",
    type: "Provincial High",
    capacity: 120,
    placed: 118,
    stream: "Humanities, Business",
    cutoff: 125,
  },

  {
    school: "Losuia Secondary School",
    district: "Losuia",
    type: "Provincial High",
    capacity: 100,
    placed: 98,
    stream: "Science, Humanities",
    cutoff: 120,
  },

  {
    school: "Esa'ala Secondary School",
    district: "Esa'ala",
    type: "Provincial High",
    capacity: 100,
    placed: 96,
    stream: "Humanities, Business",
    cutoff: 115,
  },

  {
    school: "Rabaruana Secondary",
    district: "Rabaruana",
    type: "Provincial High",
    capacity: 140,
    placed: 138,
    stream: "Science, Humanities",
    cutoff: 130,
  },

  {
    school: "Samarai Secondary School",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 80,
    placed: 78,
    stream: "Humanities, Business",
    cutoff: 110,
  },

  {
    school: "Wanigela Secondary",
    district: "Wanigela",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities",
    cutoff: 105,
  },

  {
    school: "Agaivaro Secondary",
    district: "Agaivaro",
    type: "Provincial High",
    capacity: 90,
    placed: 88,
    stream: "Humanities, Business",
    cutoff: 115,
  },

  {
    school: "Dobu Secondary School",
    district: "Dobu",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities",
    cutoff: 100,
  },

  {
    school: "Duau Secondary School",
    district: "Duau",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities, Business",
    cutoff: 105,
  },

  {
    school: "Guasopa Secondary",
    district: "Guasopa",
    type: "Provincial High",
    capacity: 60,
    placed: 58,
    stream: "Humanities",
    cutoff: 95,
  },

  {
    school: "Huhu Secondary School",
    district: "Huhu",
    type: "Provincial High",
    capacity: 120,
    placed: 118,
    stream: "Science, Humanities",
    cutoff: 125,
  },

  {
    school: "Kokoda Secondary",
    district: "Kokoda",
    type: "Provincial High",
    capacity: 60,
    placed: 56,
    stream: "Humanities",
    cutoff: 90,
  },

  {
    school: "Maramatana Secondary",
    district: "Maramatana",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 85,
  },

  {
    school: "Misi Secondary School",
    district: "Misi",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities, Business",
    cutoff: 100,
  },

  {
    school: "Sibonai Secondary",
    district: "Sibonai",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 85,
  },

  {
    school: "West Ferguson Secondary",
    district: "West Ferguson",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 80,
  },

  {
    school: "St. Charles Lwanga Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    capacity: 150,
    placed: 148,
    stream: "Science, Humanities, Business",
    cutoff: 155,
  },

  {
    school: "Holy Name Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    capacity: 120,
    placed: 118,
    stream: "Humanities, Business",
    cutoff: 140,
  },

  {
    school: "Misima Secondary",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 50,
    placed: 46,
    stream: "Humanities",
    cutoff: 80,
  },

  {
    school: "Rossel Island Secondary",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 40,
    placed: 38,
    stream: "Humanities",
    cutoff: 75,
  },
];

export const FALLBACK_GRADE11_DATA = [
  {
    school: "Cameron Secondary School",
    district: "Alotau",
    type: "National High",
    streams_json: '{"Science":80,"Humanities":60,"Business":40}',
    placed_json: '{"Science":78,"Humanities":58,"Business":38}',
    cutoff_json: '{"Science":220,"Humanities":200,"Business":190}',
  },

  {
    school: "Alotau Secondary School",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Science":60,"Humanities":50,"Business":40,"Technical":30}',
    placed_json: '{"Science":58,"Humanities":48,"Business":38,"Technical":28}',
    cutoff_json: '{"Science":200,"Humanities":185,"Business":175,"Technical":165}',
  },

  {
    school: "Bwesiruru Secondary",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Science":40,"Humanities":40,"Business":30}',
    placed_json: '{"Science":38,"Humanities":38,"Business":28}',
    cutoff_json: '{"Science":185,"Humanities":170,"Business":160}',
  },

  {
    school: "Hagita Secondary School",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Humanities":50,"Business":40,"Technical":30}',
    placed_json: '{"Humanities":48,"Business":38,"Technical":28}',
    cutoff_json: '{"Humanities":165,"Business":155,"Technical":150}',
  },

  {
    school: "St. Charles Lwanga Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    streams_json: '{"Science":50,"Humanities":40,"Business":30}',
    placed_json: '{"Science":48,"Humanities":38,"Business":28}',
    cutoff_json: '{"Science":195,"Humanities":180,"Business":170}',
  },

  {
    school: "Holy Name Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    streams_json: '{"Humanities":40,"Business":30}',
    placed_json: '{"Humanities":38,"Business":28}',
    cutoff_json: '{"Humanities":170,"Business":160}',
  },

  {
    school: "Kiriwina Secondary School",
    district: "Kiriwina-Goodenough",
    type: "Provincial High",
    streams_json: '{"Humanities":30,"Business":20}',
    placed_json: '{"Humanities":28,"Business":18}',
    cutoff_json: '{"Humanities":155,"Business":145}',
  },

  {
    school: "Losuia Secondary School",
    district: "Losuia",
    type: "Provincial High",
    streams_json: '{"Science":25,"Humanities":25}',
    placed_json: '{"Science":23,"Humanities":23}',
    cutoff_json: '{"Science":175,"Humanities":160}',
  },

  {
    school: "Esa'ala Secondary School",
    district: "Esa'ala",
    type: "Provincial High",
    streams_json: '{"Humanities":30,"Business":20}',
    placed_json: '{"Humanities":28,"Business":18}',
    cutoff_json: '{"Humanities":150,"Business":140}',
  },

  {
    school: "Rabaruana Secondary",
    district: "Rabaruana",
    type: "Provincial High",
    streams_json: '{"Science":30,"Humanities":30}',
    placed_json: '{"Science":28,"Humanities":28}',
    cutoff_json: '{"Science":170,"Humanities":155}',
  },

  {
    school: "Samarai Secondary School",
    district: "Samarai-Murua",
    type: "Provincial High",
    streams_json: '{"Humanities":25,"Business":15}',
    placed_json: '{"Humanities":23,"Business":13}',
    cutoff_json: '{"Humanities":145,"Business":135}',
  },

  {
    school: "Huhu Secondary School",
    district: "Huhu",
    type: "Provincial High",
    streams_json: '{"Science":30,"Humanities":30}',
    placed_json: '{"Science":28,"Humanities":28}',
    cutoff_json: '{"Science":165,"Humanities":150}',
  },

  {
    school: "Wanigela Secondary",
    district: "Wanigela",
    type: "Provincial High",
    streams_json: '{"Humanities":20}',
    placed_json: '{"Humanities":18}',
    cutoff_json: '{"Humanities":140}',
  },

  {
    school: "Agaivaro Secondary",
    district: "Agaivaro",
    type: "Provincial High",
    streams_json: '{"Humanities":25,"Business":15}',
    placed_json: '{"Humanities":23,"Business":13}',
    cutoff_json: '{"Humanities":145,"Business":135}',
  },

  {
    school: "Dobu Secondary School",
    district: "Dobu",
    type: "Provincial High",
    streams_json: '{"Humanities":20}',
    placed_json: '{"Humanities":18}',
    cutoff_json: '{"Humanities":130}',
  },

  {
    school: "Duau Secondary School",
    district: "Duau",
    type: "Provincial High",
    streams_json: '{"Humanities":20,"Business":15}',
    placed_json: '{"Humanities":18,"Business":13}',
    cutoff_json: '{"Humanities":135,"Business":125}',
  },
];

export function parseJsonRecord(value: unknown): JsonRecord {
  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

  return Object.fromEntries(
    Object.entries(parsed as Record<string, unknown>).filter(
      ([, item]) => item === null || ["string", "number", "boolean"].includes(typeof item),
    ),
  ) as JsonRecord;
}

export function normalizeJsonFields(row: Record<string, unknown>) {
  const normalized = { ...row };

  Object.keys(row).forEach((key) => {
    if (key.toLowerCase().endsWith("_json")) normalized[key] = parseJsonRecord(row[key]);
  });

  return normalized;
}

export function textValue(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

export function numberValue(value: unknown, fallback = 0) {
  if (value == null || value === "") return fallback;
  const number = typeof value === "number" ? value : Number(value);

  return Number.isFinite(number) ? number : fallback;
}

export function streamValue(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value))
    return Object.keys(value as object).join(", ");

  return textValue(value, "Not provided");
}

export function normalizeGrade9Rows(data: unknown): Grade9Row[] {
  if (!Array.isArray(data)) return [];

  return data.map((value) => {
    const raw =
      value && typeof value === "object"
        ? normalizeJsonFields(value as Record<string, unknown>)
        : {};

    return {
      id: raw.id as number | string | undefined,
      school: textValue(raw.school ?? raw.name, "Unnamed school"),
      district: textValue(raw.district, "Not provided"),
      type: textValue(raw.type, "Provincial High"),
      capacity: numberValue(raw.capacity),
      placed: numberValue(raw.placed),
      stream: streamValue(raw.stream ?? raw.stream_json),
      cutoff: numberValue(raw.cutoff),
    };
  });
}

export function recordTotal(value: unknown): number {
  return Object.values(parseJsonRecord(value)).reduce<number>(
    (total, item) => total + numberValue(item),
    0,
  );
}

export function normalizeGrade11Rows(data: unknown): Grade11Row[] {
  if (!Array.isArray(data)) return [];

  return data.map((value) => {
    const raw =
      value && typeof value === "object"
        ? normalizeJsonFields(value as Record<string, unknown>)
        : {};
    const streams = parseJsonRecord(raw.streams_json ?? raw.streams);
    const placed = parseJsonRecord(raw.placed_json ?? raw.placed);
    const cutoff = parseJsonRecord(raw.cutoff_json ?? raw.cutoff);

    return {
      id: raw.id as number | string | undefined,
      school: textValue(raw.school, "Unnamed school"),
      district: textValue(raw.district, "Not provided"),
      type: textValue(raw.type, "Provincial High"),
      capacity: numberValue(raw.capacity, recordTotal(streams)),
      placed: numberValue(raw.placed, recordTotal(placed)),
      cutoff: numberValue(raw.cutoff, recordTotal(cutoff)),
    };
  });
}
