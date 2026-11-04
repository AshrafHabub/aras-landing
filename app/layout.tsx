import type { Metadata, Viewport } from "next";
import { Boot } from "@/components/Boot";
import { asset } from "@/lib/asset";
import { NOINDEX, SITE_URL, company } from "@/lib/site";
import { archivo, jetbrains } from "./fonts";
import "./globals.css";

const boot = `(function(){
  var root = document.documentElement;
  var theme = "light";
  try {
    var saved = localStorage.getItem("aras-theme");
    if (saved === "dark" || saved === "light") theme = saved;
  } catch (e) {}
  root.setAttribute("data-theme", theme);
  root.classList.add("js");
  window.__arasBoot = 1;
  var style = document.createElement("style");
  style.id = "aras-js-gate";
  style.textContent = ".hero__title .line>span{transform:translateY(105%)}.rise{opacity:0}.reveal{opacity:0}";
  document.head.appendChild(style);
  setTimeout(function () {
    if (!root.classList.contains("app-ready")) {
      root.classList.remove("js");
      var gate = document.getElementById("aras-js-gate");
      if (gate) gate.remove();
      if (document.querySelector("[data-intro]")) window.__arasLate = 1;
    }
  }, 3000);
})();`;

const title = `Süßigkeiten und Getränke aus aller Welt | ${company.name} Dortmund`;
const description =
  "Süßigkeiten und Getränke aus aller Welt: im Cash & Carry Kaufmann GmbH in Dortmund abholen oder online bei DeKaufmann.de bestellen. Squishys bei DeSquishy.de.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${company.name}` },
  description,
  applicationName: company.name,
  keywords: [
    "Süßigkeiten aus aller Welt",
    "Getränke aus aller Welt",
    "internationale Süßigkeiten",
    "Süßigkeiten Großhandel Dortmund",
    "Getränke Großhandel Dortmund",
    "Süßigkeiten online bestellen",
    "Aras GmbH",
    "Kaufmann GmbH",
    "Cash & Carry Dortmund",
    "Großhandel Dortmund",
    "DeKaufmann.de",
    "DeSquishy.de",
    "Squishys kaufen",
    "Eisenhüttenweg 9A",
  ],
  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.legalName,
  category: "shopping",
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
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f2ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      data-theme="light"
      className={`${archivo.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/plain" href={asset("/llms.txt")} title="LLM-Zusammenfassung" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <Boot />
        {children}
      </body>
    </html>
  );
}
