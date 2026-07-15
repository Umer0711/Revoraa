// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "node:crypto";

serve(async (req: Request) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const secret = (Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '').trim();
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

    // Call the internal send-email function
    const sendEmail = async (userId, emailType, payload) => {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            userId,
            type: emailType,
            payload
          })
        });
      } catch (err) {
        console.error('Failed to send webhook email', err);
      }
    };

    const entity = event.payload?.payment?.entity || event.payload?.subscription?.entity || event.payload?.order?.entity;

    switch (event.event) {
      case 'payment.captured':
      case 'order.paid':
        {
          const orderId = entity.order_id || entity.id; // Could be from payment or order
          const paymentId = event.event === 'payment.captured' ? entity.id : null;
          
          if (orderId && entity.notes?.userId && entity.notes?.planInterval) {
            const userId = entity.notes.userId;
            const planInterval = entity.notes.planInterval;
            const couponId = entity.notes.couponId || null;
            const finalPrice = entity.amount ? entity.amount / 100 : 0;

            // Use the atomic RPC to ensure all steps are correctly processed, fallback idempotency
            const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('process_premium_subscription', {
              p_user_id: userId,
              p_payment_id: paymentId || '',
              p_order_id: orderId,
              p_plan_interval: planInterval,
              p_final_price: finalPrice,
              p_coupon_id: couponId
            });

            if (!rpcError && rpcResult?.success) {
              const { data: plan } = await supabaseAdmin.from('plans').select('name').eq('interval', planInterval).single();
              await sendEmail(userId, 'payment_success', {
                plan_name: plan?.name || 'Pro Plan',
                amount: finalPrice.toFixed(2),
                currency: entity.currency || 'INR',
                order_id: orderId
              });
            } else if (rpcError) {
              console.error('Webhook RPC Error:', rpcError);
            }
          }
        }
        break;
        
      case 'payment.failed':
        {
          const orderId = entity.order_id;
          if (orderId) {
            const { data: sub } = await supabaseAdmin
              .from('subscriptions')
              .select('id, user_id')
              .eq('razorpay_order_id', orderId)
              .maybeSingle();
              
            if (sub) {
              await supabaseAdmin.from('billing_history').update({ status: 'failed' }).eq('razorpay_order_id', orderId);
              // Trigger Failed Email
              await sendEmail(sub.user_id, 'payment_failed', {});
            }
          }
        }
        break;

      case 'subscription.charged':
      case 'subscription.activated':
        {
          const subId = event.payload.subscription.entity.id;
          // Find our user via this Razorpay subscription ID
          const { data: sub } = await supabaseAdmin.from('subscriptions').select('id, user_id, plan_id').eq('razorpay_subscription_id', subId).single();
          if (sub) {
            await supabaseAdmin.from('subscriptions').update({ status: 'active' }).eq('id', sub.id);
            // Send receipt...
          }
        }
        break;

      case 'subscription.cancelled':
      case 'subscription.halted':
        {
          const subId = event.payload.subscription.entity.id;
          const { data: sub } = await supabaseAdmin.from('subscriptions').select('id, user_id, expires_at').eq('razorpay_subscription_id', subId).single();
          
          if (sub) {
            await supabaseAdmin.from('subscriptions').update({ status: 'cancelled' }).eq('id', sub.id);
            await sendEmail(sub.user_id, 'subscription_cancelled', {
              end_date: sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'the end of your billing cycle'
            });
          }
        }
        break;
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
