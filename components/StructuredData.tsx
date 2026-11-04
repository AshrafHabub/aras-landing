import { SITE_URL, brands, company, faqs } from "@/lib/site";

const address = {
  "@type": "PostalAddress",
  streetAddress: company.street,
  postalCode: company.zip,
  addressLocality: company.city,
  addressRegion: company.region,
  addressCountry: company.country,
};

const assortment = ["Süßigkeiten aus aller Welt", "Getränke aus aller Welt", "Internationale Süßwaren"];

export function StructuredData() {
  const orgId = `${SITE_URL}/#organization`;
  const [kaufmann, dekaufmann, desquishy] = brands;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.name,
        legalName: company.legalName,
        description: company.description,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logos/aras.png`,
        email: company.email,
        telephone: company.phone,
        vatID: company.vatId,
        address,
        sameAs: [company.mapsCid],
        areaServed: "DE",
        knowsAbout: assortment,
        brand: brands.map((b) => ({ "@type": "Brand", name: b.name, url: b.url })),
        subOrganization: [
          { "@id": `${SITE_URL}/#kaufmann` },
          { "@id": `${SITE_URL}/#dekaufmann` },
          { "@id": `${SITE_URL}/#desquishy` },
        ],
      },
      {
        "@type": "WholesaleStore",
        "@id": `${SITE_URL}/#kaufmann`,
        name: kaufmann.name,
        description: kaufmann.summary,
        url: `${SITE_URL}/#kaufmann`,
        image: `${SITE_URL}${kaufmann.logo.src}`,
        telephone: company.phone,
        email: company.email,
        address,
        hasMap: company.mapsCid,
        sameAs: [company.mapsCid, company.mapsUrl],
        geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
        knowsAbout: assortment,
        parentOrganization: { "@id": orgId },
      },
      {
        "@type": "OnlineStore",
        "@id": `${SITE_URL}/#dekaufmann`,
        name: dekaufmann.name,
        description: dekaufmann.summary,
        url: dekaufmann.url,
        knowsAbout: assortment,
        parentOrganization: { "@id": orgId },
      },
      {
        "@type": "OnlineStore",
        "@id": `${SITE_URL}/#desquishy`,
        name: desquishy.name,
        description: desquishy.summary,
        url: desquishy.url,
        parentOrganization: { "@id": orgId },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.name,
        inLanguage: "de-DE",
        publisher: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: "de-DE",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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
