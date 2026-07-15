// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { planId, interval, couponCode } = await req.json();

    // 1. Base Prices
    let basePrice = interval === 'year' ? 1499 : 149;
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
        .single();
        
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
    const instance = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID') || '',
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || '',
    });

    const options = {
      amount: Math.round(finalPrice * 100),  // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${user.id}_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    return new Response(
      JSON.stringify({ order, finalPrice, discountAmount, couponId: validCouponId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
