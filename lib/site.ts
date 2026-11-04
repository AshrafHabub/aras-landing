export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.aras-gmbh.de").replace(/\/$/, "");
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

export const company = {
  name: "Aras GmbH",
  // Rechtsdaten stammen von der alten Seite: vor dem Livegang mit den Daten der Aras GmbH abgleichen.
  legalName: "Kaufmann Dortmund Groß und Einzelhandel GmbH",
  trade: "Groß- und Einzelhandel",
  tagline: "Groß- und Einzelhandel in Dortmund",
  description:
    "Die Aras GmbH ist ein Groß- und Einzelhandel aus Dortmund für Süßigkeiten und Getränke aus aller Welt, ansässig am Eisenhüttenweg 9A.",
  intro: "Wir handeln mit Süßigkeiten und Getränken aus aller Welt.",
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
  mapsUrl:
    "https://www.google.com/maps/place/Aras+GmbH+Gro%C3%9Fhandel+%26+Einzelhandel/@51.5371036,7.4714343,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9177381bd8ec7:0x3d0e7708d0b6cbf!8m2!3d51.5371036!4d7.4714343!16s%2Fg%2F11h15wvpf7",
  mapsCid: "https://maps.google.com/?cid=274974047858289855",
  geo: { lat: 51.5371036, lng: 7.4714343 },
} as const;

export type Partner = {
  id: string;
  name: string;
  summary: string;
  url?: string;
  domain?: string;
  logo: { src: string; width: number; height: number };
};

export const partners: Partner[] = [
  {
    id: "kaufmann",
    name: "Kaufmann GmbH",
    summary: "Cash & Carry in Dortmund",
    logo: { src: "/assets/logos/kaufmann.png", width: 900, height: 749 },
  },
  {
    id: "dekaufmann",
    name: "DeKaufmann.de",
    summary: "Online-Shop für Süßigkeiten und Getränke",
    url: "https://dekaufmann.de",
    domain: "dekaufmann.de",
    logo: { src: "/assets/logos/dekaufmann.png", width: 193, height: 54 },
  },
  {
    id: "desquishy",
    name: "DeSquishy.de",
    summary: "Online-Shop für Squishys",
    url: "https://desquishy.de",
    domain: "desquishy.de",
    logo: { src: "/assets/logos/desquishy.png", width: 138, height: 31 },
  },
];
