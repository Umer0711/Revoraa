// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY   = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SENDER_EMAIL     = Deno.env.get('SENDER_EMAIL') || 'Revoraa <reminders@revoraa.com>';
const RESEND_API_URL   = 'https://api.resend.com/emails';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function logEmail(supabase: any, userId: string, type: string, subject: string, status: string, error?: string) {
  try {
    await supabase.from('email_logs').insert({
      user_id: userId,
      email_type: type,
      subject,
      status,
      error_message: error
    });
  } catch (e) {
    console.error('Failed to log email', e);
  }
}

function buildTemplate(type: string, payload: any): { subject: string, html: string } {
  let subject = '';
  let html = '';

  const style = `font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 2rem; background: #0f0f10; color: #fff; border-radius: 12px;`;
  
  switch(type) {
    case 'welcome_email':
      subject = '🎉 Welcome to Revoraa';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">Welcome ${payload.name} 👋</h2>
          <p style="color: #9ca3af; margin: 0 0 1rem;">Your interview journey starts today.</p>
          <ul style="color: #9ca3af; line-height: 1.6; margin-bottom: 2rem;">
            <li>Track your problems.</li>
            <li>Master patterns.</li>
            <li>Build long-term retention.</li>
          </ul>
          <a href="https://revoraa.com" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Start your first session →</a>
        </div>
      `;
      break;

    case 'daily_reminder':
      subject = '🧠 Your revisions are waiting';
      html = `
        <div style="${style}">
          <p style="color: #9ca3af; margin: 0 0 1rem;">You have</p>
          <h1 style="color: #fff; font-size: 2.5rem; margin: 0 0 1rem;">${payload.revision_count}</h1>
          <p style="color: #9ca3af; margin: 0 0 1rem;">revisions due today.</p>
          <p style="color: #9ca3af; margin: 0 0 2rem;">Estimated Time: <strong>${payload.estimated_time}</strong></p>
          <p style="color: #fff; margin: 0 0 2rem;">Continue your streak.</p>
          <a href="https://revoraa.com" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Open Revoraa</a>
        </div>
      `;
      break;

    case 'streak_warning':
      subject = '🔥 Your streak is about to end';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem; color: #ef4444;">Warning!</h2>
          <p style="color: #9ca3af; margin: 0 0 2rem;">Complete one activity today before midnight to keep your streak alive.</p>
          <a href="https://revoraa.com" style="display: inline-block; padding: 0.75rem 1.5rem; background: #ef4444; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Save My Streak</a>
        </div>
      `;
      break;

    case 'achievement_unlock':
      subject = '🏆 Achievement Unlocked';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">Congratulations! 🎉</h2>
          <p style="color: #9ca3af; margin: 0 0 1rem;">You unlocked:</p>
          <div style="background: #1f2937; padding: 1rem; border-radius: 8px; text-align: center; margin-bottom: 2rem;">
            <h3 style="margin: 0; color: #f59e0b;">${payload.achievement}</h3>
          </div>
          <p style="color: #9ca3af; margin: 0 0 1rem;">Rewards:</p>
          <ul style="color: #fff; list-style: none; padding: 0; margin: 0 0 2rem;">
            <li>✨ ${payload.xp} XP</li>
            <li>🪙 ${payload.coins} Coins</li>
          </ul>
        </div>
      `;
      break;

    case 'weekly_report':
      subject = '📊 Your Weekly Interview Report';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">Weekly Summary</h2>
          <ul style="color: #9ca3af; list-style: none; padding: 0; line-height: 2;">
            <li><strong>Problems Solved:</strong> <span style="color:#fff">${payload.problems_solved}</span></li>
            <li><strong>Revisions Completed:</strong> <span style="color:#fff">${payload.revisions_completed}</span></li>
            <li><strong>Current Streak:</strong> <span style="color:#fff">${payload.current_streak}</span></li>
            <li><strong>Longest Streak:</strong> <span style="color:#fff">${payload.longest_streak}</span></li>
            <li><strong>Most Improved Pattern:</strong> <span style="color:#f59e0b">${payload.most_improved_pattern || 'N/A'}</span></li>
            <li><strong>Weakest Pattern:</strong> <span style="color:#ef4444">${payload.weakest_pattern || 'N/A'}</span></li>
            <li><strong>Interview Readiness:</strong> <span style="color:#10b981">${payload.interview_readiness}%</span></li>
            <li><strong>XP Earned:</strong> <span style="color:#fff">+${payload.xp_earned}</span></li>
            <li><strong>Coins Earned:</strong> <span style="color:#fff">+${payload.coins_earned}</span></li>
          </ul>
        </div>
      `;
      break;

    
    case 'payment_success':
      subject = '🎉 Payment Successful - Welcome to Revoraa Pro!';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">Payment Successful! 🎉</h2>
          <p style="color: #9ca3af; margin: 0 0 1rem;">Thank you for upgrading to Pro. Your subscription is now active.</p>
          <div style="background: #1f2937; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
            <p style="margin: 0 0 0.5rem; color: #fff;"><strong>Plan:</strong> ${payload.plan_name}</p>
            <p style="margin: 0 0 0.5rem; color: #fff;"><strong>Amount:</strong> ${payload.amount} ${payload.currency}</p>
            <p style="margin: 0; color: #fff;"><strong>Order ID:</strong> ${payload.order_id}</p>
          </div>
          <a href="https://revoraa.co.in/dashboard" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard →</a>
        </div>
      `;
      break;

    case 'payment_failed':
      subject = '⚠️ Action Required: Payment Failed';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem; color: #ef4444;">Payment Failed</h2>
          <p style="color: #9ca3af; margin: 0 0 1rem;">We were unable to process your recent payment for Revoraa Pro.</p>
          <p style="color: #9ca3af; margin: 0 0 2rem;">Please update your payment method to avoid any interruption to your premium features.</p>
          <a href="https://revoraa.co.in/pricing" style="display: inline-block; padding: 0.75rem 1.5rem; background: #ef4444; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Update Payment Method</a>
        </div>
      `;
      break;

    case 'subscription_cancelled':
      subject = 'Your Subscription has been Cancelled';
      html = `
        <div style="${style}">
          <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">Subscription Cancelled</h2>
          <p style="color: #9ca3af; margin: 0 0 1rem;">Your Revoraa Pro subscription has been cancelled.</p>
          <p style="color: #9ca3af; margin: 0 0 2rem;">You will continue to have access to Pro features until the end of your current billing period (${payload.end_date}). We're sorry to see you go!</p>
          <a href="https://revoraa.co.in/pricing" style="display: inline-block; padding: 0.75rem 1.5rem; background: #374151; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Renew Subscription</a>
        </div>
      `;
      break;

    default:
      throw new Error('Unknown email type');
  }

  return { subject, html };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);
    
    // Auth Check
    const authHeader = req.headers.get('Authorization');
    let user_id = null;
    let email = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        user_id = user.id;
        email = user.email;
      }
    }

    const body = await req.json();
    const { type, payload, to, userId } = body;

    // Use passed email if provided, else use auth user email
    const targetEmail = to || email;
    const targetUser = userId || user_id;

    if (!targetEmail) throw new Error('Recipient email is required');

    const { subject, html } = buildTemplate(type, payload);

    if (!RESEND_API_KEY) {
      // Mock mode for local dev without key
      console.log(`[MOCK EMAIL] To: ${targetEmail}, Subject: ${subject}`);
      await logEmail(supabase, targetUser, type, subject, 'sent');
      return new Response(JSON.stringify({ success: true, mock: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: targetEmail,
        subject,
        html
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      await logEmail(supabase, targetUser, type, subject, 'failed', err);
      throw new Error(`Resend API error: ${err}`);
    }

    await logEmail(supabase, targetUser, type, subject, 'sent');
    
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
