/**
 * Revoraa Level 5: Expert / Production Python Gen Z Challenges
 *
 * Implements interactive challenge modes:
 * - Cooked or Cracked: Docker layer cache invalidation (COPY . . before pip install)
 * - Bug Hunt: Leaked secrets in exception tracebacks and application logs
 * - Internet Is Wrong: The myth that "100% line coverage guarantees zero production bugs"
 * - Boss Fight: Resilient Multi-Stage Production Deployment Triage
 * - Code Escape Room: CI/CD Pipeline Multi-Stage Verification Gate
 */

export const LEVEL_5_CHALLENGES = [
  // ─── 1. Cooked or Cracked: Docker Layer Cache Invalidation ─────────────────
  {
    id: 'chal-l5-01-docker-cache',
    slug: 'cooked-or-cracked-docker-cache',
    path_slug: 'python-development',
    level_number: 5,
    module_slug: 'docker-and-deployment-fundamentals',
    title: 'Cooked or Cracked: The Docker Cache Invalidator',
    challenge_type: 'cooked_or_cracked',
    difficulty: 'expert',
    xp_reward: 80,
    tagline: 'Docker Layer Caching & Build Optimization',
    instructions: {
      en: 'Inspect the Dockerfile build order simulation below. Determine why copying the entire repository (`COPY . .`) BEFORE running `pip install` invalidates Docker layer caching on every minor code edit.',
      'hi-Latn': 'Dockerfile build order simulation dekhein. Samjhein kyu `COPY . .` ko `pip install` se pehle lagana Docker cache ko invalidate karta hai.',
      hi: 'नीचे दिए गए डॉकरफ़ाइल बिल्ड ऑर्डर सिमुलेशन का निरीक्षण करें। समझें कि `pip install` से पहले `COPY . .` लगाने से हर छोटे कोड परिवर्तन पर डॉकर कैश क्यों अमान्य हो जाता है।'
    },
    starter_code: `# Cooked or Cracked: Docker Layer Cache Order
def simulate_build(changed_file: str, copy_all_first: bool) -> dict:
    if copy_all_first:
        # COOKED: Any code change breaks cache before pip install!
        cached_pip = False
    else:
        # CRACKED: requirements.txt is copied first; code changes don't re-install pip!
        cached_pip = (changed_file != "requirements.txt")
        
    return {
        "changed": changed_file,
        "pip_layer_status": "CACHED" if cached_pip else "REBUILDING (Slow)"
    }

# Scenario: Developer changed 1 line in src/app.py
cooked = simulate_build("src/app.py", copy_all_first=True)
cracked = simulate_build("src/app.py", copy_all_first=False)

print(f"Cooked Setup:  {cooked['pip_layer_status']}")
print(f"Cracked Setup: {cracked['pip_layer_status']}")`,
    expected_output: `Cooked Setup:  REBUILDING (Slow)
Cracked Setup: CACHED`,
    hints: {
      en: [
        'Docker evaluates cache line by line. If a layer is invalidated, all subsequent layers must rebuild.',
        'Copying requirements.txt and running pip install first ensures the dependencies layer stays cached across routine code edits.'
      ],
      'hi-Latn': [
        'Docker layer-by-layer cache evaluate karta hai. Agar koi layer invalidate ho to aage ke saare layers rebuild hote hain.',
        '`requirements.txt` pehle copy karne se dependency install cached rehti hai.'
      ],
      hi: [
        'डॉकर लेयर दर लेयर कैश का मूल्यांकन करता है। यदि कोई लेयर अमान्य हो जाती है, तो बाद की सभी लेयर्स को फिर से बनाना पड़ता है।',
        '`requirements.txt` को पहले कॉपी करने से निर्भरता कैश बनी रहती है।'
      ]
    }
  },

  // ─── 2. Bug Hunt: Plaintext Secret in Log Stream ───────────────────────────
  {
    id: 'chal-l5-02-secret-leak',
    slug: 'bug-hunt-leaked-secret',
    path_slug: 'python-development',
    level_number: 5,
    module_slug: 'configuration-security-and-secrets',
    title: 'Bug Hunt: The Leaked Production Token',
    challenge_type: 'bug_hunt',
    difficulty: 'expert',
    xp_reward: 80,
    tagline: 'Log Sanitization & Secret Masking',
    instructions: {
      en: 'Fix the `sanitize_log_event` function so that sensitive authentication tokens and passwords are scrubbed before being logged to stdout.',
      'hi-Latn': '`sanitize_log_event` function ko fix karein taaki auth tokens aur passwords stdout me leak na hon.',
      hi: '`sanitize_log_event` फ़ंक्शन को ठीक करें ताकि प्रमाणीकरण टोकन और पासवर्ड लॉग में लीक न हों।'
    },
    starter_code: `def sanitize_log_event(event: dict) -> dict:
    # BUG: Returns raw event dictionary without scrubbing credentials!
    # Fix this to redact keys: "token", "password", "secret", "auth"
    clean = {}
    for k, v in event.items():
        if k.lower() in ["token", "password", "secret", "auth"]:
            clean[k] = "[REDACTED]"
        else:
            clean[k] = v
    return clean

# Test execution:
raw_log = {"user": "alice", "action": "login", "token": "ghp_super_secret_9988"}
sanitized = sanitize_log_event(raw_log)
print(f"User: {sanitized['user']}")
print(f"Token: {sanitized['token']}")`,
    expected_output: `User: alice
Token: [REDACTED]`,
    hints: {
      en: [
        'Check keys against a blacklist of sensitive credential terms.',
        'Replace sensitive values with "[REDACTED]" or a masked representation.'
      ],
      'hi-Latn': [
        'Sensitive terms ("token", "password", etc.) ko check karein.',
        'Sensitive values ko "[REDACTED]" se replace karein.'
      ],
      hi: [
        'संवेदनशील शब्दों ("token", "password") की जांच करें।',
        'संवेदनशील मानों को "[REDACTED]" से बदलें।'
      ]
    }
  },

  // ─── 3. Internet Is Wrong: 100% Coverage Myth ──────────────────────────────
  {
    id: 'chal-l5-03-coverage-myth',
    slug: 'internet-is-wrong-100-coverage',
    path_slug: 'python-development',
    level_number: 5,
    module_slug: 'production-testing-and-quality-assurance',
    title: 'Internet Is Wrong: The 100% Coverage Illusion',
    challenge_type: 'internet_is_wrong',
    difficulty: 'expert',
    xp_reward: 80,
    tagline: 'Mutation Testing vs Vanity Coverage',
    instructions: {
      en: 'The Internet claims: "If your code has 100% test coverage, it is impossible for bugs to slip into production." Run the simulation to see how a mutated bug escapes 100% line coverage because the test suite lacks meaningful assertions.',
      'hi-Latn': 'Internet claim karta hai ki 100% line coverage ka matlab zero bugs hai. Run karke dekhein kaise weak assertions ke karan bug survive kar jata hai.',
      hi: 'इंटरनेट का दावा है कि 100% लाइन कवरेज का अर्थ है शून्य बग। सिमुलेशन चलाएं और देखें कि कैसे कमजोर दावों के कारण एक म्यूटेटेड बग बच निकलता है।'
    },
    starter_code: `# Original function:
def calculate_discount(price: float) -> float:
    return price * 0.90  # 10% discount

# Buggy mutant injected by a junior dev:
def mutated_calculate_discount(price: float) -> float:
    return price * 0.50  # 50% discount! Catastrophic pricing bug!

# Vanity test that achieves 100% line coverage:
def weak_test(func):
    result = func(100.0)
    # Passes without asserting the actual value!
    assert result is not None

# Rigorous assertion test:
def strong_test(func):
    result = func(100.0)
    assert result == 90.0, f"Expected 90.0, got {result}"

print("Weak test with mutated bug:")
try:
    weak_test(mutated_calculate_discount)
    print(" -> PASSED! The bug survived 100% coverage undetected!")
except AssertionError as e:
    print(f" -> CAUGHT: {e}")

print("Strong test with mutated bug:")
try:
    strong_test(mutated_calculate_discount)
    print(" -> PASSED")
except AssertionError as e:
    print(f" -> CAUGHT: {e}")`,
    expected_output: `Weak test with mutated bug:
 -> PASSED! The bug survived 100% coverage undetected!
Strong test with mutated bug:
 -> CAUGHT: Expected 90.0, got 50.0`,
    hints: {
      en: [
        'Line coverage only measures whether a line was executed, not whether the result was verified.',
        'Mutation testing proves that tests without assertions provide zero regression safety.'
      ],
      'hi-Latn': [
        'Line coverage sirf ye batata hai ki line execute hui ya nahi, output verify hua ya nahi ye nahi batata.',
        'Mutation testing prove karta hai ki bina assert ke test useless hote hain.'
      ],
      hi: [
        'लाइन कवरेज केवल यह मापता है कि एक लाइन निष्पादित हुई या नहीं, यह नहीं कि परिणाम सही था।',
        'म्यूटेशन परीक्षण साबित करता है कि दावों के बिना परीक्षण कोई सुरक्षा प्रदान नहीं करते हैं।'
      ]
    }
  },

  // ─── 4. Boss Fight: Production Readiness Launch Triage ─────────────────────
  {
    id: 'chal-l5-04-boss-fight-triage',
    slug: 'boss-fight-production-readiness',
    path_slug: 'python-development',
    level_number: 5,
    module_slug: 'production-readiness-and-final-assessment',
    title: 'Boss Fight: The 3:00 AM Production Launch Triage',
    challenge_type: 'boss_fight',
    difficulty: 'expert',
    xp_reward: 100,
    tagline: 'Resilient Microservice Triage & Health Diagnostics',
    instructions: {
      en: 'Triage a failing production launch: resolve missing environment variables, prevent container root execution, and restore the decoupled readiness probe to achieve a GO decision.',
      'hi-Latn': '3:00 AM production launch triage karein: missing env vars fix karein, non-root user enforce karein aur readiness probe theek karke GO decision layein.',
      hi: 'एक विफल प्रोडक्शन लॉन्च को ठीक करें: लापता पर्यावरण चर हल करें, गैर-रूट उपयोगकर्ता लागू करें और रेडीनेस जांच को पुनर्स्थापित करें।'
    },
    starter_code: `def launch_triage(config: dict) -> dict:
    issues = []
    
    # Check 1: Must not run as root
    if config.get("user") == "root":
        issues.append("CRITICAL: Container running as root (UID 0)")
        
    # Check 2: Database URL must be present
    if not config.get("database_url"):
        issues.append("CRITICAL: Missing DATABASE_URL")
        
    # Check 3: Readiness decoupled from liveness
    if config.get("liveness_checks_database"):
        issues.append("RISK: Liveness probe checks DB; vulnerable to restart storms")
        
    return {
        "status": "LAUNCH_APPROVED (GO)" if not issues else "LAUNCH_BLOCKED (NO-GO)",
        "issues": issues
    }

# Fix this broken config to pass the boss fight:
hardened_config = {
    "user": "appuser",
    "database_url": "postgresql://user:pass@db:5432/prod",
    "liveness_checks_database": False
}

result = launch_triage(hardened_config)
print(f"Verdict: {result['status']}")
print(f"Issues:  {len(result['issues'])}")`,
    expected_output: `Verdict: LAUNCH_APPROVED (GO)
Issues:  0`,
    hints: {
      en: [
        'Set user to "appuser" (non-root).',
        'Provide a valid database_url.',
        'Set liveness_checks_database to False to avoid cascading restart storms.'
      ],
      'hi-Latn': [
        'User ko "appuser" set karein.',
        'Ek valid database_url provide karein.',
        'liveness_checks_database ko False karein.'
      ],
      hi: [
        'उपयोगकर्ता को "appuser" पर सेट करें।',
        'एक वैध database_url प्रदान करें।',
        'liveness_checks_database को False पर सेट करें।'
      ]
    }
  },

  // ─── 5. Code Escape Room: CI/CD Pipeline Gate Vault ────────────────────────
  {
    id: 'chal-l5-05-escape-room-pipeline',
    slug: 'escape-room-ci-pipeline',
    path_slug: 'python-development',
    level_number: 5,
    module_slug: 'cicd-monitoring-and-operations',
    title: 'Code Escape Room: The CI/CD Verification Vault',
    challenge_type: 'code_escape_room',
    difficulty: 'expert',
    xp_reward: 100,
    tagline: 'Multi-Stage CI Verification Chamber',
    instructions: {
      en: 'Unlock all 4 chambers of the CI Vault by validating linting, strict typing, automated tests, and immutable artifact digests.',
      'hi-Latn': 'CI Vault ke saare 4 chambers unlock karein: linting, strict typing, tests aur artifact digest verify karke.',
      hi: 'लिंटिंग, सख्त टाइपिंग, परीक्षण और अपरिवर्तनीय आर्टिफैक्ट डाइजेस्ट को सत्यापित करके सीआई वॉल्ट के सभी 4 कक्षों को अनलॉक करें।'
    },
    starter_code: `def unlock_ci_vault(stages: dict) -> str:
    unlocked = []
    
    # Chamber 1: Linting
    if stages.get("ruff_clean"):
        unlocked.append("Chamber 1 (Linting): UNLOCKED")
        
    # Chamber 2: Types
    if stages.get("mypy_strict"):
        unlocked.append("Chamber 2 (Types): UNLOCKED")
        
    # Chamber 3: Pytest
    if stages.get("pytest_passed") and stages.get("coverage_pct", 0) >= 90:
        unlocked.append("Chamber 3 (Tests): UNLOCKED")
        
    # Chamber 4: Immutable Digest
    if stages.get("artifact_digest", "").startswith("sha256:"):
        unlocked.append("Chamber 4 (Artifact): UNLOCKED")
        
    if len(unlocked) == 4:
        return "\\n".join(unlocked) + "\\nVAULT FULLY UNLOCKED: ESCAPE SUCCESSFUL!"
    return f"FAILED: Only {len(unlocked)}/4 chambers unlocked."

pipeline_run = {
    "ruff_clean": True,
    "mypy_strict": True,
    "pytest_passed": True,
    "coverage_pct": 92.5,
    "artifact_digest": "sha256:9f8e7d6c5b4a"
}

print(unlock_ci_vault(pipeline_run))`,
    expected_output: `Chamber 1 (Linting): UNLOCKED
Chamber 2 (Types): UNLOCKED
Chamber 3 (Tests): UNLOCKED
Chamber 4 (Artifact): UNLOCKED
VAULT FULLY UNLOCKED: ESCAPE SUCCESSFUL!`,
    hints: {
      en: [
        'Ensure all 4 stages are completed: ruff_clean=True, mypy_strict=True, pytest_passed=True with coverage >= 90, and a sha256 artifact digest.'
      ],
      'hi-Latn': [
        'Saare 4 stages ko satisfy karein: ruff, mypy, pytest coverage >= 90, aur sha256 digest.'
      ],
      hi: [
        'सुनिश्चित करें कि सभी 4 चरण पूरे हो गए हैं: लिंटिंग, टाइपिंग, परीक्षण कवरेज >= 90, और sha256 डाइजेस्ट।'
      ]
    }
  }
];
