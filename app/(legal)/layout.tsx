import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteEffects } from "@/components/SiteEffects";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="theme-light">
      <SiteEffects />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
