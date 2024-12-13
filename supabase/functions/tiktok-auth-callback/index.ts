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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state) {
      throw new Error('Missing code or state parameter');
    }

    const { userId, redirectUrl } = JSON.parse(atob(state));
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://business-api.tiktok.com/open_api/v1.2/oauth2/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: Deno.env.get('TIKTOK_CLIENT_ID'),
        secret: Deno.env.get('TIKTOK_CLIENT_SECRET'),
        auth_code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.data?.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get advertiser info
    const advertiserResponse = await fetch('https://business-api.tiktok.com/open_api/v1.2/oauth2/advertiser/get/', {
      method: 'GET',
      headers: {
        'Access-Token': tokenData.data.access_token,
      },
    });

    const advertiserData = await advertiserResponse.json();
    
    if (!advertiserData.data?.advertiser_ids?.length) {
      throw new Error('No advertiser accounts found');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the account info in the database
    const { error: dbError } = await supabase
      .from('tiktok_ad_accounts')
      .insert({
        user_id: userId,
        advertiser_id: advertiserData.data.advertiser_ids[0],
        advertiser_name: advertiserData.data.advertiser_names?.[0],
        access_token: tokenData.data.access_token,
        refresh_token: tokenData.data.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.data.expires_in * 1000).toISOString(),
        status: 'active',
      });

    if (dbError) {
      throw dbError;
    }

    // Redirect back to the app
    return Response.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in TikTok auth callback:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});