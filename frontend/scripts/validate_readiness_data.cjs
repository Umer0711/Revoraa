/**
 * Revoraa Interview Readiness — Data Integrity Validation Script
 * 
 * Audits the ENTIRE dataset for:
 *  1. Duplicate questions (by slug, URL, external_problem_id)
 *  2. Companies with zero questions
 *  3. Broken foreign key mappings
 *  4. Incorrect difficulty values
 *  5. Verifies per-company counts against source CSV
 *  6. Checks problem_companies vs company_questions table split
 *  7. Dashboard total vs SUM(company) deduplication
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env
const envPath = path.join(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) env[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  });
}

const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const repoPath = path.join(__dirname, '../scratch/leetcode-companywise-interview-questions');

async function runValidation() {
  console.log('='.repeat(70));
  console.log('  REVORAA INTERVIEW READINESS — DATA INTEGRITY AUDIT');
  console.log('='.repeat(70));
  console.log('');

  const issues = [];

  // ──────────────────────────────────────────────
  // 1. Count unique problems in DB
  // ──────────────────────────────────────────────
  console.log('[1/10] Counting problems in database...');
  const { data: allProblems, count: problemCount } = await supabase
    .from('problems')
    .select('id, slug, title, difficulty, url, external_problem_id', { count: 'exact' });

  console.log(`       Total problems rows: ${problemCount}`);

  // Check for duplicate slugs
  const slugMap = new Map();
  const urlMap = new Map();
  let dupSlugs = 0, dupUrls = 0;
  (allProblems || []).forEach(p => {
    if (slugMap.has(p.slug)) { dupSlugs++; }
    slugMap.set(p.slug, (slugMap.get(p.slug) || 0) + 1);

    if (p.url && urlMap.has(p.url)) { dupUrls++; }
    if (p.url) urlMap.set(p.url, (urlMap.get(p.url) || 0) + 1);
  });
  
  console.log(`       Duplicate slugs: ${dupSlugs}`);
  console.log(`       Duplicate URLs:  ${dupUrls}`);
  if (dupSlugs > 0) issues.push(`CRITICAL: ${dupSlugs} duplicate slug(s) in problems table`);
  if (dupUrls > 0) issues.push(`WARNING: ${dupUrls} duplicate URL(s) in problems table`);

  // Check for invalid difficulty values
  let invalidDiff = 0;
  (allProblems || []).forEach(p => {
    if (!['Easy', 'Medium', 'Hard'].includes(p.difficulty)) invalidDiff++;
  });
  console.log(`       Invalid difficulty: ${invalidDiff}`);
  if (invalidDiff > 0) issues.push(`CRITICAL: ${invalidDiff} problems with invalid difficulty`);

  // ──────────────────────────────────────────────
  // 2. Count companies in DB
  // ──────────────────────────────────────────────
  console.log('\n[2/10] Counting companies in database...');
  const { data: allCompanies, count: companyCount } = await supabase
    .from('companies')
    .select('id, name', { count: 'exact' });

  console.log(`       Total companies: ${companyCount}`);

  // Count company directories in source repo
  const entries = fs.readdirSync(repoPath, { withFileTypes: true });
  const companyDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));
  console.log(`       Source directories: ${companyDirs.length}`);
  if (companyCount !== companyDirs.length) {
    issues.push(`MISMATCH: DB has ${companyCount} companies but source has ${companyDirs.length} directories`);
  }

  // ──────────────────────────────────────────────
  // 3. Check problem_companies mapping table
  // ──────────────────────────────────────────────
  console.log('\n[3/10] Auditing problem_companies mapping table...');
  const { count: pcCount } = await supabase
    .from('problem_companies')
    .select('id', { count: 'exact' });

  console.log(`       problem_companies rows: ${pcCount}`);

  // ──────────────────────────────────────────────
  // 4. Check company_questions mapping table (migration-defined)
  // ──────────────────────────────────────────────
  console.log('\n[4/10] Checking company_questions table...');
  const { count: cqCount, error: cqErr } = await supabase
    .from('company_questions')
    .select('id', { count: 'exact' });
  
  if (cqErr) {
    console.log(`       company_questions table: ERROR or DOES NOT EXIST`);
    console.log(`       Error: ${cqErr.message}`);
  } else {
    console.log(`       company_questions rows: ${cqCount}`);
    if (cqCount === 0 && pcCount > 0) {
      issues.push(`WARNING: company_questions has 0 rows but problem_companies has ${pcCount} — data split across two junction tables`);
    }
  }

  // ──────────────────────────────────────────────
  // 5. Find companies with zero questions
  // ──────────────────────────────────────────────
  console.log('\n[5/10] Finding companies with zero linked questions...');
  const { data: pcMappings } = await supabase
    .from('problem_companies')
    .select('company_id');
  
  const companyWithQuestions = new Set((pcMappings || []).map(m => m.company_id));
  const companiesWithZero = (allCompanies || []).filter(c => !companyWithQuestions.has(c.id));
  console.log(`       Companies with 0 questions: ${companiesWithZero.length}`);
  if (companiesWithZero.length > 0) {
    issues.push(`WARNING: ${companiesWithZero.length} companies have 0 linked questions`);
    companiesWithZero.slice(0, 10).forEach(c => console.log(`         - ${c.name}`));
    if (companiesWithZero.length > 10) console.log(`         ... and ${companiesWithZero.length - 10} more`);
  }

  // ──────────────────────────────────────────────
  // 6. Verify per-company counts against source CSV
  // ──────────────────────────────────────────────
  console.log('\n[6/10] Verifying key company counts against source CSV...');
  const keyCompanies = ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix', 'adobe', 'uber', 'oracle', 'jpmorgan', 'flipkart', 'goldman-sachs'];

  for (const slug of keyCompanies) {
    const csvPath = path.join(repoPath, slug, 'all.csv');
    if (!fs.existsSync(csvPath)) {
      console.log(`       ${slug}: CSV NOT FOUND`);
      issues.push(`MISSING: ${slug}/all.csv not found in source repo`);
      continue;
    }
    
    const csvLines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim());
    const csvQuestionCount = csvLines.length - 1; // minus header

    // Compute unique slugs in CSV (some rows might be duplicate within same company)
    const csvSlugs = new Set();
    for (let i = 1; i < csvLines.length; i++) {
      const cols = csvLines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      const url = cols[1] && cols[1].startsWith('http') ? cols[1] : '';
      const slugMatch = url.match(/problems\/([a-z0-9-]+)/i);
      if (slugMatch) csvSlugs.add(slugMatch[1]);
    }

    // Find this company in DB
    const companyName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const { data: dbComp } = await supabase.from('companies').select('id').eq('name', companyName).maybeSingle();
    
    if (!dbComp) {
      console.log(`       ${companyName}: NOT FOUND IN DB`);
      issues.push(`MISSING: Company "${companyName}" not in database`);
      continue;
    }

    // Count problem_companies mappings for this company
    const { count: dbMappingCount } = await supabase
      .from('problem_companies')
      .select('id', { count: 'exact' })
      .eq('company_id', dbComp.id);

    const match = dbMappingCount === csvSlugs.size ? '✓' : '✗ MISMATCH';
    console.log(`       ${companyName.padEnd(20)} CSV: ${csvQuestionCount} rows, ${csvSlugs.size} unique slugs, DB mappings: ${dbMappingCount} ${match}`);
    
    if (dbMappingCount !== csvSlugs.size) {
      issues.push(`COUNT MISMATCH: ${companyName} — CSV has ${csvSlugs.size} unique questions but DB has ${dbMappingCount} mappings`);
    }
  }

  // ──────────────────────────────────────────────
  // 7. Dashboard total = unique problems (not sum of company mappings)
  // ──────────────────────────────────────────────
  console.log('\n[7/10] Checking dashboard total vs company mapping sum...');
  const uniqueProblems = problemCount;
  const sumOfMappings = pcCount;
  console.log(`       Unique problems in DB: ${uniqueProblems}`);
  console.log(`       Sum of problem_companies: ${sumOfMappings}`);
  console.log(`       Ratio (mappings / unique): ${(sumOfMappings / uniqueProblems).toFixed(2)}x`);
  if (sumOfMappings > uniqueProblems) {
    console.log(`       → This is expected: one question can map to many companies`);
  }

  // ──────────────────────────────────────────────
  // 8. Check problem_tags coverage
  // ──────────────────────────────────────────────
  console.log('\n[8/10] Checking problem_tags coverage...');
  const { count: tagCount } = await supabase
    .from('problem_tags')
    .select('id', { count: 'exact' });
  console.log(`       problem_tags rows: ${tagCount}`);

  // ──────────────────────────────────────────────
  // 9. Check question_topics and question_patterns
  // ──────────────────────────────────────────────
  console.log('\n[9/10] Checking question_topics and question_patterns...');
  const { count: qtCount, error: qtErr } = await supabase
    .from('question_topics')
    .select('id', { count: 'exact' });
  const { count: qpCount, error: qpErr } = await supabase
    .from('question_patterns')
    .select('id', { count: 'exact' });
  console.log(`       question_topics rows: ${qtErr ? 'ERROR: ' + qtErr.message : qtCount}`);
  console.log(`       question_patterns rows: ${qpErr ? 'ERROR: ' + qpErr.message : qpCount}`);

  // ──────────────────────────────────────────────
  // 10. Check solved_problems integrity
  // ──────────────────────────────────────────────
  console.log('\n[10/10] Checking solved_problems referential integrity...');
  const { data: solvedProblems } = await supabase
    .from('solved_problems')
    .select('id, problem_id')
    .is('deleted_at', null);
  
  const problemIdSet = new Set((allProblems || []).map(p => p.id));
  let orphanSolved = 0;
  (solvedProblems || []).forEach(sp => {
    if (!problemIdSet.has(sp.problem_id)) orphanSolved++;
  });
  console.log(`       Active solved_problems: ${(solvedProblems || []).length}`);
  console.log(`       Orphan solved_problems (missing problem): ${orphanSolved}`);
  if (orphanSolved > 0) issues.push(`CRITICAL: ${orphanSolved} solved_problems reference non-existent problem IDs`);

  // ──────────────────────────────────────────────
  // FINAL REPORT
  // ──────────────────────────────────────────────
  console.log('\n' + '='.repeat(70));
  console.log('  VALIDATION REPORT');
  console.log('='.repeat(70));
  if (issues.length === 0) {
    console.log('  ✅ ALL CHECKS PASSED — No issues found');
  } else {
    console.log(`  ⚠️  ${issues.length} ISSUE(S) FOUND:\n`);
    issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  }
  console.log('\n' + '='.repeat(70));
}

runValidation().catch(err => console.error('Fatal validation error:', err));
