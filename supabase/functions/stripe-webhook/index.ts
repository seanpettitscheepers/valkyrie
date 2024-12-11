import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Webhook signature missing', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`Processing Stripe event: ${event.type}`);

    // Store the event
    await supabaseAdmin
      .from('webhook_events')
      .insert({
        type: event.type,
        event_id: event.id,
        data: event.data,
      });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const email = customer.email;

        if (!email) {
          throw new Error('No email found for customer');
        }

        // Get user by email
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('No user found for customer');
        }

        // Get subscription plan by price ID
        const { data: plan } = await supabaseAdmin
          .from('subscription_plans')
          .select('tier')
          .eq('price_id', subscription.items.data[0].price.id)
          .single();

        if (!plan) {
          throw new Error('No plan found for price ID');
        }

        // Update user subscription status
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_tier: subscription.status === 'active' ? plan.tier : 'free',
            trial_ends_at: null,
          })
          .eq('id', user.id);

        // Update user_subscriptions table
        await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            plan_id: plan.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const email = customer.email;

        if (!email) {
          throw new Error('No email found for customer');
        }

        // Get user by email
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('No user found for customer');
        }

        // Reset to free tier
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_tier: 'free',
            trial_ends_at: null,
          })
          .eq('id', user.id);

        // Update subscription status
        await supabaseAdmin
          .from('user_subscriptions')
          .update({ 
            status: 'canceled',
            cancel_at_period_end: false,
          })
          .eq('user_id', user.id);

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});