import localFont from "next/font/local";

export const archivo = localFont({
  src: "../assets/fonts/Archivo-Variable.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  preload: true,
});
