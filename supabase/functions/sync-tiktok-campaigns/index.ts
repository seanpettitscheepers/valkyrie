import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { accountId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get account details
    const { data: account, error: accountError } = await supabase
      .from('tiktok_ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) throw accountError;

    // Fetch campaigns from TikTok API
    const campaignsResponse = await fetch(
      'https://business-api.tiktok.com/open_api/v1.2/campaign/get/',
      {
        method: 'GET',
        headers: {
          'Access-Token': account.access_token,
          'Content-Type': 'application/json',
        },
      }
    );

    const campaignsData = await campaignsResponse.json();

    if (!campaignsData.data?.list) {
      throw new Error('Failed to fetch campaigns');
    }

    // Process and store each campaign
    for (const campaign of campaignsData.data.list) {
      const { error: upsertError } = await supabase
        .from('tiktok_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.campaign_id,
          campaign_name: campaign.campaign_name,
          objective: campaign.objective_type,
          status: campaign.status,
          budget_amount: campaign.budget,
          budget_type: campaign.budget_mode,
          performance_metrics: {
            impressions: campaign.metrics?.impressions || 0,
            clicks: campaign.metrics?.clicks || 0,
            ctr: campaign.metrics?.ctr || 0,
            spend: campaign.metrics?.spend || 0,
            conversions: campaign.metrics?.conversions || 0,
          },
          last_sync_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;
    }

    // Update account last sync time
    const { error: updateError } = await supabase
      .from('tiktok_ad_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing TikTok campaigns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});