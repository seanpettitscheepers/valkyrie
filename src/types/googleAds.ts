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
  performance_metrics: GoogleAdsPerformanceMetrics | null;
  created_at: string;
  updated_at: string;
}