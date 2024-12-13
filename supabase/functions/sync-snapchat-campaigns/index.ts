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
    const { accountId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('snapchat_ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    // Fetch campaigns from Snapchat API
    const campaignsResponse = await fetch(
      `https://adsapi.snapchat.com/v1/adaccounts/${account.account_id}/campaigns`,
      {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
        },
      }
    );

    const campaignsData = await campaignsResponse.json();

    if (!campaignsResponse.ok) {
      throw new Error(`Failed to fetch campaigns: ${JSON.stringify(campaignsData)}`);
    }

    // Process and store campaign data
    for (const campaign of campaignsData.campaigns) {
      // Fetch campaign metrics
      const metricsResponse = await fetch(
        `https://adsapi.snapchat.com/v1/adaccounts/${account.account_id}/stats`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${account.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_type: 'campaign',
            ids: [campaign.id],
            granularity: 'TOTAL',
            metrics: ['impressions', 'swipes', 'video_views', 'spend', 'conversions'],
          }),
        }
      );

      const metricsData = await metricsResponse.json();

      // Store campaign data
      const { error: upsertError } = await supabaseClient
        .from('snapchat_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective: campaign.objective,
          status: campaign.status,
          daily_budget_micro: campaign.daily_budget_micro,
          total_budget_micro: campaign.lifetime_budget_micro,
          performance_metrics: metricsData.timeseries_stats[0] || {},
          last_sync_at: new Date().toISOString(),
        }, {
          onConflict: 'campaign_id',
        });

      if (upsertError) {
        console.error('Error storing campaign:', upsertError);
      }
    }

    // Update account last sync time
    await supabaseClient
      .from('snapchat_ad_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error syncing Snapchat campaigns:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});