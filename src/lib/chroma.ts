export const bgColor = (hue: number, dLight: number = 0, dChroma: number = 0) =>
  `oklch(${85 + dLight}% ${0.18 + dChroma} ${hue})`;
export const bgBorderColor = (hue: number) => `oklch(90% 0.20 ${hue})`;

export const colors = {
  about: "oklch(75% 0.30 25)",
  creations: "oklch(75% 0.30 95)",
  collaboration: "oklch(75% 0.30 120)",
  contact: "oklch(75% 0.30 180)",
};
