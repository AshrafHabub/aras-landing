import { ImageResponse } from "next/og";
import { brands, company } from "@/lib/site";

export const alt = `${company.name}: ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f1923",
          color: "#ece8e1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 4 }}>
          <div style={{ width: 18, height: 18, background: "#e3170a" }} />
          {`${company.city.toUpperCase()} · DE`}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>{company.name}</div>
          <div style={{ fontSize: 44, color: "#9aa3ab", marginTop: 16 }}>{company.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 28, borderTop: "2px solid #ffffff22", paddingTop: 28 }}>
          {brands.map((b) => (
            <div key={b.id} style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#e3170a" }}>{b.index}</span>
              {b.name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
