import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Here we would normally use the Google Analytics Data API
    // For now, returning sample data
    const data = [
      { name: "Organic Search", value: 4000, color: "#4F46E5" },
      { name: "Paid Search", value: 3000, color: "#6366F1" },
      { name: "Social Media", value: 2000, color: "#818CF8" },
      { name: "Direct", value: 2780, color: "#A5B4FC" },
      { name: "Email", value: 1890, color: "#C7D2FE" },
      { name: "Referral", value: 2390, color: "#E0E7FF" },
    ];

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});