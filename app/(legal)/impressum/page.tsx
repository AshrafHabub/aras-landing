import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum der ${company.name}.`,
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  const [court, number] = company.register.split(", ");

  return (
    <article className="legal">
      <h1 className="legal__title">Impressum</h1>
      <p className="legal__lede">Angaben gemäß § 5 DDG</p>

      <section className="legal__block">
        <h2>Anbieter</h2>
        <p>{company.legalName}</p>
        <p>{company.trade}</p>
        <p>
          {company.street}, {company.zip} {company.city}
        </p>
      </section>

      <section className="legal__block">
        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={company.phoneHref}>{company.phone}</a>
        </p>
        <p>
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
      </section>

      <section className="legal__block">
        <h2>Registereintrag</h2>
        <p>Registergericht: {court}</p>
        <p>Registernummer: {number}</p>
      </section>

      <section className="legal__block">
        <h2>Umsatzsteuer-ID</h2>
        <p>{company.vatId}</p>
      </section>

      <section className="legal__block">
        <h2>Vertreten durch</h2>
        <p>{company.manager}</p>
      </section>

      <section className="legal__block">
        <h2>Streitbeilegung</h2>
        <p>
          Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder
          verpflichtet noch bereit.
        </p>
      </section>

      <Link className="legal__back" href="/">
        ← Zur Startseite
      </Link>
    </article>
  );
}
