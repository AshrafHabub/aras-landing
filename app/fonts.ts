import localFont from "next/font/local";

export const archivo = localFont({
  src: "../assets/fonts/Archivo-Variable.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const jetbrains = localFont({
  src: "../assets/fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});
