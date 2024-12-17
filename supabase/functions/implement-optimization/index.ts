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
    const { recommendationId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the recommendation details
    const { data: recommendation, error: recError } = await supabaseClient
      .from('optimization_recommendations')
      .select('*')
      .eq('id', recommendationId)
      .single();

    if (recError) throw recError;

    // Update the recommendation status
    const { error: updateError } = await supabaseClient
      .from('optimization_recommendations')
      .update({
        status: 'implemented',
        implemented_at: new Date().toISOString(),
      })
      .eq('id', recommendationId);

    if (updateError) throw updateError;

    // Store the optimization results
    const { error: resultError } = await supabaseClient
      .from('optimization_results')
      .insert({
        recommendation_id: recommendationId,
        metrics_before: recommendation.performance_before,
        metrics_after: recommendation.performance_after,
      });

    if (resultError) throw resultError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error implementing optimization:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});