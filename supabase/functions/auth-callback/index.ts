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
    const platform = url.searchParams.get('platform');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state || !platform) {
      throw new Error('Missing required parameters');
    }

    const { userId, redirectUrl } = JSON.parse(atob(state));
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    let tokenData;
    let accountsData;

    switch (platform) {
      case 'amazon-dsp':
        tokenData = await exchangeAmazonDSPCode(code);
        accountsData = await fetchAmazonDSPAccounts(tokenData.access_token);
        await storeAmazonDSPAccounts(supabaseClient, userId, accountsData, tokenData);
        break;

      case 'pinterest':
        tokenData = await exchangePinterestCode(code);
        accountsData = await fetchPinterestAccounts(tokenData.access_token);
        await storePinterestAccounts(supabaseClient, userId, accountsData, tokenData);
        break;

      // Add cases for other platforms as needed
      default:
        throw new Error(`Unsupported platform: ${platform}`);
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
    console.error('Error in auth callback:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});

async function exchangeAmazonDSPCode(code: string) {
  const response = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: Deno.env.get('AMAZON_DSP_CLIENT_ID') || '',
      client_secret: Deno.env.get('AMAZON_DSP_CLIENT_SECRET') || '',
      redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/auth-callback?platform=amazon-dsp`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${await response.text()}`);
  }

  return response.json();
}

async function fetchAmazonDSPAccounts(accessToken: string) {
  const response = await fetch('https://advertising-api.amazon.com/v2/accounts', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${await response.text()}`);
  }

  return response.json();
}

async function storeAmazonDSPAccounts(supabaseClient: any, userId: string, accounts: any[], tokenData: any) {
  for (const account of accounts) {
    const { error } = await supabaseClient
      .from('amazon_dsp_accounts')
      .upsert({
        user_id: userId,
        account_id: account.id,
        account_name: account.name,
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
}

// Similar functions for Pinterest and other platforms...