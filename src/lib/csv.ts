const FORMULA_PREFIX = /^[\u0000-\u0020]*[=+\-@\t\r]/;

export function escapeCsvCell(value: unknown): string {
  const raw = String(value ?? "");
  const neutralized = FORMULA_PREFIX.test(raw) ? `'${raw}` : raw;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

export function buildCsv(rows: ReadonlyArray<ReadonlyArray<unknown>>): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

export function downloadCsv(
  filename: string,
  rows: ReadonlyArray<ReadonlyArray<unknown>>,
): void {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}