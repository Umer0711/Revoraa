// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for sending responses with proper status codes and structured logging
const sendError = (status: number, message: string, details?: any) => {
  console.error(JSON.stringify({ status, message, details }));
  return new Response(JSON.stringify({ error: message, details }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Free-Only Mode: Disable all payments globally
  return new Response(JSON.stringify({ error: "Payments are temporarily unavailable." }), {
    status: 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });

  try {
    console.log("Processing razorpay-verify request...");

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return sendError(401, 'Missing Authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return sendError(401, 'Unauthorized', userError ? userError.message : 'No user found');
    }

    const body = await req.json();
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      planInterval,
      couponId,
      finalPrice
    } = body;

    // Validate request payload
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return sendError(400, 'Missing required Razorpay fields in payload', { payload: Object.keys(body) });
    }

    // 1. Verify Razorpay Signature
    const secret = (Deno.env.get('RAZORPAY_KEY_SECRET') || '').trim();
    if (!secret) return sendError(500, 'Server configuration error: RAZORPAY_KEY_SECRET missing');

    const expectedSignature = createHmac('sha256', secret)
                              .update(razorpay_order_id + "|" + razorpay_payment_id)
                              .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return sendError(400, 'Invalid signature provided');
    }

    console.log(`Signature validated successfully for order ${razorpay_order_id}`);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Call the Atomic RPC to process everything securely
    const { data: result, error: rpcError } = await supabaseAdmin.rpc('process_premium_subscription', {
      p_user_id: user.id,
      p_payment_id: razorpay_payment_id,
      p_order_id: razorpay_order_id,
      p_plan_interval: planInterval,
      p_final_price: finalPrice || 0,
      p_coupon_id: couponId || null
    });

    if (rpcError) {
      console.error('RPC process_premium_subscription failed:', rpcError);
      return sendError(500, 'Database error during subscription processing', rpcError);
    }

    if (!result.success) {
      if (result.status === 'failed_activation') {
        console.warn(`Payment ${razorpay_payment_id} recorded, but activation failed:`, result.message);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 202, // Accepted, but processing not complete
        });
      }
      return sendError(400, result.error || result.message || 'Payment processing failed');
    }

    console.log(`Payment successfully verified and subscription updated for user ${user.id}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return sendError(500, 'Unexpected server error during verification', error.message || error.toString());
  }
});
