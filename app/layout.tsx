import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * The root layout.
 *
 * This replaces index.html. Everything that was a <meta> tag or a <link> in the
 * Vite shell is declared here instead, which is what lets Next render real
 * <head> content per route rather than one static document.
 *
 * The per-page social tags that were absent from index.html (each article's own
 * og:title, for instance) can now be added per page by exporting `metadata`
 * from that page - a capability the SPA shell did not have.
 */

const SITE_NAME = "Milne Bay Province Division of Education";
const DESCRIPTION =
  "Official website of the Milne Bay Province Division of Education, Papua New Guinea. " +
  "News, notices, examination timetables, selection lists, programmes and downloads for " +
  "schools, teachers and parents.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: SITE_NAME,
    // A page that sets its own title gets "Page | Milne Bay Province..." rather
    // than replacing the site name outright.
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,

  icons: {
    // The specific PNGs first, .ico as the legacy fallback - same order as the
    // <link> tags in the old index.html.
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_PG",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} crest with the words ${SITE_NAME}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: `Official website of the ${SITE_NAME}, Papua New Guinea.`,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2545",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
