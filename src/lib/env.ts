import { z } from "zod";

const LOCAL_APP_URL = "http://localhost:3000";

function normalizeUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function resolveAppUrl(): string {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_APP_URL) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeUrl(process.env.VERCEL_URL) ??
    LOCAL_APP_URL
  );
}

function normalizeBoolean(value: string | undefined): "true" | "false" {
  const normalized = value?.trim().toLowerCase();

  if (["true", "1", "yes", "on"].includes(normalized ?? "")) return "true";
  return "false";
}

function normalizeOptionalUrl(value: string | undefined): string {
  return normalizeUrl(value) ?? "";
}

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("Linqo"),
  NEXT_PUBLIC_ENABLE_DEMO_DATA: z.enum(["true", "false"]),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().or(z.literal(""))
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: resolveAppUrl(),
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Linqo",
  NEXT_PUBLIC_ENABLE_DEMO_DATA: normalizeBoolean(process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA),
  NEXT_PUBLIC_SUPABASE_URL: normalizeOptionalUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || ""
});

export const hasSupabaseEnv = Boolean(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
