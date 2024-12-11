export interface CampaignMetric {
  id: string;
  campaign_id: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  engagements: number;
  video_views: number;
  conversions: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  campaign_metrics?: CampaignMetric[];
}