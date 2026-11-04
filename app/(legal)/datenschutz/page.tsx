import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzhinweise der Website. Verantwortlich ist die Kaufmann Dortmund Groß und Einzelhandel GmbH.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <article className="legal">
      <p className="label">Rechtliches</p>
      <h1 className="display legal__title">Datenschutz</h1>
      <p className="legal__lede">Was diese Website speichert, und wer dafür da ist.</p>

      <section className="legal__block">
        <h2>Verantwortlicher</h2>
        <p>Kaufmann Dortmund Groß und Einzelhandel GmbH</p>
        <p>Eisenhüttenweg 9A, 44145 Dortmund</p>
        <p>
          <a href="mailto:online@dekaufmann.de">online@dekaufmann.de</a>
          {" · "}
          <a href="tel:+4917643477834">+49 176 43477834</a>
        </p>
      </section>

      <section className="legal__block">
        <h2>Hosting</h2>
        <p>
          Die Seiten und das 3D-Modell werden vom eigenen Server ausgeliefert. Dabei fallen technisch nötige
          Verbindungsdaten an, etwa IP-Adresse, Zeitpunkt und aufgerufene Adresse. Sie dienen dem Betrieb und der
          Sicherheit und werden nicht zu Profilen zusammengeführt.
        </p>
      </section>

      <section className="legal__block">
        <h2>Schriften</h2>
        <p>
          Archivo und JetBrains Mono liegen auf diesem Server. Es gibt keine Verbindung zu Google Fonts oder einem
          anderen Schriftdienst.
        </p>
      </section>

      <section className="legal__block">
        <h2>Lokale Speicherung</h2>
        <ul>
          <li>sessionStorage, Schlüssel aras-intro: merkt sich, ob das Intro in dieser Sitzung schon lief.</li>
          <li>localStorage, Schlüssel aras-theme: merkt sich Hell oder Dunkel, wenn du umschaltest.</li>
          <li>localStorage, Schlüssel aras-tint: merkt sich die Farbe, die du für das Squishy gewählt hast.</li>
        </ul>
        <p>Beides bleibt im Browser. Es werden keine Cookies und kein Analysewerk gesetzt.</p>
      </section>

      <section className="legal__block">
        <h2>Externe Seiten</h2>
        <p>
          Links zu{" "}
          <a href="https://dekaufmann.de" target="_blank" rel="noopener">
            DeKaufmann.de
          </a>{" "}
          und{" "}
          <a href="https://desquishy.de" target="_blank" rel="noopener">
            DeSquishy.de
          </a>{" "}
          öffnen die Shops erst, wenn du sie anklickst. Für deren Verarbeitung sind die Betreiber der Shops
          verantwortlich.
        </p>
      </section>

      <section className="legal__block">
        <h2>Deine Rechte</h2>
        <p>
          Du kannst Auskunft, Berichtigung, Löschung und Einschränkung verlangen und dich bei einer Aufsichtsbehörde
          beschweren. Schreib an{" "}
          <a href="mailto:online@dekaufmann.de">online@dekaufmann.de</a>.
        </p>
      </section>

      <Link className="btn btn--ghost legal__back" href="/">
        <span className="btn__label">Zur Startseite</span> <span className="btn__arrow" aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
