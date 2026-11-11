// WCAG 2.x relative luminance and contrast ratio. Pure TypeScript (shared with Expo later).
// Used by the design-token tests (T3.2): every declared text/background pair must pass.

const HEX = /^#?([0-9a-f]{6})$/i;

function channel(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const m = HEX.exec(hex.trim());
  if (!m || !m[1]) throw new Error(`Couleur hexadécimale invalide : ${hex}`);
  const v = m[1];
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(v.slice(i, i + 2), 16) / 255)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

/** AA thresholds: 4.5:1 for text, 3:1 for large text and for non-text UI boundaries. */
export function meetsAA(ratio: number, kind: "text" | "large-text" | "non-text" = "text"): boolean {
  return ratio >= (kind === "text" ? 4.5 : 3);
}
