export const TINTS = [
  { id: "gold", name: "Gold", swatch: "#d9a441", hue: null, sat: 1, light: 1 },
  { id: "rosa", name: "Rosa", swatch: "#e98bb0", hue: 0.94, sat: 0.7, light: 1.25 },
  { id: "mint", name: "Mint", swatch: "#5fcf9f", hue: 0.43, sat: 0.7, light: 1.05 },
  { id: "blau", name: "Blau", swatch: "#4f95e3", hue: 0.58, sat: 0.85, light: 1 },
  { id: "lila", name: "Lila", swatch: "#a77be0", hue: 0.76, sat: 0.7, light: 1.05 },
  { id: "silber", name: "Silber", swatch: "#c4c8ce", hue: 0.6, sat: 0.06, light: 1.25 },
] as const;

export type TintId = (typeof TINTS)[number]["id"];
