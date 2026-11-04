import Link from "next/link";
import { asset } from "@/lib/asset";
import { brands, company } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="kontakt">
      <div className="footer__grid">
        <div className="footer__brand">
          <span className="footer__mark" aria-hidden="true">
            <img className="wordmark__logo wordmark__logo--ink" src={asset("/assets/logos/aras.png")} alt="" width={331} height={246} />
            <img
              className="wordmark__logo wordmark__logo--ondark"
              src={asset("/assets/logos/aras-ondark.png")}
              alt=""
              width={331}
              height={246}
            />
          </span>
          <p>{company.intro}</p>
        </div>

        <nav className="footer__col" aria-label="Marken">
          <span className="label">Marken</span>
          {brands.map((b) => (
            <a key={b.id} href={b.url} target="_blank" rel="noopener">
              {b.name}
            </a>
          ))}
        </nav>

        <div className="footer__col">
          <span className="label">Kontakt</span>
          <address>
            {company.street}
            <br />
            {company.zip} {company.city}
          </address>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>

        <nav className="footer__col" aria-label="Rechtliches">
          <span className="label">Rechtliches</span>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </nav>
      </div>

      <p className="footer__word" aria-hidden="true">
        Aras<span>.</span>
      </p>

      <div className="footer__legal">
        <span>
          © {year} {company.legalName}
        </span>
        <span className="label">Dortmund · DE</span>
      </div>
    </footer>
  );
}
