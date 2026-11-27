export type CustomerSegment = "blacklisted" | "risk" | "repeat" | "new";

export function initials(name: string): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "؟";
  return trimmed.charAt(0).toUpperCase();
}

export function customerSegment(c: { orders: number; returned: number; blacklisted: boolean }): CustomerSegment {
  if (c.blacklisted) return "blacklisted";
  if (c.orders >= 2 && c.orders > 0 && c.returned / c.orders >= 0.4) return "risk";
  if (c.orders >= 2) return "repeat";
  return "new";
}

export function segmentToneClass(seg: CustomerSegment): string {
  switch (seg) {
    case "repeat":
      return "bg-primary text-on-primary";
    case "new":
      return "bg-accent-container text-on-accent-container";
    case "risk":
      return "bg-warning-container text-on-warning-container";
    case "blacklisted":
      return "bg-error-container text-on-error-container";
  }
}

export function segmentLabel(seg: CustomerSegment): string {
  switch (seg) {
    case "repeat":
      return "متكرر";
    case "new":
      return "جديد";
    case "risk":
      return "مرتجعات مرتفعة";
    case "blacklisted":
      return "محظور";
  }
}
