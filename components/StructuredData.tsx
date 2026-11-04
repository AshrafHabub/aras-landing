import { SITE_URL, company } from "@/lib/site";

export function StructuredData() {
  const orgId = `${SITE_URL}/#organization`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "WholesaleStore"],
        "@id": orgId,
        name: company.name,
        legalName: company.legalName,
        description: company.description,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logos/aras.png`,
        image: `${SITE_URL}/assets/logos/aras.png`,
        email: company.email,
        telephone: company.phone,
        vatID: company.vatId,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.street,
          postalCode: company.zip,
          addressLocality: company.city,
          addressRegion: company.region,
          addressCountry: company.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
        hasMap: company.mapsCid,
        sameAs: [company.mapsCid],
        areaServed: "DE",
        knowsAbout: ["Süßigkeiten aus aller Welt", "Getränke aus aller Welt", "Groß- und Einzelhandel"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.name,
        inLanguage: "de-DE",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
