import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ShareRequest {
  to: string[];
  pageTitle: string;
  pageUrl: string;
  senderName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, pageTitle, pageUrl, senderName } = await req.json() as ShareRequest;
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Marketing Analytics <share@yourdomain.com>",
        to,
        subject: `Check out this ${pageTitle} dashboard`,
        html: `
          <h2>Hi there!</h2>
          ${senderName ? `<p>${senderName} thought you might be interested in this dashboard.</p>` : ''}
          <p>You can view the ${pageTitle} dashboard here:</p>
          <p><a href="${pageUrl}">${pageUrl}</a></p>
          <p>Best regards,<br/>Marketing Analytics Team</p>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);