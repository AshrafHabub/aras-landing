import Link from "next/link";
import { Footer } from "@/components/Footer";
import { asset } from "@/lib/asset";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="page page--legal">
        <Link className="legal__home" href="/" aria-label="Aras GmbH, zur Startseite">
          <img src={asset("/assets/logos/aras.png")} alt="" width={331} height={246} />
        </Link>
        {children}
      </main>
      <Footer />
    </>
  );
}
