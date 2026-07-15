// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function errorResponse(code: string, message: string, status = 200) {
  return new Response(
    JSON.stringify({ success: false, error: { code, message } }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return errorResponse('METHOD_NOT_ALLOWED', 'Only POST supported');

  try {
    const { platform, url, input } = await req.json();
    if (!platform) return errorResponse('MISSING_PLATFORM', 'Platform slug is required');

    // Initialize Supabase admin client (service role bypasses RLS — safe server-side only)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('MISSING_CONFIG', 'Server configuration is missing.');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get platform ID from DB
    const { data: platformRow, error: platformErr } = await supabase
      .from('coding_platforms')
      .select('id')
      .eq('slug', platform)
      .single();

    if (platformErr || !platformRow) {
      return errorResponse('PLATFORM_NOT_FOUND', `Platform '${platform}' not found in database.`);
    }

    let problemRow: Record<string, any>;
    let tags: string[] = [];

    // ── LeetCode ──────────────────────────────────────────────────────────
    if (platform === 'leetcode') {
      const LEETCODE_GRAPHQL = Deno.env.get('LEETCODE_GRAPHQL_URL') || 'https://leetcode.com/graphql';
      let slug = (input || '').trim();

      // Normalize: full URL → slug
      const urlMatch = slug.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i);
      if (urlMatch) slug = urlMatch[1];

      // Numeric ID → resolve to slug via search
      if (/^\d+$/.test(slug)) {
        try {
          const searchRes = await fetch(LEETCODE_GRAPHQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
            body: JSON.stringify({
              query: `query { problemsetQuestionList(categorySlug: "", filters: {searchKeywords: "${slug}"}, limit: 1, skip: 0) { questions { questionId title titleSlug } } }`,
            }),
          });
          const searchData = await searchRes.json();
          const q = searchData?.data?.problemsetQuestionList?.questions?.[0];
          if (!q || q.questionId !== slug) {
            return errorResponse('NOT_FOUND', 'Problem not found by number on LeetCode.');
          }
          slug = q.titleSlug;
        } catch (e: any) {
          return errorResponse('GRAPHQL_ERROR', `Failed to search LeetCode by ID: ${e.message}`);
        }
      }

      const PROBLEM_QUERY = `
      query problemQuery($slug: String!) {
        question(titleSlug: $slug) {
          questionId
          title
          titleSlug
          difficulty
          acRate
          likes
          dislikes
          isPaidOnly
          topicTags { name }
        }
      }`;

      const lcRes = await fetch(LEETCODE_GRAPHQL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': `https://leetcode.com/problems/${slug}/`,
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ query: PROBLEM_QUERY, variables: { slug } }),
      });

      if (!lcRes.ok) {
        return errorResponse('GRAPHQL_ERROR', `LeetCode GraphQL returned HTTP ${lcRes.status}`);
      }

      const lcData = await lcRes.json();
      const q = lcData?.data?.question;
      if (!q) return errorResponse('NOT_FOUND', 'Problem not found on LeetCode.');

      problemRow = {
        platform_id: platformRow.id,
        external_problem_id: q.questionId,
        title: q.title,
        slug: q.titleSlug,
        difficulty: q.difficulty,
        acceptance_rate: q.acRate ? Math.round(q.acRate * 10) / 10 : null,
        likes: q.likes ?? 0,
        dislikes: q.dislikes ?? 0,
        is_paid: q.isPaidOnly ?? false,
        url: `https://leetcode.com/problems/${q.titleSlug}/`,
      };
      tags = q.topicTags?.map((t: any) => t.name) || [];

    // ── Codeforces ─────────────────────────────────────────────────────────
    } else if (platform === 'codeforces') {
      const CODEFORCES_API = Deno.env.get('CODEFORCES_API_URL');
      if (!CODEFORCES_API) return errorResponse('API_NOT_CONFIGURED', 'Codeforces API not configured');

      const fetchUrl = url || input;
      const res = await fetch(`${CODEFORCES_API}?url=${encodeURIComponent(fetchUrl)}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return errorResponse('FETCH_ERROR', 'Failed to fetch from Codeforces API');

      const data = await res.json();
      const cfSlug = data.externalId?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cf-${Date.now()}`;

      problemRow = {
        platform_id: platformRow.id,
        external_problem_id: data.externalId || fetchUrl,
        title: data.title || 'Unknown Problem',
        slug: cfSlug,
        difficulty: data.difficulty || 'Medium',
        url: fetchUrl,
        acceptance_rate: data.acceptanceRate || null,
      };
      tags = data.tags || [];

    } else {
      return errorResponse(
        'UNSUPPORTED_PLATFORM',
        'This platform is not supported yet. Currently Revoraa supports LeetCode and Codeforces.'
      );
    }

    // ── Save to DB using service role (bypasses RLS) ───────────────────────
    const { data: savedProblem, error: saveErr } = await supabase
      .from('problems')
      .upsert(problemRow, { onConflict: 'platform_id,slug' })
      .select()
      .single();

    if (saveErr) {
      console.error('DB upsert error:', saveErr);
      return errorResponse('DB_ERROR', `Failed to save problem: ${saveErr.message}`);
    }

    // Save tags
    if (tags.length > 0) {
      await supabase
        .from('problem_tags')
        .upsert(
          tags.map((tag: string) => ({ problem_id: savedProblem.id, tag })),
          { onConflict: 'problem_id,tag', ignoreDuplicates: true }
        );
    }

    // Return the full DB record (including id) plus derived metadata for the frontend
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...savedProblem,
          // These convenience fields let the frontend pre-populate forms without extra queries
          platform: platform,
          externalId: savedProblem.external_problem_id,
          tags,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Unhandled error in fetch-problem:', err);
    return errorResponse('INTERNAL_ERROR', err.message || 'An unexpected error occurred.');
  }
});
