/**
 * scheduled-reminders — Supabase Edge Function
 * 
 * Called by a Supabase cron job every day at 8:00 AM UTC.
 * 
 * 1. Finds all users with revisions due today
 * 2. For each user:
 *    a. Sends an FCM push notification (if token is stored)
 *    b. Sends a Resend email as fallback (if email notifications enabled)
 *    c. Creates an in-app notification record
 */

// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY   = Deno.env.get('RESEND_API_KEY')!;
const FCM_SERVER_KEY   = Deno.env.get('FCM_SERVER_KEY')!;
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const APP_URL          = Deno.env.get('APP_URL') || 'https://revoraa.com';
const SENDER_EMAIL     = Deno.env.get('SENDER_EMAIL') || 'Revoraa <reminders@revoraa.com>';
const FCM_API_URL      = Deno.env.get('FCM_API_URL') || 'https://fcm.googleapis.com/fcm/send';
const RESEND_API_URL   = Deno.env.get('RESEND_API_URL') || 'https://api.resend.com/emails';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendFCMPush(token: string, title: string, body: string) {
  const res = await fetch(FCM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${FCM_SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body, icon: '/pwa-192x192.png' },
      data: { url: '/revision' },
    }),
  });
  return res.ok;
}

async function sendResendEmail(to: string, name: string, revisionCount: number) {
  const estimatedTime = `${revisionCount * 15} min`; // 15 mins per revision estimate
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: SENDER_EMAIL,
      to,
      subject: '🧠 Your revisions are waiting',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 2rem; background: #0f0f10; color: #fff; border-radius: 12px;">
          <p style="color: #9ca3af; margin: 0 0 1rem;">You have</p>
          <h1 style="color: #fff; font-size: 2.5rem; margin: 0 0 1rem;">${revisionCount}</h1>
          <p style="color: #9ca3af; margin: 0 0 1rem;">revisions due today.</p>
          <p style="color: #9ca3af; margin: 0 0 2rem;">Estimated Time: <strong style="color: #fff;">${estimatedTime}</strong></p>
          <p style="color: #fff; margin: 0 0 2rem;">Continue your streak.</p>
          <a href="${APP_URL}/revision" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Open Revoraa
          </a>
        </div>
      `,
    }),
  });
  return res.ok;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);
    const today = new Date().toISOString().split('T')[0];

    // Find users with revisions due today
    const { data: schedules, error } = await supabase
      .from('revision_schedule')
      .select(`
        user_id,
        solved_problem:solved_problems(user_id)
      `)
      .eq('is_completed', false)
      .lte('next_revision_date', today);

    if (error) throw error;

    // Group by user_id
    const userIds = [...new Set((schedules ?? []).map((s: any) => s.user_id))];

    let sent = 0;
    const errors: string[] = [];

    for (const userId of userIds) {
      try {
        const revCount = (schedules ?? []).filter((s: any) => s.user_id === userId).length;

        // Get user profile + settings
        const [profileRes, settingsRes] = await Promise.all([
          supabase.from('profiles').select('full_name, auth_id').eq('auth_id', userId).single(),
          supabase.from('user_settings').select('fcm_token, notifications_enabled, email').eq('user_id', userId).single(),
        ]);

        const profile = profileRes.data;
        const settings = settingsRes.data;
        if (!settings?.notifications_enabled) continue;

        const name = profile?.full_name ?? 'there';
        const title = `${revCount} revision${revCount !== 1 ? 's' : ''} due today`;
        const body  = `Time to practice! Keep your streak going.`;

        // 1. FCM push
        let pushSent = false;
        if (settings.fcm_token) {
          pushSent = await sendFCMPush(settings.fcm_token, `🔁 ${title}`, body);
        }

        // 2. Email fallback
        const email = settings.email ?? (await supabase.auth.admin.getUserById(userId))?.data?.user?.email;
        if (!pushSent && email) {
          await sendResendEmail(email, name, revCount);
        }

        // 3. In-app notification
        await supabase.from('notifications').insert({
          user_id: userId,
          title: `🔁 ${title}`,
          body,
          type: 'revision_due',
        });

        sent++;
      } catch (userErr: any) {
        errors.push(`${userId}: ${userErr.message}`);
      }
    }

    return new Response(
      JSON.stringify({ sent, errors, total: userIds.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
