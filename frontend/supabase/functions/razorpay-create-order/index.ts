// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized: ' + (userError ? userError.message : 'No user'));

    const body = await req.json();
    const { planId, interval, couponCode } = body;

    // 1. Base Prices
    let isYearly = interval === 'year' || (planId && planId.toLowerCase().includes('year'));
    let basePrice = isYearly ? 1499 : 149;
    let finalPrice = basePrice;
    let discountAmount = 0;

    // 2. Coupon Validation
    let validCouponId = null;
    if (couponCode) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();
        
      if (!couponError && coupon) {
        // Simple expiry & usage checks
        const isValid = (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) && 
                        (!coupon.max_uses || coupon.used_count < coupon.max_uses);
                        
        if (isValid) {
          validCouponId = coupon.id;
          if (coupon.discount_amount) {
            discountAmount = coupon.discount_amount;
          } else if (coupon.discount_percentage) {
            discountAmount = basePrice * (coupon.discount_percentage / 100);
          }
          finalPrice = Math.max(0, basePrice - discountAmount);
        }
      }
    }

    // 3. Razorpay Integration
    const key_id = (Deno.env.get('RAZORPAY_KEY_ID') || '').trim();
    const key_secret = (Deno.env.get('RAZORPAY_KEY_SECRET') || '').trim();
    
    if (!key_id || !key_secret) {
      console.error('Razorpay keys missing from environment.');
      throw new Error('Missing Razorpay keys in Edge Function env');
    }

    console.log(`Loaded Key ID: ${key_id} (Length: ${key_id.length})`);
    console.log(`Loaded Key Secret Length: ${key_secret.length}`);

    const auth = btoa(`${key_id}:${key_secret}`);

    const receiptString = `rev_${Date.now()}`;
    if (receiptString.length > 40) throw new Error('Receipt generation failed: Length exceeds 40 characters');
    console.log(`Generated receipt: ${receiptString} (Length: ${receiptString.length})`);

    const options = {
      amount: Math.round(finalPrice * 100),  // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: receiptString,
      notes: {
        userId: user.id,
        planInterval: interval || '',
        couponId: validCouponId || ''
      }
    };

    if (options.amount < 100) {
      throw new Error(`Amount must be at least 100 paise (1 INR). Received: ${options.amount}`);
    }

    console.log("Sending Request to Razorpay:", JSON.stringify({ amount: options.amount, currency: options.currency, receipt: options.receipt, notes: options.notes }));

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    });

    if (!rzpResponse.ok) {
      const errText = await rzpResponse.text();
      console.error(`Razorpay API Error - Status: ${rzpResponse.status}, Response: ${errText}`);
      
      let errorMsg = 'Unknown Razorpay Error';
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) {
          errorMsg = `${parsed.error.code}: ${parsed.error.description}`;
        }
      } catch (e) {
        errorMsg = errText;
      }
      
      throw new Error(`Razorpay API Error: ${errorMsg}`);
    }

    const order = await rzpResponse.json();
    console.log("Razorpay Order Created Successfully:", order.id);

    return new Response(
      JSON.stringify({ order, finalPrice, discountAmount, couponId: validCouponId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || error.toString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
