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
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('amazon_dsp_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) throw accountError;

    // Fetch campaigns from Amazon DSP API
    const campaignsResponse = await fetch('https://advertising-api.amazon.com/v2/campaigns', {
      headers: {
        'Authorization': `Bearer ${account.access_token}`,
        'Amazon-Advertising-API-ClientId': Deno.env.get('AMAZON_CLIENT_ID') ?? '',
      },
    });

    const campaignsData = await campaignsResponse.json();

    if (!campaignsResponse.ok) {
      throw new Error(`Failed to fetch campaigns: ${JSON.stringify(campaignsData)}`);
    }

    // Process and store campaign data
    for (const campaign of campaignsData) {
      const { error: upsertError } = await supabaseClient
        .from('amazon_dsp_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.campaignId,
          campaign_name: campaign.name,
          objective: campaign.objective?.toLowerCase(),
          status: campaign.status,
          daily_budget: campaign.budget?.amount,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          targeting_settings: campaign.targeting || {},
          performance_metrics: campaign.metrics || {},
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
      .from('amazon_dsp_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing campaigns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});