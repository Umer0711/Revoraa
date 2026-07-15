// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "node:crypto";

serve(async (req: Request) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    if (!signature || !secret) {
      return new Response("Missing signature or secret", { status: 400 });
    }

    const payload = await req.text();
    const expectedSignature = createHmac('sha256', secret)
                              .update(payload)
                              .digest('hex');

    if (expectedSignature !== signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(payload);
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.event) {
      case 'payment.captured':
      case 'payment.authorized':
        // Mostly handled by verify, but we could log it
        break;
      case 'subscription.charged':
      case 'subscription.activated':
        // Auto-renewals happen here
        {
          const subId = event.payload.subscription.entity.id;
          // Find our user via this Razorpay subscription ID
          // (assuming we saved razorpay_subscription_id)
        }
        break;
      case 'subscription.cancelled':
      case 'subscription.halted':
        // Handle cancellation
        break;
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
