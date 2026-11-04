import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Kaufmann Dortmund Groß und Einzelhandel GmbH.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <article className="legal">
      <p className="label">Rechtliches</p>
      <h1 className="display legal__title">Impressum</h1>
      <p className="legal__lede">
        Angaben gemäß § 5 DDG. Diese Seite und die Shops gehören zur Kaufmann Dortmund Groß und Einzelhandel GmbH.
      </p>

      <section className="legal__block">
        <h2>Anbieter</h2>
        <p>Kaufmann Dortmund Groß und Einzelhandel GmbH</p>
        <p>Groß- und Einzelhandel</p>
      </section>

      <section className="legal__block">
        <h2>Anschrift</h2>
        <p>Eisenhüttenweg 9A</p>
        <p>44145 Dortmund</p>
        <p>Deutschland</p>
      </section>

      <section className="legal__block">
        <h2>Kontakt</h2>
        <p>
          Telefon: <a href="tel:+4917643477834">+49 176 43477834</a>
        </p>
        <p>
          E-Mail: <a href="mailto:online@dekaufmann.de">online@dekaufmann.de</a>
        </p>
      </section>

      <section className="legal__block">
        <h2>Registereintrag</h2>
        <p>Registergericht: Amtsgericht Dortmund</p>
        <p>Registernummer: HRB 34954</p>
      </section>

      <section className="legal__block">
        <h2>Umsatzsteuer-ID</h2>
        <p>DE452984801</p>
      </section>

      <section className="legal__block">
        <h2>Vertreten durch</h2>
        <p>Hebun Deniz</p>
      </section>

      <section className="legal__block">
        <h2>Streitbeilegung</h2>
        <p>
          Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder
          verpflichtet noch bereit.
        </p>
      </section>

      <Link className="btn btn--ghost legal__back" href="/">
        <span className="btn__label">Zur Startseite</span> <span className="btn__arrow" aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
