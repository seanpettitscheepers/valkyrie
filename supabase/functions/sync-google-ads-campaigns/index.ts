import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { accountId } = await req.json();
    console.log('Syncing Google Ads data for account:', accountId);

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('google_ads_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    // Refresh token if needed
    if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
      console.log('Token expired, refreshing...');
      // Implement token refresh logic here
      // Update account with new tokens
    }

    // Fetch campaigns from Google Ads API
    const campaignsResponse = await fetch(
      `https://googleads.googleapis.com/v12/customers/${account.customer_id}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'developer-token': account.developer_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            SELECT 
              campaign.id,
              campaign.name,
              campaign.status,
              campaign.advertising_channel_type,
              campaign.start_date,
              campaign.end_date,
              campaign.bidding_strategy_type,
              metrics.impressions,
              metrics.clicks,
              metrics.conversions,
              metrics.cost_micros
            FROM campaign
            WHERE segments.date DURING LAST_30_DAYS
          `
        }),
      }
    );

    if (!campaignsResponse.ok) {
      throw new Error('Failed to fetch campaigns from Google Ads');
    }

    const campaigns = await campaignsResponse.json();
    console.log('Fetched campaigns:', campaigns);

    // Update campaigns in database
    for (const campaign of campaigns.results || []) {
      const { error: upsertError } = await supabaseClient
        .from('google_ads_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.campaign.id,
          campaign_name: campaign.campaign.name,
          campaign_type: campaign.campaign.advertisingChannelType,
          status: campaign.campaign.status,
          start_date: campaign.campaign.startDate,
          end_date: campaign.campaign.endDate,
          performance_metrics: {
            impressions: campaign.metrics.impressions,
            clicks: campaign.metrics.clicks,
            conversions: campaign.metrics.conversions,
            cost: campaign.metrics.costMicros / 1000000, // Convert micros to actual currency
          },
          last_sync_at: new Date().toISOString(),
        }, {
          onConflict: 'account_id,campaign_id'
        });

      if (upsertError) {
        console.error('Error upserting campaign:', upsertError);
      }
    }

    // Update account last sync time
    await supabaseClient
      .from('google_ads_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-google-ads-campaigns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});