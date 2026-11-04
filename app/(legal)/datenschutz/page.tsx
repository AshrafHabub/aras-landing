import type { Metadata } from "next";
import Link from "next/link";
import { company, partners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzhinweise der ${company.name}.`,
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  const shops = partners.filter((p) => p.url);

  return (
    <article className="legal">
      <h1 className="legal__title">Datenschutz</h1>
      <p className="legal__lede">Welche Daten beim Besuch dieser Website anfallen.</p>

      <section className="legal__block">
        <h2>Verantwortlicher</h2>
        <p>{company.legalName}</p>
        <p>
          {company.street}, {company.zip} {company.city}
        </p>
        <p>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          {" · "}
          <a href={company.phoneHref}>{company.phone}</a>
        </p>
      </section>

      <section className="legal__block">
        <h2>Hosting</h2>
        <p>
          Beim Aufruf der Seite fallen beim Webhoster technisch nötige Verbindungsdaten an, etwa IP-Adresse, Zeitpunkt
          und aufgerufene Adresse. Sie dienen dem Betrieb und der Sicherheit und werden nicht zu Profilen
          zusammengeführt.
        </p>
      </section>

      <section className="legal__block">
        <h2>Cookies und Analyse</h2>
        <p>
          Diese Website setzt keine Cookies, speichert nichts im Browser und nutzt kein Analysewerkzeug. Die Schrift
          Archivo liegt auf demselben Server, es gibt keine Verbindung zu Google Fonts.
        </p>
      </section>

      <section className="legal__block">
        <h2>Externe Seiten</h2>
        <p>
          Links zu{" "}
          {shops.map((p, i) => (
            <span key={p.id}>
              {i > 0 ? " und " : null}
              <a href={p.url} target="_blank" rel="noopener">
                {p.name}
              </a>
            </span>
          ))}{" "}
          sowie zu Google Maps öffnen sich erst, wenn Sie sie anklicken. Für die Verarbeitung dort sind die jeweiligen
          Betreiber verantwortlich.
        </p>
      </section>

      <section className="legal__block">
        <h2>Deine Rechte</h2>
        <p>
          Sie können Auskunft, Berichtigung, Löschung und Einschränkung verlangen und sich bei einer Aufsichtsbehörde
          beschweren. Schreiben Sie uns an <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      </section>

      <Link className="legal__back" href="/">
        ← Zur Startseite
      </Link>
    </article>
  );
}
