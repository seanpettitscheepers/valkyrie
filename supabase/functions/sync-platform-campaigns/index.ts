import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, accountId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get account details based on platform
    const accountsTable = `${platform}_accounts`;
    const { data: account, error: accountError } = await supabaseClient
      .from(accountsTable)
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error(`Account not found for platform ${platform}`);
    }

    // Fetch campaigns from platform API
    let campaignsData;
    switch (platform) {
      case 'ttd':
        campaignsData = await fetchTTDCampaigns(account);
        break;
      case 'facebook':
        campaignsData = await fetchFacebookCampaigns(account);
        break;
      case 'google_ads':
        campaignsData = await fetchGoogleAdsCampaigns(account);
        break;
      case 'tiktok':
        campaignsData = await fetchTikTokCampaigns(account);
        break;
      case 'twitter':
        campaignsData = await fetchTwitterCampaigns(account);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Store campaign data
    const campaignsTable = `${platform}_campaigns`;
    for (const campaign of campaignsData) {
      await supabaseClient
        .from(campaignsTable)
        .upsert({
          ...campaign,
          account_id: accountId,
          last_sync_at: new Date().toISOString(),
        }, {
          onConflict: 'campaign_id',
        });
    }

    // Update account last sync time
    await supabaseClient
      .from(accountsTable)
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(
      JSON.stringify({ success: true, message: `Successfully synced ${platform} campaigns` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`Error syncing campaigns:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Platform-specific campaign fetching functions
async function fetchTTDCampaigns(account: any) {
  const response = await fetch(
    'https://api.thetradedesk.com/v3/campaign/query',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AdvertiserId: account.account_id,
        PageStartIndex: 0,
        PageSize: 100,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`TTD API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.Result.map((campaign: any) => ({
    campaign_id: campaign.CampaignId,
    campaign_name: campaign.CampaignName,
    objective: campaign.CampaignType?.toLowerCase(),
    status: campaign.Status?.toLowerCase(),
    budget_amount: campaign.Budget?.Amount,
    budget_type: campaign.Budget?.BudgetType,
    start_date: campaign.StartDate,
    end_date: campaign.EndDate,
    targeting_settings: campaign.Targeting || {},
    performance_metrics: campaign.Performance || {},
  }));
}

async function fetchFacebookCampaigns(account: any) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${account.account_id}/campaigns?fields=id,name,objective,status,lifetime_budget,daily_budget,start_time,stop_time,insights{spend,impressions,clicks,conversions}`,
    {
      headers: {
        'Authorization': `Bearer ${account.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Facebook API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.data.map((campaign: any) => ({
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    objective: campaign.objective?.toLowerCase(),
    status: campaign.status?.toLowerCase(),
    budget_amount: campaign.lifetime_budget || campaign.daily_budget,
    budget_type: campaign.lifetime_budget ? 'lifetime' : 'daily',
    start_date: campaign.start_time,
    end_date: campaign.stop_time,
    performance_metrics: campaign.insights?.data?.[0] || {},
  }));
}

async function fetchGoogleAdsCampaigns(account: any) {
  // Implement Google Ads API call
  return [];
}

async function fetchTikTokCampaigns(account: any) {
  // Implement TikTok API call
  return [];
}

async function fetchTwitterCampaigns(account: any) {
  // Implement Twitter API call
  return [];
}