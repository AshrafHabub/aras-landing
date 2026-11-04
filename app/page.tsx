import type { CSSProperties } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SquishyStage } from "@/components/SquishyStage";
import { StructuredData } from "@/components/StructuredData";
import { asset } from "@/lib/asset";
import { brands, company, faqs, highlights } from "@/lib/site";
import { TINTS } from "@/lib/tints";

const delay = (i: number) => ({ ["--d" as string]: i }) as CSSProperties;

const hintIcons = {
  ["--icon-mouse" as string]: `url("${asset("/assets/mouse-button.svg")}")`,
  ["--icon-tap" as string]: `url("${asset("/assets/logos/tap.png")}")`,
  ["--icon-scroll" as string]: `url("${asset("/assets/logos/scroll.png")}")`,
} as CSSProperties;

function Arrow({ up = false }: { up?: boolean }) {
  return (
    <span className="btn__arrow" aria-hidden="true">
      {up ? "↗" : "→"}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href={asset("/assets/squishy.glb")}
        as="fetch"
        crossOrigin="anonymous"
        type="model/gltf-binary"
      />
      <StructuredData />

      <div className="intro" data-intro aria-hidden="true">
        <div className="intro__word">
          <span>A</span>
          <span>R</span>
          <span>A</span>
          <span>S</span>
        </div>
        <div className="intro__bar" />
      </div>

      <SquishyStage />
      <button type="button" className="reset-badge" data-reset aria-hidden="true" tabIndex={-1}>
        Zurücksetzen
      </button>
      <Header home />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title" style={hintIcons}>
          <div className="hero__grid" aria-hidden="true" />

          <div className="hero__copy">
            <p className="eyebrow rise" style={delay(0)}>
              <span className="eyebrow__mark" aria-hidden="true" />
              {company.name} · Großhandel in Dortmund
            </p>
            <h1 className="display hero__title" id="hero-title">
              <span className="line">
                <span>Süßigkeiten</span>
              </span>
              <span className="line">
                <span>und Getränke</span>
              </span>
              <span className="line">
                <span>
                  aus aller Welt<span className="red">.</span>
                </span>
              </span>
            </h1>
            <p className="hero__lede rise" style={delay(3)}>
              Bei uns in Dortmund abholen oder online bei DeKaufmann.de bestellen. Squishys gibt es bei DeSquishy.de.
            </p>
            <div className="hero__ctas rise" style={delay(4)}>
              <a className="btn btn--red" href="#marken">
                <span className="btn__label">Zu den Marken</span>
                <Arrow />
              </a>
              <a className="btn btn--ghost" href={company.mapsUrl} target="_blank" rel="noopener">
                <span className="btn__label">Route planen</span>
                <Arrow up />
              </a>
            </div>
          </div>

          <div className="hero__stage rise" style={delay(2)}>
            <div className="frame">
              <span className="frame__corner frame__corner--tl" aria-hidden="true" />
              <span className="frame__corner frame__corner--tr" aria-hidden="true" />
              <span className="frame__corner frame__corner--bl" aria-hidden="true" />
              <span className="frame__corner frame__corner--br" aria-hidden="true" />
              <span className="frame__cross" aria-hidden="true" />
              <span className="label frame__tag frame__tag--tl" aria-hidden="true">
                Squishy / 01
              </span>
              <p className="label frame__tag frame__tag--tr hero__counter" aria-live="polite">
                Squish <b data-count>×00</b>
              </p>

              <div className="hero__slot" data-anchor="hero">
                <div className="blob" data-blob />
                <span className="label blob__pct" data-pct>
                  Lädt …
                </span>
              </div>

              <span className="label hero__hint" data-hint>
                <span className="hint__act hint__act--mouse">
                  <span className="hint__mouse" aria-hidden="true" />
                  reindrücken
                </span>
                <span className="hint__act hint__act--mouse">
                  <span className="hint__mouse hint__mouse--right" aria-hidden="true" />
                  drehen
                </span>
                <span className="hint__act hint__act--touch">
                  <span className="hint__touch hint__touch--tap" aria-hidden="true" />
                  reindrücken
                </span>
                <span className="hint__act hint__act--touch">
                  <span className="hint__touch hint__touch--scroll" aria-hidden="true" />
                  drehen
                </span>
              </span>
            </div>

            <fieldset className="tints">
              <legend className="label">Farbe</legend>
              <div className="tints__row">
                {TINTS.map((t) => (
                  <label key={t.id} className="tint" title={t.name}>
                    <input type="radio" name="tint" value={t.id} defaultChecked={t.id === "gold"} />
                    <span className="tint__dot" style={{ ["--c" as string]: t.swatch }} aria-hidden="true" />
                    <span className="sr-only">{t.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="stats" aria-label="Warum bei uns">
          <dl className="stats__grid">
            {highlights.map((h, i) => (
              <div key={h.label} className="stats__cell reveal" style={delay(i)}>
                <dt className="stats__label">{h.label}</dt>
                <dd className="display stats__value">
                  {h.value}
                  {h.suffix ? <span className="red">{h.suffix}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section brands" id="marken" aria-labelledby="brands-title">
          <header className="section-head reveal">
            <p className="kicker">
              <span>01</span> Marken
            </p>
            <h2 className="display" id="brands-title">
              Drei Marken.
              <br />
              Eine Familie<span className="red">.</span>
            </h2>
            <p className="section-head__text">
              Süßigkeiten und Getränke im Lager mitnehmen oder bequem online bestellen. Du suchst dir aus, wie.
            </p>
          </header>

          <div className="deck" data-deck>
            {brands.map((b, i) => {
              const external = b.url.startsWith("http");
              return (
                <article
                  key={b.id}
                  className={`card card--${b.tone}`}
                  id={b.id}
                  style={{ ["--i" as string]: i }}
                  data-card
                  aria-labelledby={`${b.id}-name`}
                >
                  <span className="card__num" aria-hidden="true">
                    {b.index}
                  </span>
                  <div className="card__top">
                    <span className="card__index">
                      {b.index}
                      <span> / 03</span>
                    </span>
                    <span className="label">{b.category}</span>
                  </div>
                  <div className="card__mid">
                    {b.id === "desquishy" ? (
                      <div className="card__slot" data-anchor="squishy" aria-hidden="true" />
                    ) : null}
                    <h3 className="card__name" id={`${b.id}-name`}>
                      <img
                        className={`card__logo card__logo--${b.id}`}
                        src={asset(b.logo.src)}
                        alt={b.name}
                        width={b.logo.width}
                        height={b.logo.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </h3>
                    <p className="card__text">{b.summary}</p>
                  </div>
                  <ul className="card__points">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a
                    className={`btn ${b.tone === "dark" ? "btn--paper" : "btn--ink"} card__cta`}
                    href={b.url}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    aria-label={`${b.cta}: ${b.name}`}
                  >
                    <span className="btn__label">{b.cta}</span>
                    <Arrow up />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section place" id="standort" aria-labelledby="place-title">
          <div className="place__copy reveal">
            <p className="kicker">
              <span>02</span> Standort
            </p>
            <h2 className="display" id="place-title">
              Vor Ort einkaufen.
              <br />
              Direkt mitnehmen<span className="red">.</span>
            </h2>
            <p className="section-head__text">
              Unser Cash &amp; Carry liegt am Eisenhüttenweg in Dortmund. Süßigkeiten und Getränke aus aller Welt
              aussuchen, kaufen und gleich einladen.
            </p>

            <address className="place__address">
              <span className="label">Kaufmann GmbH</span>
              <strong>{company.street}</strong>
              <strong>
                {company.zip} {company.city}
              </strong>
            </address>

            <dl className="place__contact">
              <div>
                <dt className="label">Telefon</dt>
                <dd>
                  <a href={company.phoneHref}>{company.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="label">E-Mail</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </div>
            </dl>

            <div className="hero__ctas">
              <a className="btn btn--ink" href={company.mapsUrl} target="_blank" rel="noopener">
                <span className="btn__label">Route planen</span>
                <Arrow up />
              </a>
              <a className="btn btn--ghost" href={company.phoneHref}>
                <span className="btn__label">Anrufen</span>
                <Arrow />
              </a>
            </div>
          </div>

          <a
            className="map reveal"
            style={delay(1)}
            href={company.mapsUrl}
            target="_blank"
            rel="noopener"
            aria-label={`${company.street}, ${company.zip} ${company.city} in Google Maps öffnen`}
          >
            <span className="map__road map__road--a" aria-hidden="true" />
            <span className="map__road map__road--b" aria-hidden="true" />
            <span className="map__road map__road--c" aria-hidden="true" />
            <span className="map__pin" aria-hidden="true">
              <span />
            </span>
            <span className="label map__tag map__tag--tl" aria-hidden="true">
              Sektor 44145
            </span>
            <span className="label map__tag map__tag--br" aria-hidden="true">
              Dortmund · DE
            </span>
            <span className="map__chip" aria-hidden="true">
              <b>Kaufmann</b> {company.street}
            </span>
          </a>
        </section>

        <section className="section faq" id="fragen" aria-labelledby="faq-title">
          <header className="section-head reveal">
            <p className="kicker">
              <span>03</span> Fragen
            </p>
            <h2 className="display" id="faq-title">
              Kurz erklärt<span className="red">.</span>
            </h2>
          </header>
          <div className="faq__list reveal" style={delay(1)}>
            {faqs.map((f, i) => (
              <details key={f.q} className="faq__item" name="faq" open={i === 0}>
                <summary>
                  <span>{f.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p className="faq__answer">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
