import { Footer } from "@/components/Footer";
import { SquishyBadge } from "@/components/SquishyBadge";
import { StructuredData } from "@/components/StructuredData";
import { asset } from "@/lib/asset";
import { company, partners } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <StructuredData />

      <main className="page">
        <article className="card" aria-labelledby="title">
          <div className="card__head">
            <img
              className="card__logo"
              src={asset("/assets/logos/aras.png")}
              alt="Aras GmbH, Groß- und Einzelhandel"
              width={331}
              height={246}
            />
            <div>
              <h1 className="card__title" id="title">
                {company.tagline}
              </h1>
              <p className="card__intro">{company.intro}</p>
            </div>
          </div>

          <dl className="card__contact">
            <div>
              <dt>Adresse</dt>
              <dd>
                <address>
                  {company.street}
                  <br />
                  {company.zip} {company.city}
                </address>
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={company.phoneHref}>{company.phone}</a>
              </dd>
            </div>
            <div>
              <dt>E-Mail</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
          </dl>

          <div className="card__actions">
            <a className="btn btn--primary" href={company.phoneHref}>
              Anrufen
            </a>
            <a className="btn" href={`mailto:${company.email}`}>
              E-Mail schreiben
            </a>
            <a className="btn" href={company.mapsUrl} target="_blank" rel="noopener">
              Route planen
            </a>
          </div>
        </article>

        <section className="partners" aria-labelledby="partners-title">
          <h2 className="partners__title" id="partners-title">
            Unsere Partner
          </h2>
          <ul className="partners__list">
            {partners.map((p) => {
              const body = (
                <>
                  <img
                    className={`partners__logo partners__logo--${p.id}`}
                    src={asset(p.logo.src)}
                    alt={p.name}
                    width={p.logo.width}
                    height={p.logo.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="partners__text">{p.summary}</span>
                  {p.domain ? <span className="partners__link">{p.domain}</span> : null}
                  {p.id === "desquishy" ? <SquishyBadge /> : null}
                </>
              );
              return (
                <li key={p.id}>
                  {p.url ? (
                    <a className="partners__item" href={p.url} target="_blank" rel="noopener">
                      {body}
                    </a>
                  ) : (
                    <div className="partners__item">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
