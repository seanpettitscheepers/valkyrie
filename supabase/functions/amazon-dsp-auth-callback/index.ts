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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state) {
      throw new Error('Missing required parameters');
    }

    const { userId, redirectUrl } = JSON.parse(atob(state));

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: Deno.env.get('AMAZON_CLIENT_ID') ?? '',
        client_secret: Deno.env.get('AMAZON_CLIENT_SECRET') ?? '',
        redirect_uri: Deno.env.get('AMAZON_REDIRECT_URI') ?? '',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code: ${JSON.stringify(tokenData)}`);
    }

    // Get account info
    const accountResponse = await fetch('https://advertising-api.amazon.com/v2/accounts', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Amazon-Advertising-API-ClientId': Deno.env.get('AMAZON_CLIENT_ID') ?? '',
      },
    });

    const accountData = await accountResponse.json();

    if (!accountResponse.ok) {
      throw new Error(`Failed to fetch account info: ${JSON.stringify(accountData)}`);
    }

    // Store account data in Supabase
    const { error: insertError } = await supabaseClient
      .from('amazon_dsp_accounts')
      .insert({
        user_id: userId,
        account_id: accountData[0].accountId,
        account_name: accountData[0].accountName,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        status: 'active',
      });

    if (insertError) throw insertError;

    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error in auth callback:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});