import { describe, it, expect } from "vitest";
import { segmentLabel, type CustomerSegment } from "@/lib/avatar";

describe("segmentLabel", () => {
  const expected: Record<CustomerSegment, Record<"ar" | "fr" | "en", string>> = {
    repeat: { ar: "متكرر", fr: "Régulier", en: "Repeat" },
    new: { ar: "جديد", fr: "Nouveau", en: "New" },
    risk: { ar: "مرتجعات مرتفعة", fr: "Retours élevés", en: "High returns" },
    blacklisted: { ar: "محظور", fr: "Bloqué", en: "Blacklisted" },
  };

  for (const segment of Object.keys(expected) as CustomerSegment[]) {
    it(`translates the ${segment} segment in ar, fr and en`, () => {
      expect(segmentLabel(segment, "ar")).toBe(expected[segment].ar);
      expect(segmentLabel(segment, "fr")).toBe(expected[segment].fr);
      expect(segmentLabel(segment, "en")).toBe(expected[segment].en);
    });
  }
});
