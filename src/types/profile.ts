import { Json } from "@/integrations/supabase/types";

export interface Profile {
  id: string;
  business_name: string | null;
  phone_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  subscription_tier: "free" | "starter" | "growth" | "enterprise" | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  role: "user" | "admin" | "super_admin";
  email: string | null;
}

export type ProfileUpdate = Partial<Profile>;