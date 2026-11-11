import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA, relativeLuminance } from "./contrast";

describe("contraste WCAG", () => {
  it("donne 21:1 entre noir et blanc", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  it("retrouve les valeurs mesurées de la palette Air (docs/BRAND.md)", () => {
    expect(contrastRatio("#15231E", "#E9EEE8")).toBeCloseTo(13.83, 1);
    expect(contrastRatio("#7C8982", "#E9EEE8")).toBeCloseTo(3.1, 1);
    expect(contrastRatio("#F2B33D", "#E9EEE8")).toBeCloseTo(1.58, 1);
  });

  it("applique les seuils AA texte et non-texte", () => {
    expect(meetsAA(contrastRatio("#15231E", "#E9EEE8"))).toBe(true);
    expect(meetsAA(contrastRatio("#7C8982", "#E9EEE8"), "non-text")).toBe(true);
    expect(meetsAA(contrastRatio("#F2B33D", "#E9EEE8"), "non-text")).toBe(false);
  });

  it("est symétrique et refuse une couleur invalide", () => {
    expect(contrastRatio("#E9EEE8", "#15231E")).toBe(contrastRatio("#15231E", "#E9EEE8"));
    expect(() => relativeLuminance("vert")).toThrow();
    expect(relativeLuminance("FFFFFF")).toBeCloseTo(1, 5);
  });
});
