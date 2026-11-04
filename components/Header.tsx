import { BASE_PATH, asset } from "@/lib/asset";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ home = false }: { home?: boolean }) {
  const base = home ? "" : `${BASE_PATH}/`;

  return (
    <header className="header" data-header>
      <div className="header__bar">
        <a className="wordmark" href={`${base}#top`} aria-label="Aras GmbH, zum Seitenanfang">
          <img
            className="wordmark__logo wordmark__logo--ink"
            src={asset("/assets/logos/aras.png")}
            alt=""
            width={331}
            height={246}
          />
          <img
            className="wordmark__logo wordmark__logo--ondark"
            src={asset("/assets/logos/aras-ondark.png")}
            alt=""
            width={331}
            height={246}
          />
        </a>
        <nav className="header__nav" aria-label="Hauptnavigation">
          <a href={`${base}#marken`}>Marken</a>
          <a href={`${base}#standort`}>Standort</a>
          <a href={`${base}#fragen`}>Fragen</a>
        </nav>
        <div className="header__actions">
          {home ? <ThemeToggle /> : null}
          <a className="btn btn--ink btn--sm" href={`${base}#marken`}>
            <span className="btn__label">Shops</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
