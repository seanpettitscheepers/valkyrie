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
      throw new Error('Missing code or state parameter');
    }

    const { userId, redirectUrl } = JSON.parse(atob(state));
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.snapchat.com/login/oauth2/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/snapchat-auth-callback`,
        client_id: Deno.env.get('SNAPCHAT_CLIENT_ID') || '',
        client_secret: Deno.env.get('SNAPCHAT_CLIENT_SECRET') || '',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code: ${JSON.stringify(tokenData)}`);
    }

    // Get advertiser accounts
    const accountsResponse = await fetch('https://adsapi.snapchat.com/v1/me/organizations', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const accountsData = await accountsResponse.json();

    if (!accountsResponse.ok) {
      throw new Error(`Failed to fetch accounts: ${JSON.stringify(accountsData)}`);
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Store account data
    for (const org of accountsData.organizations) {
      const { error } = await supabaseClient
        .from('snapchat_ad_accounts')
        .upsert({
          user_id: userId,
          account_id: org.organization.id,
          account_name: org.organization.name,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          status: 'active',
        }, {
          onConflict: 'account_id',
        });

      if (error) {
        console.error('Error storing account:', error);
      }
    }

    // Redirect back to the app
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    });
  } catch (error) {
    console.error('Error in Snapchat auth callback:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});