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
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-analytics-auth-callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get GA4 properties
    const propertiesResponse = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const properties = await propertiesResponse.json();
    const firstProperty = properties.accountSummaries?.[0]?.propertySummaries?.[0];

    if (!firstProperty) {
      throw new Error('No GA4 properties found');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the integration
    const { error: insertError } = await supabaseClient
      .from('analytics_integrations')
      .insert({
        user_id: userId,
        platform_type: 'google_analytics_4',
        property_id: firstProperty.property,
        credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
        },
        is_active: true,
      });

    if (insertError) {
      throw insertError;
    }

    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error in GA4 auth callback:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to complete authentication' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});