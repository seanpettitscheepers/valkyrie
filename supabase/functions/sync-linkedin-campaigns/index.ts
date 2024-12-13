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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('linkedin_ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) throw accountError;

    // Fetch campaigns from LinkedIn API
    const campaignsResponse = await fetch(
      'https://api.linkedin.com/v2/adCampaignV2s?q=search&search=(account:(values:List(urn%3Ali%3AsponsoredAccount%3A' + account.account_id + ')))',
      {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'LinkedIn-Version': '202304',
        },
      }
    );

    const campaignsData = await campaignsResponse.json();

    // Process and store campaign data
    for (const campaign of campaignsData.elements || []) {
      const { error: upsertError } = await supabaseClient
        .from('linkedin_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          objective: campaign.objective,
          status: campaign.status,
          daily_budget: campaign.dailyBudget?.amount?.value,
          total_budget: campaign.totalBudget?.amount?.value,
          performance_metrics: {
            impressions: campaign.metrics?.impressions || 0,
            clicks: campaign.metrics?.clicks || 0,
            ctr: campaign.metrics?.ctr || 0,
            spend: campaign.metrics?.spend || 0,
          },
          last_sync_at: new Date().toISOString(),
        }, {
          onConflict: 'account_id,campaign_id',
        });

      if (upsertError) {
        console.error('Error upserting campaign:', upsertError);
      }
    }

    // Update account last sync time
    await supabaseClient
      .from('linkedin_ad_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error syncing LinkedIn campaigns:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});