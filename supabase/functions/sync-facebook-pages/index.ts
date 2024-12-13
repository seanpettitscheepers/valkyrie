import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface PageInsights {
  data: Array<{
    name: string;
    period: string;
    values: Array<{
      value: number;
      end_time: string;
    }>;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { pageId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get page details from database
    const { data: page, error: pageError } = await supabaseClient
      .from('facebook_pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (pageError) throw pageError;
    if (!page) throw new Error('Page not found');

    // Fetch page insights
    const insightsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${page.page_id}/insights?` +
      `metric=page_impressions,page_engaged_users,page_fans,page_fan_adds,page_views_total` +
      `&period=day` +
      `&access_token=${page.access_token}`
    );

    const insights: PageInsights = await insightsResponse.json();

    // Get follower count
    const followersResponse = await fetch(
      `https://graph.facebook.com/v18.0/${page.page_id}?` +
      `fields=followers_count` +
      `&access_token=${page.access_token}`
    );

    const followersData = await followersResponse.json();

    // Update page with new follower count
    await supabaseClient
      .from('facebook_pages')
      .update({
        followers_count: followersData.followers_count,
        last_sync_at: new Date().toISOString(),
      })
      .eq('id', pageId);

    // Store daily insights
    const today = new Date().toISOString().split('T')[0];
    const metricsData = {};
    
    insights.data.forEach(metric => {
      const latestValue = metric.values[0]?.value || 0;
      metricsData[metric.name] = latestValue;
    });

    await supabaseClient
      .from('facebook_page_insights')
      .upsert({
        page_id: pageId,
        date: today,
        metrics: metricsData,
      }, {
        onConflict: 'page_id,date'
      });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error syncing page:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});