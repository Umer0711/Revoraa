/**
 * Production & QA Validation Script for Revoraa Mobile
 */
const { execSync } = require('child_process');

console.log('--------------------------------------------------');
console.log('🚀 Running Revoraa Mobile Production QA Validation');
console.log('--------------------------------------------------');

try {
  console.log('\n[1/3] Running TypeScript Strict Type Check...');
  execSync('npm run type-check', { stdio: 'inherit' });

  console.log('\n[2/3] Running ESLint Code Audit...');
  execSync('npm run lint', { stdio: 'inherit' });

  console.log('\n[3/3] Checking Code Formatting...');
  execSync('npm run format', { stdio: 'inherit' });

  console.log('\n✅ ALL QUALITY GATES PASSED CLEANLY! Ready for Production Build.');
} catch (error) {
  console.error('\n❌ Validation failed with error:', error.message);
  process.exit(1);
}
