import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state) {
      throw new Error('Missing code or state parameter');
    }

    // Parse state to get user ID and redirect URL
    const { userId, redirectUrl } = JSON.parse(atob(state));

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${Deno.env.get('FACEBOOK_CLIENT_ID')}` +
      `&redirect_uri=${encodeURIComponent(Deno.env.get('FACEBOOK_REDIRECT_URI') || '')}` +
      `&client_secret=${Deno.env.get('FACEBOOK_CLIENT_SECRET')}` +
      `&code=${code}`
    );

    const tokenData: FacebookTokenResponse = await tokenResponse.json();

    // Get user's ad accounts
    const adAccountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=name,account_id&access_token=${tokenData.access_token}`
    );

    const adAccountsData = await adAccountsResponse.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store each ad account in the database
    for (const account of adAccountsData.data) {
      await supabaseClient
        .from('facebook_ad_accounts')
        .upsert({
          user_id: userId,
          account_id: account.account_id,
          account_name: account.name,
          access_token: tokenData.access_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          status: 'active',
          permissions: ['ads_management', 'ads_read'],
        }, {
          onConflict: 'user_id,account_id'
        });
    }

    // Redirect back to the application
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${redirectUrl}?success=true`
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});