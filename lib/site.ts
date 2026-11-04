export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.aras-gmbh.de").replace(/\/$/, "");
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

export const company = {
  name: "Aras GmbH",
  legalName: "Kaufmann Dortmund Groß und Einzelhandel GmbH",
  tagline: "Süßigkeiten und Getränke aus aller Welt",
  description:
    "Die Aras GmbH ist ein Großhandel aus Dortmund für Süßigkeiten und Getränke aus aller Welt. Dazu gehören der Cash & Carry Kaufmann GmbH am Eisenhüttenweg 9A, der Online-Shop DeKaufmann.de und DeSquishy.de für Squishys.",
  intro:
    "Wir sind ein Großhandel aus Dortmund für Süßigkeiten und Getränke aus aller Welt. Abholen im Cash & Carry Kaufmann GmbH, online bestellen bei DeKaufmann.de, Squishys bei DeSquishy.de.",
  street: "Eisenhüttenweg 9A",
  zip: "44145",
  city: "Dortmund",
  region: "Nordrhein-Westfalen",
  country: "DE",
  phone: "+49 176 43477834",
  phoneHref: "tel:+4917643477834",
  email: "online@dekaufmann.de",
  vatId: "DE452984801",
  register: "Amtsgericht Dortmund, HRB 34954",
  manager: "Hebun Deniz",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Eisenh%C3%BCttenweg+9A,+44145+Dortmund",
} as const;

// Werbeaussagen: Zahlen vor dem Livegang prüfen (UWG, irreführende Werbung).
export const highlights = [
  { value: "10", suffix: "+", label: "Jahre Erfahrung im Großhandel" },
  { value: "1.000", suffix: "+", label: "Süßigkeiten und Getränke im Sortiment" },
  { value: "30", suffix: "+", label: "Länder, aus denen unsere Ware kommt" },
  { value: "Sofort", suffix: "", label: "Abholen und direkt mitnehmen" },
];

export type Brand = {
  id: string;
  index: string;
  name: string;
  category: string;
  summary: string;
  points: string[];
  url: string;
  cta: string;
  logo: { src: string; width: number; height: number };
  tone: "light" | "dark";
};

export const brands: Brand[] = [
  {
    id: "kaufmann",
    index: "01",
    name: "Kaufmann GmbH",
    category: "Cash & Carry",
    summary: "Süßigkeiten und Getränke aus aller Welt. Bei uns in Dortmund aussuchen, kaufen und direkt mitnehmen.",
    points: ["Süßes und Drinks aus aller Welt", "Eisenhüttenweg 9A, Dortmund", "Sofort mitnehmen"],
    url: company.mapsUrl,
    cta: "Route planen",
    logo: { src: "/assets/logos/kaufmann.png", width: 900, height: 749 },
    tone: "light",
  },
  {
    id: "dekaufmann",
    index: "02",
    name: "DeKaufmann.de",
    category: "Online-Shop",
    summary: "Dieselben Süßigkeiten und Getränke online bestellen. Wir liefern, du sparst dir den Weg.",
    points: ["Das ganze Kaufmann-Sortiment", "Bestellen rund um die Uhr", "Lieferung zu dir"],
    url: "https://dekaufmann.de",
    cta: "Zum Shop",
    logo: { src: "/assets/logos/dekaufmann.png", width: 193, height: 54 },
    tone: "dark",
  },
  {
    id: "desquishy",
    index: "03",
    name: "DeSquishy.de",
    category: "Online-Shop",
    summary: "Squishys in vielen Formen und Farben. Online bestellen, wir schicken sie zu dir.",
    points: ["Squishys und Trends", "Viele Formen und Farben", "Lieferung nach Hause"],
    url: "https://desquishy.de",
    cta: "Zum Shop",
    logo: { src: "/assets/logos/desquishy.png", width: 138, height: 31 },
    tone: "light",
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Was verkauft ihr?",
    a: "Süßigkeiten und Getränke aus aller Welt. Du kaufst sie bei uns im Cash & Carry in Dortmund oder bestellst sie online bei DeKaufmann.de.",
  },
  {
    q: "Was ist die Aras GmbH?",
    a: "Wir sind die Aras GmbH, ein Großhandel aus Dortmund. Zu uns gehören drei Marken: der Cash & Carry Kaufmann GmbH, der Online-Shop DeKaufmann.de und DeSquishy.de für Squishys.",
  },
  {
    q: "Wo kann ich in Dortmund Süßigkeiten und Getränke aus aller Welt kaufen?",
    a: "Bei uns im Cash & Carry der Kaufmann GmbH am Eisenhüttenweg 9A, 44145 Dortmund. Aussuchen, kaufen und direkt mitnehmen.",
  },
  {
    q: "Kann ich auch online bestellen?",
    a: "Ja. Bei DeKaufmann.de bestellst du Süßigkeiten und Getränke aus unserem Sortiment und bekommst sie geliefert.",
  },
  {
    q: "Wo kann ich Squishys kaufen?",
    a: "Im Online-Shop DeSquishy.de. Dort findest du Squishys in vielen Formen und Farben mit Lieferung nach Hause.",
  },
  {
    q: "Wie erreiche ich euch?",
    a: `Per Telefon unter ${company.phone} oder per E-Mail an ${company.email}.`,
  },
];
