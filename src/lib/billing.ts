import "server-only";
import { z } from "zod";

export const billingPlanSchema = z.enum(["pro", "business"]);
export type BillingPlan = z.infer<typeof billingPlanSchema>;

function positiveMoney(value: string | undefined, fallback: number) {
  const amount = Number(value ?? fallback);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid billing price configuration.");
  return Math.round(amount * 100) / 100;
}

export function getBillingPlan(plan: BillingPlan) {
  const catalog = {
    pro: {
      name: "Linqo Pro",
      description: "Advanced customization, analytics and creator commerce.",
      amount: positiveMoney(process.env.LINQO_PRO_PRICE_ETB, 499),
      currency: "ETB" as const,
    },
    business: {
      name: "Linqo Business",
      description: "Business profile, team architecture and premium controls.",
      amount: positiveMoney(process.env.LINQO_BUSINESS_PRICE_ETB, 1499),
      currency: "ETB" as const,
    },
  };
  return catalog[plan];
}
