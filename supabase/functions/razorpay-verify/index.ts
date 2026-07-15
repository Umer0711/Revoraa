// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      planInterval,
      couponId,
      finalPrice
    } = await req.json();

    // 1. Verify Razorpay Signature
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!secret) throw new Error('RAZORPAY_KEY_SECRET missing');

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', secret)
                              .update(body.toString())
                              .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid signature');
    }

    // 2. We use Service Role to update secure tables
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    
    // Idempotency check: see if payment was already processed
    const { data: existingPayment } = await supabaseAdmin
      .from('billing_history')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingPayment) {
      return new Response(JSON.stringify({ success: true, message: 'Payment already processed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get the Plan ID

    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('*')
      .eq('interval', planInterval)
      .single();

    if (!plan) throw new Error('Plan not found');

    const role = planInterval === 'year' ? 'pro_yearly' : 'pro_monthly';
    const durationDays = planInterval === 'year' ? 365 : 30;
    
    const startedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // 3. Upsert Subscription
    // Check if user already has a subscription row
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let subscriptionId = existingSub?.id;
    
    if (subscriptionId) {
      await supabaseAdmin.from('subscriptions').update({
        plan_id: plan.id,
        status: 'active',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        renewal_date: expiresAt.toISOString(),
        razorpay_payment_id,
        razorpay_order_id,
        updated_at: new Date().toISOString()
      }).eq('id', subscriptionId);
    } else {
      const { data: newSub } = await supabaseAdmin.from('subscriptions').insert({
        user_id: user.id,
        plan_id: plan.id,
        status: 'active',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        renewal_date: expiresAt.toISOString(),
        razorpay_payment_id,
        razorpay_order_id
      }).select().single();
      subscriptionId = newSub.id;
    }

    // 4. Create Billing History
    await supabaseAdmin.from('billing_history').insert({
      user_id: user.id,
      subscription_id: subscriptionId,
      razorpay_payment_id,
      razorpay_order_id,
      amount: finalPrice,
      status: 'success',
      coupon_id: couponId
    });

    // 5. Create Subscription Event
    await supabaseAdmin.from('subscription_events').insert({
      user_id: user.id,
      subscription_id: subscriptionId,
      event_type: existingSub ? 'renewed' : 'started',
      metadata: { planInterval, finalPrice }
    });

    
    // 6. Update Profile Role and Sub Status
    await supabaseAdmin.from('profiles').update({ 
      role,
      subscription_status: 'active',
      subscription_renewal_date: expiresAt.toISOString()
    }).eq('auth_id', user.id);


    // 7. Update Coupon Usage if applied
    if (couponId) {
      await supabaseAdmin.rpc('increment_coupon_usage', { p_coupon_id: couponId });
    }

    return new Response(JSON.stringify({ success: true, role, expiresAt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
