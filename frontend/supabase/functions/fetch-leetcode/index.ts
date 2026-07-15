// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LEETCODE_GRAPHQL = Deno.env.get('LEETCODE_GRAPHQL_URL') || 'https://leetcode.com/graphql';

const PROBLEM_QUERY = `
query problemQuery($slug: String!) {
  question(titleSlug: $slug) {
    questionId
    title
    titleSlug
    difficulty
    likes
    dislikes
    isPaidOnly
    acRate
    topicTags {
      name
    }
    companyTagStats
  }
}`;

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
  // 1. Handle browser preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Validate HTTP method
    if (req.method !== 'POST') {
      return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are supported.');
    }

    // 3. Parse JSON input
    let inputBody;
    try {
      inputBody = await req.json();
    } catch (e) {
      return errorResponse('INVALID_JSON', 'Invalid or missing JSON body.');
    }

    const { input } = inputBody;
    if (!input || typeof input !== 'string') {
      return errorResponse('MISSING_INPUT', 'A valid "input" string must be provided.');
    }

    // 4. Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('MISSING_CONFIG', 'Server configuration is missing.');
    }

    // 5. Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 6. Get leetcode platform ID
    const { data: platform, error: platformErr } = await supabase
      .from('coding_platforms')
      .select('id')
      .eq('slug', 'leetcode')
      .single();

    if (platformErr || !platform) {
      console.error('Platform fetch error:', platformErr);
      return errorResponse('PLATFORM_NOT_FOUND', 'LeetCode platform not found in database.');
    }

    // 7. Normalize input to slug
    let slug = input.trim();

    // Handle full URL format
    const urlMatch = slug.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i);
    if (urlMatch) slug = urlMatch[1];

    // Handle numeric ID format
    if (/^\d+$/.test(slug)) {
      try {
        const searchRes = await fetch(LEETCODE_GRAPHQL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
          body: JSON.stringify({
            query: `query { problemsetQuestionList(categorySlug: "", filters: {searchKeywords: "${slug}"}, limit: 1, skip: 0) { questions { questionId title titleSlug } } }`,
          }),
        });

        if (!searchRes.ok) {
          throw new Error(`HTTP ${searchRes.status}`);
        }

        const searchData = await searchRes.json();
        const q = searchData?.data?.problemsetQuestionList?.questions?.[0];

        if (!q || q.questionId !== slug) {
          return errorResponse('NOT_FOUND', 'Problem not found by number on LeetCode.');
        }
        slug = q.titleSlug;
      } catch (e: any) {
        console.error('Numeric search error:', e);
        return errorResponse('GRAPHQL_ERROR', `Failed to search LeetCode by ID: ${e.message}`);
      }
    }

    // 8. Fetch from LeetCode GraphQL
    let lcRes;
    try {
      lcRes = await fetch(LEETCODE_GRAPHQL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': `https://leetcode.com/problems/${slug}/`,
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ query: PROBLEM_QUERY, variables: { slug } }),
      });

      if (!lcRes.ok) {
        throw new Error(`HTTP ${lcRes.status}`);
      }
    } catch (e: any) {
      console.error('GraphQL fetch error:', e);
      return errorResponse('GRAPHQL_ERROR', `Failed to fetch problem metadata from LeetCode: ${e.message}`);
    }

    const lcData = await lcRes.json();
    const q = lcData?.data?.question;
    
    if (!q) {
      return errorResponse('NOT_FOUND', 'Problem not found on LeetCode.');
    }

    // 9. Upsert into problems table
    const problemRow = {
      platform_id: platform.id,
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

    const { data: savedProblem, error: saveErr } = await supabase
      .from('problems')
      .upsert(problemRow, { onConflict: 'platform_id,slug' })
      .select()
      .single();

    if (saveErr) {
      console.error('DB Upsert error:', saveErr);
      return errorResponse('DB_ERROR', `Failed to save problem to database: ${saveErr.message}`);
    }

    // 10. Save tags
    if (q.topicTags && q.topicTags.length > 0) {
      const { error: tagsErr } = await supabase.from('problem_tags').upsert(
        q.topicTags.map((t: { name: string }) => ({ problem_id: savedProblem.id, tag: t.name })),
        { onConflict: 'problem_id,tag', ignoreDuplicates: true }
      );
      if (tagsErr) {
        console.error('Tags upsert error:', tagsErr);
      }
    }

    // 11. Return successful response
    return new Response(
      JSON.stringify({ success: true, problem: savedProblem }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Unhandled exception:', err);
    return errorResponse('INTERNAL_ERROR', err.message || 'An unexpected error occurred.');
  }
});
