import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/asset";
import { NOINDEX, SITE_URL, company } from "@/lib/site";
import { archivo } from "./fonts";
import "./globals.css";

const title = `${company.name} | ${company.tagline}`;
const description =
  "Aras GmbH, Groß- und Einzelhandel für Süßigkeiten und Getränke aus aller Welt. Eisenhüttenweg 9A, 44145 Dortmund.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${company.name}` },
  description,
  applicationName: company.name,
  keywords: [
    "Aras GmbH",
    "Aras GmbH Dortmund",
    "Großhandel Dortmund",
    "Einzelhandel Dortmund",
    "Süßigkeiten Großhandel Dortmund",
    "Getränke Großhandel Dortmund",
    "Süßigkeiten aus aller Welt",
    "Eisenhüttenweg 9A",
  ],
  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.name,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      },
  other: {
    "geo.region": "DE-NW",
    "geo.placename": company.city,
    "geo.position": `${company.geo.lat};${company.geo.lng}`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f2ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={archivo.variable}>
      <head>
        <link rel="alternate" type="text/plain" href={asset("/llms.txt")} title="LLM-Zusammenfassung" />
      </head>
      <body>{children}</body>
    </html>
  );
}
