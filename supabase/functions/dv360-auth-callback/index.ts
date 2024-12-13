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
    const error = url.searchParams.get('error');

    if (error) {
      throw new Error(`Authentication error: ${error}`);
    }

    if (!code || !state) {
      throw new Error('Missing required parameters');
    }

    const decodedState = JSON.parse(atob(state));
    const { userId, redirectUrl } = decodedState;

    if (!userId || !redirectUrl) {
      throw new Error('Invalid state parameter');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/dv360-auth-callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain access tokens');
    }

    // Get DV360 advertiser information
    const advertiserResponse = await fetch(
      'https://displayvideo.googleapis.com/v2/advertisers',
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      }
    );

    const advertisers = await advertiserResponse.json();
    const advertiser = advertisers.advertisers?.[0];

    if (!advertiser) {
      throw new Error('No DV360 advertisers found for this account');
    }

    // Store the account information in the database
    const { error: dbError } = await supabase
      .from('dv360_accounts')
      .insert({
        user_id: userId,
        advertiser_id: advertiser.advertiserId,
        advertiser_name: advertiser.displayName,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        status: 'active',
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Redirect back to the application
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    });
  } catch (error) {
    console.error('DV360 auth callback error:', error);
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