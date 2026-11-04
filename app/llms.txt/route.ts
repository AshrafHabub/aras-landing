import { SITE_URL, company, partners } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${company.name}`,
    "",
    `> ${company.description}`,
    "",
    "## Kontakt",
    "",
    `- Adresse: ${company.street}, ${company.zip} ${company.city}, Deutschland`,
    `- Telefon: ${company.phone}`,
    `- E-Mail: ${company.email}`,
    `- Koordinaten: ${company.geo.lat}, ${company.geo.lng}`,
    `- Google Maps: ${company.mapsCid}`,
    "",
    "## Partner",
    "",
    "Eigenständige Partnerfirmen, nicht Teil der Aras GmbH:",
    "",
    ...partners.map((p) => (p.url ? `- [${p.name}](${p.url}): ${p.summary}` : `- ${p.name}: ${p.summary}`)),
    "",
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
