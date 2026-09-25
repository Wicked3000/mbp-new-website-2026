import React from "react";

type Props = {
  className?: string;
  size?: number;
};

const wrap = (p: Props, svg: React.ReactNode) => (
  <span className={p.className ?? "w-5 h-5 shrink-0"} style={{ display: "inline-flex" }}>
    <svg
      width={p.size ?? 18}
      height={p.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {svg}
    </svg>
  </span>
);

export const DashboardIcon = (p: Props) =>
  wrap(
    p,
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>,
  );
export const HeroIcon = (p: Props) =>
  wrap(
    p,
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 15l5-5 4 4 4-6 5 7" />
      <circle cx="8.5" cy="8.5" r="1.6" />
    </>,
  );
export const NewsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M4 4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4Z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </>,
  );
export const NoticeIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M12 3l7 4v6l-7 4-7-4V7l7-4Z" />
      <path d="M12 8v6M12 16v.5" />
    </>,
  );
export const EventsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
      <rect x="7" y="12" width="3" height="3" rx=".5" />
    </>,
  );
export const ProgramsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M12 3L2 8l10 5 10-5-10-5Z" />
      <path d="M6 12l6 3 6-3" />
      <path d="M6 16l6 3 6-3" />
      <path d="M12 13v6" />
    </>,
  );
export const StatsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M3 20V10" />
      <path d="M10 20V4" />
      <path d="M17 20v-7" />
      <path d="M3 20h18" />
    </>,
  );
export const DistrictsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M4 21V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14" />
      <path d="M14 9h4a1 1 0 0 1 1 1v11" />
      <path d="M7 10h2M7 13h2M7 16h2M16 11h2M16 14h2" />
    </>,
  );
export const LeadershipIcon = (p: Props) =>
  wrap(
    p,
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="18" cy="9" r="3" />
      <path d="M15.5 18a5 5 0 0 1 6 0" />
    </>,
  );
export const SelectionsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
      <path d="M8 3v3h8V3" />
    </>,
  );
export const MessagesIcon = (p: Props) =>
  wrap(
    p,
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>,
  );
export const QuickLinksIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1" />
      <path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" />
    </>,
  );
export const PartnersIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M5 19a7 7 0 0 1 14 0" />
      <path d="M19 8a3 3 0 1 0 0 6" />
      <path d="M22 19a4 4 0 0 0-3-3.8" />
    </>,
  );
export const DownloadsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M12 18V11" />
      <path d="M8.5 14.5L12 18l3.5-3.5" />
    </>,
  );
export const WhatsAppIcon = (p: Props) =>
  wrap(
    p,
    <>
      <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-3.8A8 8 0 1 1 20 11.5Z" />
      <path d="M8.5 8.5c.2-.5.5-.5.8-.5h.6c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a6.7 6.7 0 0 0 3.1 2.7c.3.1.5 0 .7-.2l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.6 0 .5-.1 1.1-.5 1.4-.5.4-1.2.6-1.9.5-1.4-.2-3.1-1-4.8-2.7-1.5-1.5-2.4-3-2.7-4.3-.4-.9-.3-1.6.1-2.1Z" />
    </>,
  );
export const SettingsIcon = (p: Props) =>
  wrap(
    p,
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
    </>,
  );
