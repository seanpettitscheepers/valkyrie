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

    if (!accountId) {
      throw new Error('Account ID is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the DV360 account
    const { data: account, error: accountError } = await supabase
      .from('dv360_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    // Fetch campaigns from DV360 API
    const campaignsResponse = await fetch(
      `https://displayvideo.googleapis.com/v2/advertisers/${account.advertiser_id}/campaigns`,
      {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
        },
      }
    );

    const campaignsData = await campaignsResponse.json();

    if (!campaignsData.campaigns) {
      throw new Error('Failed to fetch campaigns');
    }

    // Process each campaign
    for (const campaign of campaignsData.campaigns) {
      // Fetch campaign metrics
      const metricsResponse = await fetch(
        `https://displayvideo.googleapis.com/v2/advertisers/${account.advertiser_id}/campaigns/${campaign.campaignId}/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${account.access_token}`,
          },
        }
      );

      const metrics = await metricsResponse.json();

      // Upsert campaign data
      const { error: upsertError } = await supabase
        .from('dv360_campaigns')
        .upsert({
          account_id: accountId,
          campaign_id: campaign.campaignId,
          campaign_name: campaign.displayName,
          campaign_goal: campaign.campaignGoal,
          status: campaign.entityStatus,
          budget_amount: campaign.budget?.budgetAmountMicros ? 
            Number(campaign.budget.budgetAmountMicros) / 1000000 : null,
          budget_type: campaign.budget?.budgetUnit,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          performance_metrics: metrics,
          last_sync_at: new Date().toISOString(),
        }, {
          onConflict: 'account_id,campaign_id',
        });

      if (upsertError) {
        console.error('Error upserting campaign:', upsertError);
      }
    }

    // Update account last sync time
    await supabase
      .from('dv360_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('DV360 sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});