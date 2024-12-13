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
      .from('pinterest_ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    // Fetch campaigns from Pinterest API
    const campaignsResponse = await fetch(
      `https://api.pinterest.com/v5/ad_accounts/${account.account_id}/campaigns`,
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
    for (const campaign of campaignsData.items) {
      // Fetch campaign metrics
      const metricsResponse = await fetch(
        `https://api.pinterest.com/v5/ad_accounts/${account.account_id}/campaigns/analytics`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${account.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaign_ids: [campaign.id],
            columns: ['SPEND', 'IMPRESSION', 'CLICK', 'CTR', 'CONVERSION'],
            granularity: 'TOTAL',
          }),
        }
      );

      const metricsData = await metricsResponse.json();

      // Store campaign data
      const { error: upsertError } = await supabaseClient
        .from('pinterest_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective_type: campaign.objective_type,
          status: campaign.status,
          daily_spend_cap: campaign.daily_spend_cap,
          lifetime_spend_cap: campaign.lifetime_spend_cap,
          performance_metrics: metricsData.summary || {},
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
      .from('pinterest_ad_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error syncing Pinterest campaigns:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});