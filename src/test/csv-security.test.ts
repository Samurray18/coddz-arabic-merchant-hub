import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvCell } from "@/lib/csv";

describe("CSV spreadsheet formula neutralization", () => {
  it("prefixes formula-leading characters (=, +, -, @, tab, CR) with a single quote", () => {
    expect(escapeCsvCell("=CMD|' /C calc'!A0")).toBe(`"'=CMD|' /C calc'!A0"`);
    expect(escapeCsvCell("+1+1")).toBe(`"'+1+1"`);
    expect(escapeCsvCell("-2+3")).toBe(`"'-2+3"`);
    expect(escapeCsvCell("@SUM(A1:A2)")).toBe(`"'@SUM(A1:A2)"`);
    expect(escapeCsvCell("\t=1+1")).toBe(`"'\t=1+1"`);
    expect(escapeCsvCell("\r=1+1")).toBe(`"'\r=1+1"`);
  });

  it("neutralizes formula characters preceded by leading whitespace", () => {
    expect(escapeCsvCell("  =HYPERLINK(\"https://evil.example\")")).toBe(
      `"'  =HYPERLINK(""https://evil.example"")"`,
    );
    expect(escapeCsvCell(" \n+CMD")).toBe(`"' \n+CMD"`);
  });

  it("leaves regular Arabic, Latin, numeric, and empty values intact while escaping quotes", () => {
    expect(escapeCsvCell("أحمد بن علي")).toBe(`"أحمد بن علي"`);
    expect(escapeCsvCell('Smart "Watch"')).toBe(`"Smart ""Watch"""`);
    expect(escapeCsvCell(4500)).toBe(`"4500"`);
    expect(escapeCsvCell(null)).toBe(`""`);
    expect(escapeCsvCell(undefined)).toBe(`""`);
  });

  it("builds multi-row CSV with neutralized cells", () => {
    const csv = buildCsv([
      ["Name", "Tracking"],
      ["=IMPORTXML(\"http://x\")", "+213551234567"],
      ["ساعة ذكية", "YAL-123"],
    ]);
    expect(csv).toBe(
      `"Name","Tracking"\n"'=IMPORTXML(""http://x"")","'+213551234567"\n"ساعة ذكية","YAL-123"`,
    );
  });
});