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
      .from('twitter_ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) throw accountError;

    // Fetch campaigns from Twitter API
    const campaignsResponse = await fetch(
      'https://api.twitter.com/2/campaigns',
      {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const campaignsData = await campaignsResponse.json();

    if (!campaignsData.data) {
      throw new Error('Failed to fetch campaigns');
    }

    // Process and store each campaign
    for (const campaign of campaignsData.data) {
      const { error: upsertError } = await supabase
        .from('twitter_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective: campaign.objective,
          status: campaign.status,
          daily_budget: campaign.daily_budget_amount_local_micro / 1000000,
          total_budget: campaign.total_budget_amount_local_micro / 1000000,
          start_time: campaign.start_time,
          end_time: campaign.end_time,
          targeting_settings: campaign.targeting_criteria || {},
          performance_metrics: {
            impressions: campaign.metrics?.impressions || 0,
            clicks: campaign.metrics?.clicks || 0,
            engagements: campaign.metrics?.engagements || 0,
            spend: campaign.metrics?.spend_local_micro / 1000000 || 0,
            conversions: campaign.metrics?.conversions || 0,
          },
          last_sync_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;
    }

    // Update account last sync time
    const { error: updateError } = await supabase
      .from('twitter_ad_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing Twitter campaigns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});