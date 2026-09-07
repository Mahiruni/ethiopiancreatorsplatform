export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type LinkType = "standard" | "social" | "whatsapp" | "telegram" | "phone" | "email" | "location" | "payment" | "product" | "heading" | "divider" | "image" | "video" | "embed";
export type UserRole = "user" | "moderator" | "administrator" | "super_administrator";
export type Plan = "free" | "pro" | "business";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  category: string | null;
  locale: "en" | "am";
  is_public: boolean;
  is_verified: boolean;
  theme_id: string | null;
  appearance: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LinkItem {
  id: string;
  profile_id: string;
  type: LinkType;
  title: string;
  url: string | null;
  icon: string | null;
  thumbnail_url: string | null;
  position: number;
  is_enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  metadata: Record<string, unknown>;
}
