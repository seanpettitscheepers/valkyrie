import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accountId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get account details
    const { data: account, error: accountError } = await supabaseClient
      .from('ttd_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) throw accountError;
    if (!account) throw new Error('Account not found');

    // Fetch campaigns from TTD API
    const campaignsResponse = await fetch(
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

    if (!campaignsResponse.ok) {
      throw new Error(`TTD API error: ${await campaignsResponse.text()}`);
    }

    const campaigns = await campaignsResponse.json();

    // Process and store each campaign
    for (const campaign of campaigns.Result) {
      const campaignData = {
        account_id: accountId,
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
        last_sync_at: new Date().toISOString(),
      };

      await supabaseClient
        .from('ttd_campaigns')
        .upsert(campaignData, {
          onConflict: 'account_id,campaign_id'
        });
    }

    // Update account last sync time
    await supabaseClient
      .from('ttd_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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