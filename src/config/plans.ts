// PLACEHOLDER values — edit here.
export interface Plan {
  name: string;
  priceDzd: number;
  orderLimit: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Starter",
    priceDzd: 0,
    orderLimit: "حتى 50 طلب/شهر",
    features: ["تتبع الطلبات", "تأكيد يدوي", "دعم عبر البريد"],
    highlighted: false,
  },
  {
    name: "Pro",
    priceDzd: 2900,
    orderLimit: "حتى 500 طلب/شهر",
    features: ["كل ميزات Starter", "ربط شركات التوصيل", "إحصائيات الأرباح", "فريق التأكيد"],
    highlighted: true,
  },
  {
    name: "Business",
    priceDzd: 6900,
    orderLimit: "طلبات غير محدودة",
    features: ["كل ميزات Pro", "API وWebhooks", "صلاحيات متقدمة", "دعم أولوية"],
    highlighted: false,
  },
];