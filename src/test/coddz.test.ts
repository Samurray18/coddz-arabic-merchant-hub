import { describe, expect, it } from "vitest";
import {
  normalizeAlgerianPhone,
  isValidAlgerianPhone,
  formatDA,
  buildWhatsAppLink,
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
    expect(formatDA(4500)).toBe("4 500 DA");
    expect(formatDA(0)).toBe("0 DA");
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