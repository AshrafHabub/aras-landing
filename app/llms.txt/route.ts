import { SITE_URL, brands, company, faqs } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${company.name}`,
    "",
    `> ${company.description}`,
    "",
    "## Marken",
    "",
    ...brands.map((b) => `- [${b.name}](${b.url}): ${b.category}. ${b.summary}`),
    "",
    "## Standort",
    "",
    `- Adresse: ${company.street}, ${company.zip} ${company.city}, Deutschland`,
    `- Telefon: ${company.phone}`,
    `- E-Mail: ${company.email}`,
    `- Karte: ${company.mapsUrl}`,
    "",
    "## Häufige Fragen",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Unternehmen",
    "",
    `- Rechtsträger: ${company.legalName}`,
    `- Register: ${company.register}`,
    `- USt-IdNr.: ${company.vatId}`,
    `- Geschäftsführung: ${company.manager}`,
    "",
    "## Seiten",
    "",
    `- [Startseite](${SITE_URL}/)`,
    `- [Impressum](${SITE_URL}/impressum)`,
    `- [Datenschutz](${SITE_URL}/datenschutz)`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
