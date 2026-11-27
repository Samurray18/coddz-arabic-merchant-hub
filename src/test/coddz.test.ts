import { describe, expect, it } from "vitest";
import {
  normalizeAlgerianPhone,
  isValidAlgerianPhone,
  formatDA,
  buildWhatsAppLink,
  wilayaLabel,
} from "@/lib/coddz";
import { TRANSLATIONS } from "@/lib/i18n";

describe("Algerian phone validation", () => {
  it("accepts local 05/06/07 numbers", () => {
    expect(normalizeAlgerianPhone("0551234567")).toBe("0551234567");
    expect(isValidAlgerianPhone("0662345678")).toBe(true);
  });

  it("normalizes international formats", () => {
    expect(normalizeAlgerianPhone("+213551234567")).toBe("0551234567");
    expect(normalizeAlgerianPhone("00213662345678")).toBe("0662345678");
  });

  it("rejects invalid numbers", () => {
    expect(normalizeAlgerianPhone("12345")).toBeNull();
    expect(isValidAlgerianPhone("0999999999")).toBe(false);
  });
});

describe("formatDA", () => {
  it("formats with thousands separators", () => {
    expect(formatDA(5000)).toBe("5\u202F000\u202Fدج");
    expect(formatDA(482500)).toBe("482\u202F500\u202Fدج");
    expect(formatDA(0)).toBe("0\u202Fدج");
    expect(formatDA(-1234)).toBe("-1\u202F234\u202Fدج");
    expect(formatDA(NaN)).toBe("0\u202Fدج");
  });
  it("uses DA in French and English", () => {
    expect(formatDA(5000, "fr")).toBe("5\u202F000\u202FDA");
    expect(formatDA(5000, "en")).toBe("5\u202F000\u202FDA");
  });
});

describe("wilayaLabel", () => {
  it("matches Latin, code, and Arabic", () => {
    expect(wilayaLabel("Alger", "ar")).toBe("الجزائر");
    expect(wilayaLabel("16", "ar")).toBe("الجزائر");
    expect(wilayaLabel("الجزائر", "ar")).toBe("الجزائر");
    expect(wilayaLabel("Bejaia", "fr")).toBe("Béjaïa");
    expect(wilayaLabel("unknown", "ar")).toBe("unknown");
  });
});

describe("buildWhatsAppLink", () => {
  it("builds wa.me link", () => {
    const link = buildWhatsAppLink("0551234567", "Hello");
    expect(link).toContain("wa.me/213551234567");
    expect(link).toContain("text=Hello");
  });
});

describe("i18n bundles", () => {
  it("has ar/fr/en with same keys", () => {
    const arKeys = Object.keys(TRANSLATIONS.ar);
    expect(Object.keys(TRANSLATIONS.fr)).toEqual(arKeys);
    expect(Object.keys(TRANSLATIONS.en)).toEqual(arKeys);
  });
});