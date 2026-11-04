import Link from "next/link";
import { company } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span>
        © {year} {company.name}
      </span>
      <nav className="footer__nav" aria-label="Rechtliches">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </nav>
    </footer>
  );
}
