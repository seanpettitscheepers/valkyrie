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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Syncing campaigns for platform: ${platform}, accountId: ${accountId}`);

    switch (platform) {
      case 'facebook':
        return await syncFacebookCampaigns(supabase, accountId);
      case 'google_ads':
        return await syncGoogleAdsCampaigns(supabase, accountId);
      case 'tiktok':
        return await syncTikTokCampaigns(supabase, accountId);
      case 'twitter':
        return await syncTwitterCampaigns(supabase, accountId);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error('Error syncing campaigns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function syncFacebookCampaigns(supabase, accountId) {
  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('facebook_ad_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError) throw accountError;

  // Fetch campaigns from Facebook API
  const campaignsResponse = await fetch(
    `https://graph.facebook.com/v18.0/${account.account_id}/campaigns`,
    {
      headers: {
        'Authorization': `Bearer ${account.access_token}`,
      },
    }
  );

  const campaignsData = await campaignsResponse.json();

  // Process and store campaigns
  for (const campaign of campaignsData.data || []) {
    await supabase
      .from('facebook_campaigns')
      .upsert({
        account_id: accountId,
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        spend: campaign.spend,
        last_sync_at: new Date().toISOString(),
      });
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncGoogleAdsCampaigns(supabase, accountId) {
  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('google_ads_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError) throw accountError;

  // Fetch campaigns from Google Ads API
  // Implementation similar to Facebook but with Google Ads API specifics
  // For now, just update the sync timestamp
  await supabase
    .from('google_ads_accounts')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', accountId);

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncTikTokCampaigns(supabase, accountId) {
  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('tiktok_ad_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError) throw accountError;

  // Fetch campaigns from TikTok API
  // Implementation similar to Facebook but with TikTok API specifics
  // For now, just update the sync timestamp
  await supabase
    .from('tiktok_ad_accounts')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', accountId);

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncTwitterCampaigns(supabase, accountId) {
  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('twitter_ad_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError) throw accountError;

  // Fetch campaigns from Twitter API
  // Implementation similar to Facebook but with Twitter API specifics
  // For now, just update the sync timestamp
  await supabase
    .from('twitter_ad_accounts')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', accountId);

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}