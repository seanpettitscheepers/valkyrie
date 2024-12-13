import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FacebookPage {
  access_token: string;
  category: string;
  name: string;
  id: string;
  tasks: string[];
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
      `&redirect_uri=${encodeURIComponent(Deno.env.get('FACEBOOK_PAGES_REDIRECT_URI') || '')}` +
      `&client_secret=${Deno.env.get('FACEBOOK_CLIENT_SECRET')}` +
      `&code=${code}`
    );

    const tokenData: FacebookTokenResponse = await tokenResponse.json();

    // Get user's Facebook Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?` +
      `fields=name,access_token,category,tasks` +
      `&access_token=${tokenData.access_token}`
    );

    const pagesData = await pagesResponse.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store each page in the database
    for (const page of pagesData.data as FacebookPage[]) {
      if (page.tasks.includes('MANAGE') || page.tasks.includes('CREATE_CONTENT')) {
        await supabaseClient
          .from('facebook_pages')
          .upsert({
            user_id: userId,
            page_id: page.id,
            page_name: page.name,
            access_token: page.access_token,
            category: page.category,
            is_active: true,
          }, {
            onConflict: 'user_id,page_id'
          });
      }
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