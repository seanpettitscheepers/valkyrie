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
    const { code, state } = await req.json();
    const { userId, redirectUrl } = JSON.parse(atob(state));

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-ads-auth-callback`,
        grant_type: 'authorization_code',
      }),
    });

    const { access_token, refresh_token, expires_in } = await tokenResponse.json();

    // Get customer account information
    const customerResponse = await fetch(
      'https://googleads.googleapis.com/v12/customers:listAccessibleCustomers',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'developer-token': Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN'),
        },
      }
    );

    const { resourceNames } = await customerResponse.json();
    const customerId = resourceNames[0].split('/')[1];

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the account information
    const { error } = await supabase.from('google_ads_accounts').insert({
      user_id: userId,
      customer_id: customerId,
      access_token,
      refresh_token,
      token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
      status: 'active',
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, redirectUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-ads-auth-callback:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});