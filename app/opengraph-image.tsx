import { ImageResponse } from "next/og";
import { company } from "@/lib/site";

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
          padding: 80,
          background: "#f3f2ef",
          color: "#1b1b1d",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{company.name}</div>
          <div style={{ fontSize: 40, color: "#6b6a67", marginTop: 12 }}>{company.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 28, color: "#45443f" }}>
          <span>
            {company.street}, {company.zip} {company.city}
          </span>
          <span>{company.phone}</span>
        </div>
      </div>
    ),
    size,
  );
}
