import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
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
      'https://api.thetradedesk.com/v3/authentication/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('TTD_CLIENT_ID') || '',
          client_secret: Deno.env.get('TTD_CLIENT_SECRET') || '',
          redirect_uri: Deno.env.get('TTD_REDIRECT_URI') || '',
          code,
        }),
      }
    );

    const tokenData: TokenResponse = await tokenResponse.json();

    // Get account information
    const accountResponse = await fetch(
      'https://api.thetradedesk.com/v3/myaccount',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const accountData = await accountResponse.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store account in database
    await supabaseClient
      .from('ttd_accounts')
      .upsert({
        user_id: userId,
        account_id: accountData.accountId,
        account_name: accountData.accountName,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        status: 'active',
      }, {
        onConflict: 'user_id,account_id'
      });

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