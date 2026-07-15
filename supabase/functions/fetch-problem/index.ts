// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

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

    let resultData;

    // 1. LeetCode Handling
    if (platform === 'leetcode') {
      const LEETCODE_GRAPHQL = Deno.env.get('LEETCODE_GRAPHQL_URL') || 'https://leetcode.com/graphql';
      let slug = input.trim();
      const urlMatch = slug.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i);
      if (urlMatch) slug = urlMatch[1];
      
      const PROBLEM_QUERY = `
      query problemQuery($slug: String!) {
        question(titleSlug: $slug) {
          questionId
          title
          titleSlug
          difficulty
          acRate
          topicTags { name }
        }
      }`;
      
      const lcRes = await fetch(LEETCODE_GRAPHQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: PROBLEM_QUERY, variables: { slug } }),
      });
      const lcData = await lcRes.json();
      const q = lcData?.data?.question;
      if (!q) return errorResponse('NOT_FOUND', 'Problem not found on LeetCode');

      resultData = {
        title: q.title,
        difficulty: q.difficulty,
        url: `https://leetcode.com/problems/${q.titleSlug}/`,
        externalId: q.questionId,
        tags: q.topicTags?.map((t: any) => t.name) || [],
        acceptanceRate: q.acRate ? Math.round(q.acRate * 10) / 10 : null,
      };
    } else if (platform === 'codeforces') {
      const CODEFORCES_API = Deno.env.get('CODEFORCES_API_URL');
      if (!CODEFORCES_API) return errorResponse('API_NOT_CONFIGURED', 'Codeforces API not configured');
      
      const fetchUrl = url || input;
      const res = await fetch(`${CODEFORCES_API}?url=${encodeURIComponent(fetchUrl)}`, { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) return errorResponse('FETCH_ERROR', 'Failed to fetch from Codeforces API');
      
      const data = await res.json();
      resultData = {
        title: data.title || 'Unknown Problem',
        difficulty: data.difficulty || 'Medium',
        url: fetchUrl,
        externalId: data.externalId || fetchUrl,
        tags: data.tags || [],
        acceptanceRate: data.acceptanceRate || null,
        companies: data.companies || []
      };
    } else {
      return errorResponse('UNSUPPORTED_PLATFORM', 'This platform is not supported yet. Currently Revoraa supports LeetCode and Codeforces.');
    }

    return new Response(JSON.stringify({
      success: true,
      data: resultData
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});

  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message);
  }
});
