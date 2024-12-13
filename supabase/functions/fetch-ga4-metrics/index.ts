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
    const { propertyId } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the integration details
    const { data: integration, error: integrationError } = await supabaseClient
      .from('analytics_integrations')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    const { access_token } = integration.credentials;

    // Fetch GA4 metrics
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            { startDate: '30daysAgo', endDate: 'today' },
            { startDate: '60daysAgo', endDate: '31daysAgo' },
          ],
          metrics: [
            { name: 'totalUsers' },
            { name: 'sessions' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
        }),
      }
    );

    const data = await response.json();
    
    // Process the metrics
    const currentPeriod = data.rows[0];
    const previousPeriod = data.rows[1];

    const calculateChange = (current: number, previous: number) => {
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const metrics = {
      totalUsers: currentPeriod.metricValues[0].value,
      sessions: currentPeriod.metricValues[1].value,
      bounceRate: parseFloat(currentPeriod.metricValues[2].value).toFixed(1),
      avgSessionDuration: parseFloat(currentPeriod.metricValues[3].value).toFixed(0),
      userChange: calculateChange(
        parseInt(currentPeriod.metricValues[0].value),
        parseInt(previousPeriod.metricValues[0].value)
      ),
      sessionChange: calculateChange(
        parseInt(currentPeriod.metricValues[1].value),
        parseInt(previousPeriod.metricValues[1].value)
      ),
      bounceRateChange: calculateChange(
        parseFloat(currentPeriod.metricValues[2].value),
        parseFloat(previousPeriod.metricValues[2].value)
      ),
      durationChange: calculateChange(
        parseFloat(currentPeriod.metricValues[3].value),
        parseFloat(previousPeriod.metricValues[3].value)
      ),
    };

    return new Response(
      JSON.stringify(metrics),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching GA4 metrics:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch GA4 metrics' }),
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