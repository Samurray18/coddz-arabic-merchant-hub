// PLACEHOLDER values — edit here.
export type PlanCopyKey = "starter" | "pro" | "business";

export interface Plan {
  name: string;
  priceDzd: number;
  copyKey: PlanCopyKey;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Starter",
    priceDzd: 0,
    copyKey: "starter",
    highlighted: false,
  },
  {
    name: "Pro",
    priceDzd: 2900,
    copyKey: "pro",
    highlighted: true,
  },
  {
    name: "Business",
    priceDzd: 6900,
    copyKey: "business",
    highlighted: false,
  },
];
