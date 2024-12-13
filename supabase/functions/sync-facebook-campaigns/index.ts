import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface FacebookCampaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  lifetime_budget: number;
  daily_budget: number;
  start_time: string;
  stop_time?: string;
  insights?: {
    spend: string;
    impressions: string;
    clicks: string;
    conversions: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { account_id, access_token } = await req.json();

    console.log(`Syncing campaigns for account ${account_id}`);

    // Fetch campaigns from Facebook API
    const campaignsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account_id}/campaigns?fields=id,name,objective,status,lifetime_budget,daily_budget,start_time,stop_time,insights{spend,impressions,clicks,conversions}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!campaignsResponse.ok) {
      throw new Error(`Facebook API error: ${await campaignsResponse.text()}`);
    }

    const { data: campaigns } = await campaignsResponse.json();
    console.log(`Found ${campaigns.length} campaigns`);

    // Process and store each campaign
    for (const campaign of campaigns) {
      const { data: existingCampaign } = await supabase
        .from('facebook_campaigns')
        .select('id')
        .eq('campaign_id', campaign.id)
        .single();

      const campaignData = {
        account_id,
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        objective: campaign.objective?.toLowerCase(),
        status: campaign.status?.toLowerCase(),
        spend: campaign.insights?.data?.[0]?.spend || 0,
        impressions: parseInt(campaign.insights?.data?.[0]?.impressions || '0'),
        clicks: parseInt(campaign.insights?.data?.[0]?.clicks || '0'),
        conversions: parseInt(campaign.insights?.data?.[0]?.conversions || '0'),
        start_date: campaign.start_time,
        end_date: campaign.stop_time,
        budget_amount: campaign.lifetime_budget || campaign.daily_budget || 0,
        budget_type: campaign.lifetime_budget ? 'lifetime' : 'daily',
        last_sync_at: new Date().toISOString(),
      };

      if (existingCampaign) {
        await supabase
          .from('facebook_campaigns')
          .update(campaignData)
          .eq('campaign_id', campaign.id);
      } else {
        await supabase
          .from('facebook_campaigns')
          .insert(campaignData);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: `Synced ${campaigns.length} campaigns` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error syncing campaigns:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});