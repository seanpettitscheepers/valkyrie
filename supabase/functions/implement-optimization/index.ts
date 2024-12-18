import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { recommendationId } = await req.json()

    // Fetch the recommendation
    const { data: recommendation, error: recError } = await supabaseClient
      .from('optimization_recommendations')
      .select('*')
      .eq('id', recommendationId)
      .single()

    if (recError) throw recError

    // Update recommendation status
    const { error: updateError } = await supabaseClient
      .from('optimization_recommendations')
      .update({
        status: 'implemented',
        implemented_at: new Date().toISOString(),
      })
      .eq('id', recommendationId)

    if (updateError) throw updateError

    // Here you would typically implement platform-specific logic
    // to apply the optimization to the actual ad platform
    // This would vary based on the platform (Facebook, Google, etc.)
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})