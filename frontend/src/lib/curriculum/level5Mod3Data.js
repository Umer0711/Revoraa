// Module 3: Configuration, Security, and Secrets (12 Lessons)
// Comprehensive production security, secrets management, input sanitization, SQL injection prevention, safe logging, least privilege

export const MODULE_3_CONFIG_SECURITY_SECRETS = {
  id: 'mod-l5-3',
  slug: 'configuration-security-and-secrets',
  title: 'Configuration, Security, and Secrets',
  tagline: 'Safeguard Python applications with robust secrets isolation, input sanitization, and security boundaries.',
  description: 'Master secrets hygiene, fail-fast configuration schemas, input validation boundaries, parameterized database security, log masking filters, defense-in-depth error handling, and production security checklists.',
  level_number: 5,
  sort_order: 3,
  is_published: true,
  topics: [
    {
      id: 'top-l5-3-1',
      slug: 'config-and-secrets-hygiene',
      title: 'Configuration Architecture & Secrets Management',
      summary: 'Store configuration in the environment, validate schemas at startup, and manage secrets securely without leaks.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l5-3-1',
          slug: 'application-configuration-principles',
          title: 'Application Configuration Principles',
          summary: 'Understand the hierarchy of configuration, why hardcoded constants cause outages, and the 12-factor config ethos.',
          estimated_minutes: 20,
          xp_reward: 40,
          learning_objectives: [
            'Analyze why hardcoding hostnames, ports, and credentials creates fragile deployments',
            'Define the precedence order of application configuration sources',
            'Establish immutability for runtime configuration objects'
          ],
          content_markdown: `### The Flaw of Hardcoded Configuration

Hardcoding settings directly into Python source files:
\`\`\`python
# DANGEROUS ANTI-PATTERN:
DB_HOST = "10.0.1.42"
API_URL = "https://staging.revoraa.dev"
\`\`\`
This leads to immediate failure when promoting code from staging to production, forcing developers to edit code during deployment.

### The Modern Configuration Precedence Hierarchy

Production systems read settings using a clean hierarchy (highest precedence overrides lower):
1. **CLI Arguments**: \`--port 9000\` (highest priority for one-off overrides)
2. **OS Environment Variables**: \`PORT=9000\` (standard for Docker / Kubernetes)
3. **Local .env File**: For local developer convenience (never committed to git!)
4. **Code Defaults**: Safe local development fallbacks.`,
          code_snippet: `# Simulating hierarchical configuration resolution
def resolve_config_value(cli_val, env_val, default_val):
    if cli_val is not None:
        return cli_val, "CLI_ARG"
    if env_val is not None:
        return env_val, "ENV_VAR"
    return default_val, "DEFAULT"

val, source = resolve_config_value(None, "9090", "8080")
print(f"Resolved Port: {val} (Source: {source})")

val2, source2 = resolve_config_value("4000", "9090", "8080")
print(f"Resolved Port: {val2} (Source: {source2})")`,
          code_language: 'python',
          code_explanation: 'Demonstrates hierarchical resolution where CLI flags take precedence over environment variables, which take precedence over internal defaults.',
          expected_output: `Resolved Port: 9090 (Source: ENV_VAR)
Resolved Port: 4000 (Source: CLI_ARG)`,
          quiz: {
            id: 'quiz-l5-3-1',
            title: 'Config Precedence Check',
            questions: [
              {
                id: 'q-l5-3-1-1',
                question: 'In modern cloud-native architecture, what should have higher precedence: an environment variable or a default value declared in source code?',
                options: [
                  { id: 'opt_1', text: 'The environment variable should override the source code default.' },
                  { id: 'opt_2', text: 'The source code default should always overwrite the environment variable.' },
                  { id: 'opt_3', text: 'Neither; they must always have identical values.' },
                  { id: 'opt_4', text: 'Environment variables cannot be read in cloud environments.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Environment variables are runtime configuration injected by deployment orchestrators (Kubernetes, Docker), and must take precedence over local code defaults.'
              }
            ]
          },
          key_takeaways: [
            'Separate configuration that varies between deploys from invariant code.',
            'Follow clear configuration precedence: CLI > Environment > Defaults.',
            'Never commit credentials, API keys, or production endpoints to version control.'
          ],
          revision_prompts: [
            'Why does committing credentials to a private git repository still constitute a security risk?'
          ]
        },
        {
          id: 'les-l5-3-2',
          slug: 'environment-variables',
          title: 'Working with Environment Variables Securely',
          summary: 'Read, parse, and handle environment variables safely using os.environ and dotenv patterns.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Use os.environ vs os.getenv appropriately',
            'Handle missing keys with KeyError vs safe defaults',
            'Prevent string-to-boolean parsing bugs'
          ],
          content_markdown: `### \`os.environ\` vs \`os.getenv()\`

Python provides two ways to access the environment:

1. **\`os.environ[key]\`**:
   - Raises a \`KeyError\` if the variable is missing.
   - **Best for required configuration** (e.g. database credentials, encryption keys).
2. **\`os.getenv(key, default)\`**:
   - Returns \`default\` (or \`None\`) if missing.
   - **Best for optional configuration** (e.g. log levels, port numbers with defaults).

\`\`\`python
# Required config fails immediately at startup:
DB_PASSWORD = os.environ["DATABASE_PASSWORD"]

# Optional config falls back safely:
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
\`\`\``,
          code_snippet: `# Safe environment loading demonstration
import os

def load_db_config(env_dict: dict) -> dict:
    if "DB_PASS" not in env_dict:
        raise KeyError("Fatal: DB_PASS environment variable is missing!")
    return {
        "host": env_dict.get("DB_HOST", "localhost"),
        "port": int(env_dict.get("DB_PORT", "5432")),
        "pass": env_dict["DB_PASS"]
    }

env = {"DB_PASS": "secret123", "DB_PORT": "5433"}
cfg = load_db_config(env)
print(f"Loaded DB Config: Host={cfg['host']}, Port={cfg['port']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates distinguishing between optional configuration (with sensible defaults) and required configuration that raises KeyError immediately if missing.',
          expected_output: `Loaded DB Config: Host=localhost, Port=5433`,
          quiz: {
            id: 'quiz-l5-3-2',
            title: 'Environment Variables Check',
            questions: [
              {
                id: 'q-l5-3-2-1',
                question: 'When should you use `os.environ["VAR"]` instead of `os.getenv("VAR")`?',
                options: [
                  { id: 'opt_1', text: 'When the variable is mandatory for the application to function, and you want to fail fast with a KeyError if it is missing.' },
                  { id: 'opt_2', text: 'When the variable is an integer.' },
                  { id: 'opt_3', text: 'When running on Windows.' },
                  { id: 'opt_4', text: 'Only inside unittest methods.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Using direct dictionary indexing on os.environ raises a KeyError immediately if a required variable is not set, preventing the app from starting in an invalid state.'
              }
            ]
          },
          key_takeaways: [
            'Use os.environ[key] for required secrets to fail fast at startup.',
            'Use os.getenv(key, default) for optional tuning flags.',
            'Always convert string values to proper Python datatypes (int, bool, float).'
          ],
          revision_prompts: [
            'What happens if an environment variable is set to an empty string ("")?'
          ]
        },
        {
          id: 'les-l5-3-3',
          slug: 'validating-configuration-at-startup',
          title: 'Validating Configuration at Startup: Fail Fast',
          summary: 'Build schema validators that check types, ranges, URLs, and required secrets during application bootstrap.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand the Fail Fast principle in production services',
            'Validate network port ranges, database connection strings, and timeouts',
            'Provide helpful diagnostic error messages on startup validation failures'
          ],
          content_markdown: `### The "Fail Fast" Principle

Imagine an application starts up without validating its configuration. It serves traffic for 3 hours, and then an end user triggers a billing workflow:
\`\`\`
BillingService.charge() -> KeyError: STRIPE_API_KEY not set!
\`\`\`
The application crashes mid-transaction after customers already submitted orders!

**Fail Fast Rule**:
*Validate every configuration parameter, connection string, and secret at the very first millisecond of application startup before accepting a single incoming request.*

If anything is missing or invalid:
1. Log a clear, readable error describing which variable failed.
2. Terminate the process immediately with a non-zero exit code (\`sys.exit(1)\`).`,
          code_snippet: `# Comprehensive startup configuration validator
class ConfigValidationError(Exception):
    pass

def validate_server_config(cfg: dict) -> None:
    errors = []
    
    port = cfg.get("PORT")
    if not isinstance(port, int) or not (1 <= port <= 65535):
        errors.append(f"PORT must be an integer between 1 and 65535, got: {port}")
        
    timeout = cfg.get("TIMEOUT_SECONDS")
    if not isinstance(timeout, (int, float)) or timeout <= 0:
        errors.append(f"TIMEOUT_SECONDS must be positive number, got: {timeout}")
        
    if not cfg.get("SECRET_KEY"):
        errors.append("SECRET_KEY is required and cannot be empty.")
        
    if errors:
        raise ConfigValidationError("\\n".join(errors))

valid_cfg = {"PORT": 8080, "TIMEOUT_SECONDS": 5.0, "SECRET_KEY": "jwt_token_secret"}
validate_server_config(valid_cfg)
print("Configuration validation passed successfully!")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a fail-fast startup validator that checks types, ports, timeouts, and required keys, gathering all errors before raising an exception.',
          expected_output: `Configuration validation passed successfully!`,
          quiz: {
            id: 'quiz-l5-3-3',
            title: 'Fail Fast Check',
            questions: [
              {
                id: 'q-l5-3-3-1',
                question: 'Why is it better for an application to fail with a clear error at startup than to discover a missing configuration setting hours later?',
                options: [
                  { id: 'opt_1', text: 'Startup failures prevent broken deployments from serving user traffic and alert orchestrators (like Kubernetes) to abort the rollout.' },
                  { id: 'opt_2', text: 'Because Python uses more memory if errors occur late.' },
                  { id: 'opt_3', text: 'It prevents the terminal window from closing.' },
                  { id: 'opt_4', text: 'Startup errors are automatically fixed by the operating system.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A startup crash ensures a bad deployment immediately fails its readiness probe, triggering an automatic rollback before users encounter runtime crashes.'
              }
            ]
          },
          key_takeaways: [
            'Validate all environment variables and secrets at application bootstrap.',
            'Gather all validation errors together to give the operator a complete diagnostic report.',
            'Fail fast before binding network ports or accepting traffic.'
          ],
          revision_prompts: [
            'How do Kubernetes readiness and liveness probes interact with a startup validation crash?'
          ]
        },
        {
          id: 'les-l5-3-4',
          slug: 'separating-development-testing-production-settings',
          title: 'Separating Development, Testing, and Production Settings',
          summary: 'Structure configuration classes to guarantee isolation across environments and prevent dev settings in prod.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Design isolated configuration profiles for dev, test, and prod',
            'Prevent debug flags and mock endpoints from running in production',
            'Enforce runtime immutability on loaded settings'
          ],
          content_markdown: `### The Danger of Environment Bleed

A common security breach occurs when developers leave a development convenience flag enabled in production:
\`\`\`python
# ACCIDENTAL LEAK:
DEBUG = True # Enables interactive web debugging console with arbitrary code execution!
\`\`\`

To eliminate environment bleed:
1. Production configurations must require explicit values—**zero default fallbacks for secrets**.
2. Debugging and profiling features must be explicitly guarded:
   \`\`\`python
   if self.environment == "production" and self.debug:
       raise ConfigValidationError("FATAL: DEBUG mode cannot be enabled in production!")
   \`\`\``,
          code_snippet: `# Guarding against insecure configuration in production
class EnvironmentSettings:
    def __init__(self, env_name: str, debug: bool, db_url: str):
        self.env_name = env_name
        self.debug = debug
        self.db_url = db_url
        self._validate()

    def _validate(self):
        if self.env_name == "production":
            if self.debug:
                raise ValueError("SECURITY ALERT: DEBUG mode cannot be enabled in production!")
            if "localhost" in self.db_url or "sqlite" in self.db_url:
                raise ValueError("Production database cannot use localhost or SQLite!")

prod = EnvironmentSettings("production", debug=False, db_url="postgres://db.prod.internal/app")
print(f"Validated environment: {prod.env_name} (Debug: {prod.debug})")`,
          code_language: 'python',
          code_explanation: 'Demonstrates security policy enforcement inside the configuration constructor, actively rejecting insecure settings in production.',
          expected_output: `Validated environment: production (Debug: False)`,
          quiz: {
            id: 'quiz-l5-3-4',
            title: 'Environment Guard Check',
            questions: [
              {
                id: 'q-l5-3-4-1',
                question: 'Why should a configuration validator reject DEBUG=True when the ENVIRONMENT is set to "production"?',
                options: [
                  { id: 'opt_1', text: 'Debug modes often expose interactive consoles, detailed stack traces, internal paths, and secrets to external users.' },
                  { id: 'opt_2', text: 'Because DEBUG is not a valid English word.' },
                  { id: 'opt_3', text: 'Because Python only supports debugging on Thursdays.' },
                  { id: 'opt_4', text: 'It disables internet access.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Debug mode in web frameworks reveals sensitive stack traces, source code snippets, and environment variables to any browser visiting an error page.'
              }
            ]
          },
          key_takeaways: [
            'Explicitly reject dangerous development settings (DEBUG=True, localhost DBs) in production.',
            'Never share credentials across staging and production environments.',
            'Treat configuration validation as the first line of security defense.'
          ],
          revision_prompts: [
            'What is the security risk of sharing the same database password across staging and production?'
          ]
        },
        {
          id: 'les-l5-3-5',
          slug: 'managing-api-keys-and-secrets-safely',
          title: 'Managing API Keys and Secrets Safely',
          summary: 'Handle API credentials using secret managers (AWS Secrets Manager, Vault) and avoid accidental git commits.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand secret sprawl and credential rotation lifecycles',
            'Integrate secret management vaults and cloud parameter stores',
            'Use git-secrets and pre-commit hooks to block credential leaks'
          ],
          content_markdown: `### The Problem of Secret Sprawl

Secrets (API keys, RSA private keys, database passwords) often leak through:
1. Accidental commits to public or private git repositories.
2. Embedding credentials in Docker container image layers.
3. Writing raw credentials to application log files.

### Enterprise Secrets Management Architecture:

\`\`\`
Cloud KMS / HashiCorp Vault / AWS Secrets Manager
   │ (Encrypted at rest)
   ▼ (Injected at runtime via IAM role or container environment)
Container / Application Memory
   │ (Never written to disk, never committed to git)
   ▼
Ephemeral Runtime Execution
\`\`\`

Never hardcode fallback tokens in source code:
\`\`\`python
# FORBIDDEN:
API_KEY = os.getenv("API_KEY", "fallback_test_key_12345")
\`\`\``,
          code_snippet: `# Simulating secrets redaction in memory representations
class SecretString:
    """Wraps sensitive strings to prevent accidental exposure in logs and prints."""
    def __init__(self, raw_value: str):
        self._raw_value = raw_value

    def get_secret_value(self) -> str:
        return self._raw_value

    def __repr__(self) -> str:
        return "SecretString('**********')"

    def __str__(self) -> str:
        return "**********"

api_token = SecretString("sk_live_99482914812491284912")
print(f"Printing the secret object directly: {api_token}")
print(f"String representation: {repr(api_token)}")
print(f"Accessing value explicitly for HTTP call: {api_token.get_secret_value()[:7]}...")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a SecretString wrapper that overrides __repr__ and __str__ to prevent accidental leaks in logging, while allowing explicit value retrieval for authorized API requests.',
          expected_output: `Printing the secret object directly: **********
String representation: SecretString('**********')
Accessing value explicitly for HTTP call: sk_live...`,
          quiz: {
            id: 'quiz-l5-3-5',
            title: 'Secret Masking Check',
            questions: [
              {
                id: 'q-l5-3-5-1',
                question: 'What is the primary benefit of wrapping sensitive API keys in a SecretString class that overrides __repr__ and __str__?',
                options: [
                  { id: 'opt_1', text: 'It prevents the secret from being leaked if the object is accidentally logged or included in an unhandled exception stack trace.' },
                  { id: 'opt_2', text: 'It encrypts the secret using quantum algorithms.' },
                  { id: 'opt_3', text: 'It automatically rotates the secret with the provider.' },
                  { id: 'opt_4', text: 'It allows the secret to be used without an internet connection.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Overriding __repr__ and __str__ ensures that calling print(obj) or logging an object prints "**********" instead of exposing plaintext credentials in log files.'
              }
            ]
          },
          key_takeaways: [
            'Use SecretString wrappers to protect sensitive tokens in logs and traces.',
            'Never commit credentials to git; use pre-commit hooks to detect secrets.',
            'Fetch production secrets from dedicated vaults or IAM-authenticated cloud parameter stores.'
          ],
          revision_prompts: [
            'Why does deleting a committed secret in a new commit still leave it exposed in git history?'
          ]
        }
      ]
    },
    {
      id: 'top-l5-3-2',
      slug: 'defense-in-depth-practices',
      title: 'Defense in Depth: Inputs, SQL, Logging & Least Privilege',
      summary: 'Prevent SQL injection with parameterized queries, sanitize inputs, mask logs, and enforce least privilege.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l5-3-6',
          slug: 'input-validation-and-trust-boundaries',
          title: 'Input Validation and Trust Boundaries',
          summary: 'Enforce strict schema validation at system boundaries before processing untrusted input.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Identify trust boundaries (HTTP requests, message queues, webhooks)',
            'Apply whitelist validation over blacklist filtering',
            'Validate string lengths, encodings, and numerical ranges'
          ],
          content_markdown: `### Never Trust External Input

Every byte entering your application from HTTP bodies, URL query parameters, headers, and message queues is **untrusted**.

### Whitelist vs Blacklist Validation

- **Blacklist Validation (Weak)**: Trying to strip out forbidden characters (e.g. \`<script>\`, \`OR 1=1\`). Attackers always find creative ways to bypass blacklists using Unicode, hex, or alternate encodings!
- **Whitelist Validation (Strong)**: Define the exact schema, types, and allowed patterns. Reject anything that does not strictly match.

\`\`\`python
# WHITELIST VALIDATION:
import re

def validate_username(username: str) -> str:
    username = username.strip()
    if not (3 <= len(username) <= 20):
        raise ValueError("Username must be between 3 and 20 characters")
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        raise ValueError("Username contains forbidden characters")
    return username
\`\`\``,
          code_snippet: `import re

def validate_transfer_payload(payload: dict) -> dict:
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a dictionary")
        
    recipient = payload.get("recipient_account", "")
    if not re.match(r"^ACC-[0-9]{6}$", recipient):
        raise ValueError("Invalid account format. Expected ACC-XXXXXX")
        
    amount = payload.get("amount_cents")
    if not isinstance(amount, int) or amount <= 0 or amount > 1_000_000_00:
        raise ValueError("Invalid amount. Must be positive integer <= 1,000,000.00")
        
    return {"recipient": recipient, "amount_cents": amount}

valid = validate_transfer_payload({"recipient_account": "ACC-123456", "amount_cents": 5000})
print(f"Validated Transaction: {valid}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates strict whitelist schema validation checking account formatting and integer boundary constraints.',
          expected_output: `Validated Transaction: {'recipient': 'ACC-123456', 'amount_cents': 5000}`,
          quiz: {
            id: 'quiz-l5-3-6',
            title: 'Trust Boundary Check',
            questions: [
              {
                id: 'q-l5-3-6-1',
                question: 'Why is whitelist validation fundamentally more secure than blacklist validation for user input?',
                options: [
                  { id: 'opt_1', text: 'Whitelist validation only accepts known-good patterns, whereas blacklists inevitably overlook creative encoding bypasses.' },
                  { id: 'opt_2', text: 'Whitelist validation runs 1000x faster.' },
                  { id: 'opt_3', text: 'Blacklists require C compilation.' },
                  { id: 'opt_4', text: 'Whitelist validation does not require regular expressions.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Blacklists fail because attackers constantly find alternative syntax, alternate encodings, or parser differences. Whitelists only admit strictly permitted data.'
              }
            ]
          },
          key_takeaways: [
            'Validate untrusted input at the boundary before passing to domain services.',
            'Prefer strict whitelist schema validation over blacklist filtering.',
            'Enforce length limits to prevent denial-of-service memory exhaustion.'
          ],
          revision_prompts: [
            'What is a ReDoS (Regular Expression Denial of Service) attack?'
          ]
        },
        {
          id: 'les-l5-3-7',
          slug: 'secure-database-access',
          title: 'Secure Database Access: Preventing SQL Injection',
          summary: 'Use parameterized queries and prepared statements exclusively to guarantee immunity from SQL injection.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand how string formatting (f-strings, %) causes SQL injection',
            'Use parameterized queries across SQLite, PostgreSQL, and ORMs',
            'Distinguish SQL query structure from literal query parameters'
          ],
          content_markdown: `### The Anatomy of SQL Injection

SQL injection occurs when user input is concatenated into the SQL statement string:
\`\`\`python
# CATASTROPHIC VULNERABILITY:
query = f"SELECT * FROM users WHERE email = '{user_input}'"
# If user_input is: ' OR 1=1 --
# The query becomes:
# SELECT * FROM users WHERE email = '' OR 1=1 --'
\`\`\`
The database executes the attacker's code, leaking every record in the table!

### The Immunity: Parameterized Queries

Never concatenate strings to build SQL queries. Instead, pass parameters separately to the database driver:
\`\`\`python
# 100% IMMUNE TO SQL INJECTION:
cursor.execute("SELECT * FROM users WHERE email = ?", (user_input,))
\`\`\`
The database compiles the SQL query structure **first**, and treats \`user_input\` strictly as literal data—no matter what characters it contains!`,
          code_snippet: `import sqlite3

def run_secure_query(db_conn, search_email: str) -> list:
    cursor = db_conn.cursor()
    # Parameterized query with ? placeholder
    cursor.execute("SELECT id, email, role FROM users WHERE email = ?", (search_email,))
    return cursor.fetchall()

# Setup in-memory mock DB
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (id INT, email TEXT, role TEXT)")
conn.execute("INSERT INTO users VALUES (1, 'alice@revoraa.dev', 'admin')")
conn.execute("INSERT INTO users VALUES (2, 'bob@revoraa.dev', 'user')")

# Attacker attempts injection:
malicious_input = "' OR '1'='1"
results = run_secure_query(conn, malicious_input)
print(f"Search results for injection payload: {results} (Safe! Zero records leaked)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates parameterized query execution. The malicious SQL injection payload is treated as a literal search string, safely returning zero records.',
          expected_output: `Search results for injection payload: [] (Safe! Zero records leaked)`,
          quiz: {
            id: 'quiz-l5-3-7',
            title: 'SQL Injection Check',
            questions: [
              {
                id: 'q-l5-3-7-1',
                question: 'Why does using a parameterized query (e.g. cursor.execute("SELECT * FROM u WHERE id = ?", (user_id,))) protect against SQL injection?',
                options: [
                  { id: 'opt_1', text: 'The database compiles the SQL query structure before binding parameters, treating parameter values strictly as literal data rather than executable SQL syntax.' },
                  { id: 'opt_2', text: 'It strips all punctuation from the string.' },
                  { id: 'opt_3', text: 'It runs the query in a Docker container.' },
                  { id: 'opt_4', text: 'It forces the database to use SSL encryption.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Prepared statements separate code from data. The query plan is pre-compiled, making it structurally impossible for user input to alter SQL syntax.'
              }
            ]
          },
          key_takeaways: [
            'Never use f-strings or string concatenation to build SQL statements.',
            'Always use driver parameter substitution (? or %s).',
            'Code linters like bandit actively flag un-parameterized SQL queries in CI.'
          ],
          revision_prompts: [
            'Can SQL injection still happen when using an ORM like SQLAlchemy?'
          ]
        },
        {
          id: 'les-l5-3-8',
          slug: 'dependency-vulnerability-awareness',
          title: 'Dependency Vulnerability Awareness and CVE Scanning',
          summary: 'Audit third-party libraries for known CVEs using pip-audit, Dependabot, and automated vulnerability alerts.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand Common Vulnerabilities and Exposures (CVE) and CVSS scores',
            'Run pip-audit and safety scans in automated pipelines',
            'Triage and remediate dependency vulnerability advisories'
          ],
          content_markdown: `### Software Composition Analysis (SCA)

Over 80% of a production application's code typically comes from open-source dependencies. When a vulnerability is discovered in a library like \`cryptography\` or \`urllib3\`, a **CVE identifier** (e.g. CVE-2023-45803) is registered.

### Scanning with \`pip-audit\`

\`pip-audit\` queries the Open Source Vulnerability (OSV) database to inspect your installed packages:
\`\`\`bash
# Run audit against your virtual environment:
pip-audit

# Or audit a locked requirements file:
pip-audit -r requirements.lock
\`\`\`

If a critical vulnerability is found, the tool exits with a non-zero code, failing your CI pipeline before vulnerable code is deployed to production!`,
          code_snippet: `# Simulating vulnerability report triage
def evaluate_cve_severity(cve_report: list) -> dict:
    has_critical = any(item["cvss"] >= 9.0 for item in cve_report)
    has_high = any(7.0 <= item["cvss"] < 9.0 for item in cve_report)
    return {
        "total_cves": len(cve_report),
        "block_deployment": has_critical or has_high,
        "critical_count": sum(1 for item in cve_report if item["cvss"] >= 9.0)
    }

mock_report = [
    {"package": "old_lib", "version": "1.0", "cve": "CVE-2023-9999", "cvss": 9.8}
]

status = evaluate_cve_severity(mock_report)
print(f"Vulnerability Audit Status: {status}")
print(f"Deployment Blocked: {status['block_deployment']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates security policy evaluation that blocks automated deployment pipelines when critical or high CVSS vulnerabilities are detected.',
          expected_output: `Vulnerability Audit Status: {'total_cves': 1, 'block_deployment': True, 'critical_count': 1}
Deployment Blocked: True`,
          quiz: {
            id: 'quiz-l5-3-8',
            title: 'CVE Scanning Check',
            questions: [
              {
                id: 'q-l5-3-8-1',
                question: 'What is the purpose of running pip-audit or Dependabot in a CI/CD pipeline?',
                options: [
                  { id: 'opt_1', text: 'To automatically cross-reference project dependencies against public vulnerability databases and alert on known CVEs.' },
                  { id: 'opt_2', text: 'To format code according to PEP 8.' },
                  { id: 'opt_3', text: 'To test if the server hard drive is full.' },
                  { id: 'opt_4', text: 'To speed up Python execution time.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'SCA tools like pip-audit check dependency versions against the OSV and PyPA advisory databases to catch security vulnerabilities before production release.'
              }
            ]
          },
          key_takeaways: [
            'Regularly audit project dependencies against public CVE databases.',
            'Automate dependency vulnerability scanning in CI/CD quality gates.',
            'Keep lockfiles updated to receive security patches promptly.'
          ],
          revision_prompts: [
            'What is the difference between a direct dependency CVE and a transitive dependency CVE?'
          ]
        },
        {
          id: 'les-l5-3-9',
          slug: 'logging-without-leaking-sensitive-information',
          title: 'Logging Without Leaking Sensitive Information',
          summary: 'Build custom logging filters to automatically mask credit cards, passwords, and tokens before log emission.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Identify sensitive fields in log streams (PII, credentials, bearer tokens)',
            'Implement custom logging.Filter classes to scrub sensitive data',
            'Comply with privacy regulations (GDPR, PCI-DSS)'
          ],
          content_markdown: `### Log Sanitation and PII

Logs are stored in centralized observability systems (Datadog, Elastic, CloudWatch) where dozens of developers and support staff have access. If your code logs:
\`\`\`python
# SECURITY VIOLATION:
logger.info(f"Processing payment for card: {card_number}")
\`\`\`
You have violated PCI-DSS and exposed customer financial data!

### Building a Log Sanitizer Filter

In Python's standard \`logging\` module, a **\`logging.Filter\`** can inspect and mutate the log record message before it is written:
\`\`\`python
class RedactingFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            record.msg = mask_sensitive_patterns(record.msg)
        return True
\`\`\``,
          code_snippet: `import re
import logging

class MaskingLogFilter(logging.Filter):
    # Regex matching 16-digit card numbers or Bearer tokens
    CARD_PATTERN = re.compile(r"\b(?:\d{4}[- ]?){3}\d{4}\b")
    TOKEN_PATTERN = re.compile(r"(Bearer\s+)[A-Za-z0-9_\-\.]{10,}", re.IGNORECASE)

    def filter(self, record: logging.LogRecord) -> bool:
        msg = str(record.msg)
        msg = self.CARD_PATTERN.sub("****-****-****-****", msg)
        msg = self.TOKEN_PATTERN.sub(r"\\1[REDACTED_TOKEN]", msg)
        record.msg = msg
        return True

# Test logger
logger = logging.getLogger("security_test")
logger.setLevel(logging.INFO)
log_filter = MaskingLogFilter()
logger.addFilter(log_filter)

# Simulate log record creation:
record = logging.LogRecord("test", logging.INFO, "", 0, "User authorization: Bearer eyJhbGciOiJIUzI1NiJ9", (), None)
log_filter.filter(record)
print(f"Sanitized log message: {record.msg}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a custom logging filter that redacts sensitive Bearer tokens and credit card patterns from log messages before emission.',
          expected_output: `Sanitized log message: User authorization: Bearer [REDACTED_TOKEN]`,
          quiz: {
            id: 'quiz-l5-3-9',
            title: 'Log Sanitization Check',
            questions: [
              {
                id: 'q-l5-3-9-1',
                question: 'Where should log sanitization filters be attached in a Python logging pipeline?',
                options: [
                  { id: 'opt_1', text: 'To logger instances or log handlers so all messages are scrubbed before reaching file or network destinations.' },
                  { id: 'opt_2', text: 'Only in the terminal print() function.' },
                  { id: 'opt_3', text: 'Inside the database driver.' },
                  { id: 'opt_4', text: 'Log filters are not supported in Python.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Attaching logging.Filter to loggers or handlers ensures all emitted log records are automatically scrubbed, preventing human error from leaking credentials.'
              }
            ]
          },
          key_takeaways: [
            'Centralized logs must never contain passwords, tokens, or PII.',
            'Use custom logging.Filter implementations to scrub sensitive patterns.',
            'Comply with data privacy standards by actively masking payment and identity data.'
          ],
          revision_prompts: [
            'What is the risk of logging an entire request dictionary (e.g. logger.info(request.data))?'
          ]
        },
        {
          id: 'les-l5-3-10',
          slug: 'secure-error-handling',
          title: 'Secure Error Handling and Preventing Information Leakage',
          summary: 'Handle exceptions gracefully without exposing internal database schemas, stack traces, or file paths to end users.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Distinguish internal diagnostic logs from user-facing error responses',
            'Prevent stack trace leakage in HTTP APIs',
            'Return generic error messages with correlation tracking IDs'
          ],
          content_markdown: `### The Vulnerability of Verbose Error Messages

When an exception occurs in an un-guarded backend:
\`\`\`
HTTP 500 Internal Server Error
Traceback (most recent call last):
  File "/var/app/backend/db.py", line 42, in query
    psycopg2.OperationalError: FATAL: password authentication failed for user "postgres_admin"
    Server: 10.0.4.12
\`\`\`
The attacker now knows your internal server IP, database username, and filesystem path structure!

### The Secure Error Handling Pattern:

1. **Log internally**: Write the full exception and stack trace to your secure server logs with a \`correlation_id\`.
2. **Respond externally**: Return a clean, generic response to the user containing only the reference ID:
   \`\`\`json
   {
       "error": "An internal error occurred while processing your request.",
       "request_id": "req-99a8b1c4"
   }
   \`\`\``,
          code_snippet: `import uuid

def handle_request_safely(process_fn) -> dict:
    req_id = str(uuid.uuid4())[:8]
    try:
        return {"status": "SUCCESS", "data": process_fn()}
    except Exception as exc:
        # Internal log record:
        internal_log = f"[ERROR][{req_id}] Internal failure: {type(exc).__name__}: {exc}"
        
        # User-facing sanitization:
        user_response = {
            "status": "ERROR",
            "message": "An unexpected error occurred. Please contact support with this Request ID.",
            "request_id": req_id
        }
        return user_response

def flawed_internal_action():
    raise ConnectionRefusedError("psql: could not connect to server at 10.240.0.1:5432")

resp = handle_request_safely(flawed_internal_action)
print(f"Response sent to external user: {resp}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates secure exception shielding: internal database errors are trapped, sanitized, and replaced with safe generic user responses tied to correlation IDs.',
          expected_output: `Response sent to external user: {'status': 'ERROR', 'message': 'An unexpected error occurred. Please contact support with this Request ID.', 'request_id': '45', 'request_id': '...' }`,
          quiz: {
            id: 'quiz-l5-3-10',
            title: 'Exception Shielding Check',
            questions: [
              {
                id: 'q-l5-3-10-1',
                question: 'Why should public web API endpoints never return raw Python tracebacks or database error strings to clients?',
                options: [
                  { id: 'opt_1', text: 'Raw stack traces reveal internal filesystem paths, software versions, database topologies, and user names to potential attackers.' },
                  { id: 'opt_2', text: 'Because JSON does not support strings containing newlines.' },
                  { id: 'opt_3', text: 'Because tracebacks increase bandwidth costs by 500%.' },
                  { id: 'opt_4', text: 'It triggers automatic browser crashes.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Detailed stack traces provide attackers with internal reconnaissance information (paths, libraries, database types, internal IPs) that facilitates exploitation.'
              }
            ]
          },
          key_takeaways: [
            'Log detailed stack traces internally to secure log systems.',
            'Return generic, user-friendly error messages to API consumers.',
            'Pair external error messages with correlation IDs so support engineers can look up internal logs.'
          ],
          revision_prompts: [
            'How does an exception barrier at the web framework middleware level protect an API?'
          ]
        },
        {
          id: 'les-l5-3-11',
          slug: 'least-privilege-and-access-control',
          title: 'Least Privilege and Access Control',
          summary: 'Apply the principle of least privilege to database roles, file permissions, and API tokens.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand the Principle of Least Privilege in application architecture',
            'Scope database credentials (avoiding superuser/postgres admin for web apps)',
            'Configure fine-grained read-only vs read-write permissions'
          ],
          content_markdown: `### The Principle of Least Privilege (PoLP)

Every process, user, and module must possess **only the minimum capabilities** necessary to complete its function.

### Real-World Applications:
1. **Database Credentials**:
   - Web apps should connect with a role that only has \`SELECT, INSERT, UPDATE\` on specific tables.
   - Never run your web application with the database \`postgres\` or \`root\` superuser role! If an injection bug exists, the superuser could drop the entire database cluster!
2. **Filesystem Access**:
   - Web servers should only have write permissions on designated temporary or upload folders.
3. **API Tokens**:
   - Use scoped tokens (e.g. read-only tokens for reporting services).`,
          code_snippet: `# Simulating permission verification with least privilege checks
class DatabaseRole:
    def __init__(self, name: str, allowed_actions: set):
        self.name = name
        self.allowed_actions = allowed_actions

    def can_perform(self, action: str) -> bool:
        return action.upper() in self.allowed_actions

# Role definitions
app_user_role = DatabaseRole("web_app", {"SELECT", "INSERT", "UPDATE"})

print(f"Can web app read data: {app_user_role.can_perform('SELECT')}")
print(f"Can web app execute DROP TABLE: {app_user_role.can_perform('DROP')}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates role-based least privilege enforcement where dangerous administrative operations like DROP are strictly excluded from the web application role.',
          expected_output: `Can web app read data: True
Can web app execute DROP TABLE: False`,
          quiz: {
            id: 'quiz-l5-3-11',
            title: 'Least Privilege Check',
            questions: [
              {
                id: 'q-l5-3-11-1',
                question: 'Why should a web application never connect to PostgreSQL using the "postgres" superuser account in production?',
                options: [
                  { id: 'opt_1', text: 'If the application is compromised, the superuser account grants full access to create users, drop databases, read all tables, and even execute shell commands.' },
                  { id: 'opt_2', text: 'Because PostgreSQL superusers cannot execute SELECT queries.' },
                  { id: 'opt_3', text: 'Because superuser connections are capped at 2 simultaneous connections.' },
                  { id: 'opt_4', text: 'It is illegal in all countries.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Limiting the application to a dedicated, restricted role contains the blast radius of any security breach, preventing attackers from modifying system catalogs or dropping tables.'
              }
            ]
          },
          key_takeaways: [
            'Enforce least privilege: never use superuser or admin credentials for web services.',
            'Scope API tokens and database roles to minimum necessary permissions.',
            'Defense in depth assumes vulnerabilities exist and minimizes the blast radius.'
          ],
          revision_prompts: [
            'How can database migrations run with a higher-privileged user while the running app uses a restricted user?'
          ]
        },
        {
          id: 'les-l5-3-12',
          slug: 'creating-a-production-readiness-security-checklist',
          title: 'The Production Security Readiness Checklist',
          summary: 'Review and audit an application against an end-to-end production security readiness checklist.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Synthesize all Level 5 security principles into an actionable audit protocol',
            'Conduct automated static security analysis using Bandit',
            'Sign off on a deployment security review'
          ],
          content_markdown: `### The Production Security Audit Checklist

Before releasing any Python service to production, complete this formal security sign-off:

1. **Secrets Isolation**: No plaintext secrets in source code, commit history, or Dockerfiles.
2. **Config Validation**: Startup schema validation fails fast on missing or invalid variables.
3. **Input Sanitization**: Whitelist validation at all public API endpoints and trust boundaries.
4. **Database Safety**: 100% of database queries use parameterized placeholders or ORM bindings.
5. **Dependency Audit**: \`pip-audit\` reports 0 critical or high CVE vulnerabilities.
6. **Log Sanitization**: Logging filters actively scrub authorization tokens, credit cards, and passwords.
7. **Error Shielding**: Public API errors return generic error messages with correlation tracking IDs.
8. **Least Privilege**: Application runs under an unprivileged OS user and a scoped database role.`,
          code_snippet: `# Automated production security audit checklist evaluator
def evaluate_security_readiness(audit_items: dict) -> dict:
    failed = [item for item, passed in audit_items.items() if not passed]
    return {
        "is_production_ready": len(failed) == 0,
        "failed_audits": failed,
        "score_percent": round(((len(audit_items) - len(failed)) / len(audit_items)) * 100, 1)
    }

audit = {
    "zero_hardcoded_secrets": True,
    "parameterized_queries": True,
    "cve_scan_passed": True,
    "log_sanitization_active": True,
    "error_shielding_verified": True,
    "unprivileged_runtime_user": True
}

report = evaluate_security_readiness(audit)
print(f"Security Readiness Approved: {report['is_production_ready']}")
print(f"Audit Score: {report['score_percent']}%")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a comprehensive production security audit check verifying all eight foundational defense-in-depth criteria.',
          expected_output: `Security Readiness Approved: True
Audit Score: 100.0%`,
          quiz: {
            id: 'quiz-l5-3-12',
            title: 'Security Readiness Check',
            questions: [
              {
                id: 'q-l5-3-12-1',
                question: 'What static analysis security tool is standard in Python CI pipelines to automatically detect issues like hardcoded passwords, SQL injection, and insecure cryptographic ciphers?',
                options: [
                  { id: 'opt_1', text: 'Bandit' },
                  { id: 'opt_2', text: 'Black' },
                  { id: 'opt_3', text: 'Pygame' },
                  { id: 'opt_4', text: 'Celery' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Bandit is the industry-standard AST security scanner for Python, flagging vulnerabilities like hardcoded credentials, un-parameterized SQL, and unsafe eval() usage.'
              }
            ]
          },
          key_takeaways: [
            'Complete a formal security checklist prior to production deployment.',
            'Automate security checks in CI using Bandit, pip-audit, and secret scanners.',
            'Security is not an afterthought; it is an architectural foundation.'
          ],
          revision_prompts: [
            'What is the difference between DAST (dynamic testing) and SAST (static analysis) in security engineering?'
          ]
        }
      ]
    }
  ]
};
