import { Json } from "@/integrations/supabase/types";

export interface GoogleAdsPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export interface GoogleAdsCampaign {
  id: string;
  account_id: string;
  campaign_id: string;
  campaign_name: string;
  campaign_type: string;
  status: string | null;
  budget_amount: number | null;
  budget_type: string | null;
  start_date: string | null;
  end_date: string | null;
  targeting_settings: Json | null;
  performance_metrics: Json | null;
  audience_insights: Json | null;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}