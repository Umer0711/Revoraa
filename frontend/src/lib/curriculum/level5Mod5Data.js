// Module 5: APIs, Databases, and Production Reliability (12 Lessons)
// Comprehensive production service engineering, migrations, connection pools, idempotency, rate limiting, graceful shutdown, circuit breakers

export const MODULE_5_APIS_DATABASES_RELIABILITY = {
  id: 'mod-l5-5',
  slug: 'apis-databases-and-production-reliability',
  title: 'APIs, Databases, and Production Reliability',
  tagline: 'Engineer high-throughput, fault-tolerant services with connection pooling, migrations, and graceful degradation.',
  description: 'Master API contract validation, JWT/RBAC security, database migrations with Alembic, connection pool lifecycle, idempotency key deduplication, token-bucket rate limiting, graceful SIGTERM shutdowns, and circuit breakers.',
  level_number: 5,
  sort_order: 5,
  is_published: true,
  topics: [
    {
      id: 'top-l5-5-1',
      slug: 'api-contracts-and-persistence',
      title: 'API Contracts, Auth & Database Lifecycle',
      summary: 'Design strict request/response contracts, secure auth boundaries, manage database migrations, and configure connection pools.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l5-5-1',
          slug: 'designing-reliable-api-boundaries',
          title: 'Designing Reliable API Boundaries',
          summary: 'Structure clean RESTful API boundaries, versioning strategies (URI vs header), and standard HTTP semantics.',
          estimated_minutes: 20,
          xp_reward: 40,
          learning_objectives: [
            'Design resource-oriented RESTful API endpoints',
            'Adopt URL path versioning (/v1/resources) to prevent breaking callers',
            'Map domain outcomes to standard HTTP status codes (200, 201, 400, 404, 409, 500)'
          ],
          content_markdown: `### The Golden Rules of Production APIs

An API is a binding contract between your service and client applications (mobile apps, web frontends, third-party partners).

### Key Architectural Guidelines:
1. **Explicit Versioning**: Always version public endpoints in the path (e.g. \`/api/v1/telemetry\`). This allows deploying \`/api/v2\` side-by-side without breaking existing mobile clients.
2. **Correct HTTP Semantics**:
   - \`GET\`: Safe, idempotent data retrieval. Zero side effects.
   - \`POST\`: Resource creation or action execution (non-idempotent).
   - \`PUT\`: Complete resource replacement (idempotent).
   - \`PATCH\`: Partial resource update (idempotent).
   - \`DELETE\`: Resource removal (idempotent).
3. **Structured Response Envelopes**: Maintain predictable JSON response shapes across all endpoints.`,
          code_snippet: `# Simulating standard API response envelope generation
def create_api_response(data=None, error_msg: str = None, status_code: int = 200) -> dict:
    return {
        "success": 200 <= status_code < 300,
        "status_code": status_code,
        "data": data if error_msg is None else None,
        "error": {"message": error_msg} if error_msg else None
    }

print("Happy Path Response:")
print(create_api_response(data={"user_id": 42, "name": "Aarav"}, status_code=200))

print("\\nError Path Response:")
print(create_api_response(error_msg="Resource not found", status_code=404))`,
          code_language: 'python',
          code_explanation: 'Demonstrates a standardized JSON response envelope providing consistent structure for both success and error responses.',
          expected_output: `Happy Path Response:
{'success': True, 'status_code': 200, 'data': {'user_id': 42, 'name': 'Aarav'}, 'error': None}

Error Path Response:
{'success': False, 'status_code': 404, 'data': None, 'error': {'message': 'Resource not found'}}`,
          quiz: {
            id: 'quiz-l5-5-1',
            title: 'API Boundaries Check',
            questions: [
              {
                id: 'q-l5-5-1-1',
                question: 'Why should public APIs include explicit versioning in the URL path (such as /v1/users)?',
                options: [
                  { id: 'opt_1', text: 'To allow the service to introduce breaking architectural changes in /v2/users without abruptly breaking older mobile apps or third-party integrations.' },
                  { id: 'opt_2', text: 'Because HTTP does not work without a version number.' },
                  { id: 'opt_3', text: 'To encrypt the URL query string.' },
                  { id: 'opt_4', text: 'To prevent web browsers from caching responses.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'URL path versioning allows backwards-incompatible contract changes to be released on a new path while existing clients continue functioning uninterrupted.'
              }
            ]
          },
          key_takeaways: [
            'Always version public API surfaces to safeguard client compatibility.',
            'Adhere strictly to HTTP method semantics and status code conventions.',
            'Return consistent response envelope structures for both success and error paths.'
          ],
          revision_prompts: [
            'What is the difference between HTTP 400 Bad Request and HTTP 422 Unprocessable Entity?'
          ]
        },
        {
          id: 'les-l5-5-2',
          slug: 'request-validation-and-response-contracts',
          title: 'Request Validation and Response Contracts',
          summary: 'Enforce type-safe request parsing and response contracts using Pydantic schemas and dataclasses.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Validate incoming JSON payloads against strict schemas',
            'Filter internal database attributes (like password hashes) out of response models',
            'Handle serialization of datetime, UUID, and decimal types'
          ],
          content_markdown: `### Input Validation vs Output Filtering

Schema validation performs two critical security jobs:
1. **Inbound (Request)**: Validates that required fields are present, types match, and values fall within safe ranges before your business logic runs.
2. **Outbound (Response)**: Explicitly serializes only the intended fields, **preventing accidental leakage of internal data** (e.g. database IDs, salt hashes, internal flags).

\`\`\`python
# Request Schema:
class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

# Response Schema (NOTICE: password is never returned!):
class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime
\`\`\``,
          code_snippet: `# Simulating request parsing and response serialization filtering
class MockUser:
    def __init__(self, uid: str, email: str, password_hash: str):
        self.uid = uid
        self.email = email
        self.password_hash = password_hash  # INTERNAL SECRET

def serialize_user_response(user: MockUser) -> dict:
    """Strict response contract that omits sensitive internal attributes."""
    return {
        "user_id": user.uid,
        "email": user.email
    }

user = MockUser("usr_99", "aarav@revoraa.dev", "argon2id$v=19$m=65536,t=3,p=4$secret_hash")
safe_json = serialize_user_response(user)
print(f"Safe Public Response: {safe_json}")
print(f"Is password hash excluded: {'password_hash' not in safe_json}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates response contract filtering, guaranteeing that internal attributes like password hashes are strictly excluded from client-facing payloads.',
          expected_output: `Safe Public Response: {'user_id': 'usr_99', 'email': 'aarav@revoraa.dev'}
Is password hash excluded: True`,
          quiz: {
            id: 'quiz-l5-5-2',
            title: 'Response Contracts Check',
            questions: [
              {
                id: 'q-l5-5-2-1',
                question: 'Why should an API use an explicit response model rather than directly returning the database ORM object as JSON?',
                options: [
                  { id: 'opt_1', text: 'Directly serializing ORM objects frequently leaks internal fields (such as password_hash, internal audit flags, or soft-delete tokens) to clients.' },
                  { id: 'opt_2', text: 'Because ORM objects cannot be converted to text.' },
                  { id: 'opt_3', text: 'Because JSON only supports 3 keys per object.' },
                  { id: 'opt_4', text: 'It slows down the database connection.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Dedicated response models act as an explicit data firewall, ensuring only explicitly permitted public fields are serialized to the network.'
              }
            ]
          },
          key_takeaways: [
            'Validate incoming JSON at the edge before invoking domain services.',
            'Use explicit response schemas to prevent accidental data leakage.',
            'Never serialize internal database models directly to public HTTP responses.'
          ],
          revision_prompts: [
            'How does Pydantic v2 achieve high serialization performance using Rust under the hood?'
          ]
        },
        {
          id: 'les-l5-5-3',
          slug: 'authentication-and-authorization-fundamentals',
          title: 'Authentication and Authorization Fundamentals',
          summary: 'Implement secure Bearer JWT token verification and Role-Based Access Control (RBAC).',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Differentiate Authentication (who you are) from Authorization (what you can do)',
            'Verify signed JSON Web Tokens (JWT) including expiry (exp) and issuer (iss)',
            'Implement Role-Based Access Control (RBAC) guard decorators'
          ],
          content_markdown: `### Authentication vs Authorization

- **Authentication (AuthN)**: "Who are you?" (Verifying identity via password, OAuth, or Bearer JWT).
- **Authorization (AuthZ)**: "What are you permitted to do?" (Checking if user has the \`admin\` role or \`billing:write\` permission).

### JSON Web Token (JWT) Anatomy

\`\`\`
eyJhbGciOiJIUzI1Ni... . eyJzdWIiOiIxMjM0... . SflKxwRJSMeKKF2...
    [HEADER]                   [PAYLOAD]              [SIGNATURE]
Algorithm: HS256         sub: user_101          Cryptographic proof
                         role: member           ensuring payload
                         exp: 1718000000        was not tampered with!
\`\`\`

Always verify:
1. **Signature**: Validates that the token was minted by your secret key.
2. **Expiration (\`exp\`)**: Rejects expired tokens.
3. **Issuer (\`iss\`)**: Matches expected identity provider.`,
          code_snippet: `# Simulating token verification and RBAC permission check
import time

def verify_mock_token(token_payload: dict, required_role: str = None) -> dict:
    current_time = time.time()
    # 1. Verify expiry
    if token_payload.get("exp", 0) < current_time:
        raise PermissionError("Token has expired")
        
    # 2. Verify RBAC permissions
    user_role = token_payload.get("role", "guest")
    if required_role and user_role != required_role:
        raise PermissionError(f"Forbidden: Requires '{required_role}' role, but user has '{user_role}'")
        
    return {"user_id": token_payload["sub"], "role": user_role}

valid_token = {"sub": "usr_42", "role": "admin", "exp": time.time() + 3600}
auth = verify_mock_token(valid_token, required_role="admin")
print(f"Authenticated and Authorized: {auth}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates token claims verification, checking expiration timestamps and enforcing role-based access control.',
          expected_output: `Authenticated and Authorized: {'user_id': 'usr_42', 'role': 'admin'}`,
          quiz: {
            id: 'quiz-l5-5-3',
            title: 'Auth & RBAC Check',
            questions: [
              {
                id: 'q-l5-5-3-1',
                question: 'What is the crucial difference between Authentication and Authorization?',
                options: [
                  { id: 'opt_1', text: 'Authentication verifies identity (who you are), while Authorization verifies permissions (what you are allowed to access).' },
                  { id: 'opt_2', text: 'Authentication is for mobile apps; Authorization is for web apps.' },
                  { id: 'opt_3', text: 'Authentication uses SQL; Authorization uses JSON.' },
                  { id: 'opt_4', text: 'They are completely identical synonyms.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Authentication establishes proof of user identity. Authorization enforces access policies deciding whether that identified user can access a specific resource.'
              }
            ]
          },
          key_takeaways: [
            'Separate identity authentication from permission authorization.',
            'Cryptographically verify JWT signatures and expiration timestamps.',
            'Enforce RBAC guards at the endpoint and service boundary.'
          ],
          revision_prompts: [
            'Why should sensitive secrets never be stored in the unencrypted payload of a JWT?'
          ]
        },
        {
          id: 'les-l5-5-4',
          slug: 'database-schema-evolution-and-migrations',
          title: 'Database Schema Evolution and Migrations with Alembic',
          summary: 'Manage reproducible relational schema changes using forward migrations and rollback scripts.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand schema versioning under database migration tools (Alembic, Flyway)',
            'Author reversible migrations with upgrade() and downgrade() functions',
            'Avoid destructive non-reversible migrations in production'
          ],
          content_markdown: `### Why Manual Database Changes Cause Disasters

If an engineer manually runs \`ALTER TABLE users ADD COLUMN phone TEXT;\` in production:
- Other developers' local environments lack the column.
- CI automated test databases lack the column.
- There is zero version history or rollback plan!

### The Migration Philosophy:
Every database schema change must be:
1. **Written as code**: Checked into git alongside application logic.
2. **Reversible**: Defines an \`upgrade()\` action and an exact \`downgrade()\` rollback.
3. **Sequential**: Tracked by a schema version table (e.g. \`alembic_version\`).

\`\`\`python
# Alembic Migration Example:
def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))

def downgrade():
    op.drop_column("users", "phone")
\`\`\``,
          code_snippet: `# Simulating a database migration runner tracking versions
class MigrationManager:
    def __init__(self):
        self.applied_versions = []
        self.schema = {"users": ["id", "email"]}

    def apply_migration(self, version: str, upgrade_fn):
        upgrade_fn(self.schema)
        self.applied_versions.append(version)

def migration_001_add_status(schema):
    schema["users"].append("status")

mgr = MigrationManager()
print(f"Initial schema: {mgr.schema}")
mgr.apply_migration("20261010_001", migration_001_add_status)
print(f"Schema after migration: {mgr.schema}")
print(f"Migration version history: {mgr.applied_versions}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates sequential database schema evolution where changes are recorded in version history and applied deterministically.',
          expected_output: `Initial schema: {'users': ['id', 'email']}
Schema after migration: {'users': ['id', 'email', 'status']}
Migration version history: ['20261010_001']`,
          quiz: {
            id: 'quiz-l5-5-4',
            title: 'Migrations Check',
            questions: [
              {
                id: 'q-l5-5-4-1',
                question: 'Why must production database schema changes be managed via migration scripts checked into git rather than manual SQL queries?',
                options: [
                  { id: 'opt_1', text: 'Migration scripts ensure every environment (local, test, staging, prod) applies identical schema changes in deterministic sequence with automated rollback capability.' },
                  { id: 'opt_2', text: 'Because databases lock all tables permanently if manual SQL is used.' },
                  { id: 'opt_3', text: 'Because git can only store SQL code.' },
                  { id: 'opt_4', text: 'Manual SQL is forbidden by operating system firewalls.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Migrations treat schema as code, providing automated, reproducible, auditable database evolution across all development and production environments.'
              }
            ]
          },
          key_takeaways: [
            'All database changes must be tracked in version-controlled migration scripts.',
            'Every migration should provide both an upgrade and a rollback downgrade operation.',
            'Avoid adding non-nullable columns without default values on tables with millions of rows.'
          ],
          revision_prompts: [
            'How can you safely add a NOT NULL column to a billion-row table without locking the database?'
          ]
        },
        {
          id: 'les-l5-5-5',
          slug: 'transactions-and-consistency',
          title: 'Transactions, ACID Guarantees, and Row Locking',
          summary: 'Maintain data consistency using database transactions, isolation levels, and row-level locking (SELECT ... FOR UPDATE).',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand ACID guarantees: Atomicity, Consistency, Isolation, Durability',
            'Prevent lost updates using SELECT ... FOR UPDATE pessimistic row locks',
            'Handle transaction serialization failures and deadlock retries'
          ],
          content_markdown: `### The Problem of Concurrent Balance Deduction

Imagine User Alice has \$100. Two concurrent requests arrive at the exact same millisecond to withdraw \$100:
1. Thread A reads balance: \$100 (Valid!).
2. Thread B reads balance: \$100 (Valid!).
3. Thread A writes balance: \$100 - \$100 = \$0.
4. Thread B writes balance: \$100 - \$100 = \$0.
**Result**: Alice withdrew \$200, but only \$100 was deducted!

### Row-Level Locking (\`SELECT ... FOR UPDATE\`)

In a database transaction:
\`\`\`sql
BEGIN;
SELECT balance FROM accounts WHERE id = 42 FOR UPDATE;
-- Database locks row 42! Thread B is paused until Thread A commits!
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
COMMIT;
\`\`\`
The row lock serializes access to the row, guaranteeing zero race conditions!`,
          code_snippet: `# Simulating atomic transactional ledger operations
class BankLedger:
    def __init__(self):
        self.accounts = {"acc_1": 100}

    def transfer(self, acc: str, amount: int) -> bool:
        # Atomic transaction block
        current = self.accounts[acc]
        if current < amount:
            return False  # Abort transaction: Insufficient funds
        self.accounts[acc] = current - amount
        return True

ledger = BankLedger()
# Sequential execution ensures balance never goes negative
res1 = ledger.transfer("acc_1", 100)
res2 = ledger.transfer("acc_1", 100) # Fails safely!

print(f"Transaction 1 Result: {res1}")
print(f"Transaction 2 Result: {res2}")
print(f"Final Balance: {ledger.accounts['acc_1']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates atomic transaction validation ensuring that account balances cannot drop below zero under repeated withdrawal attempts.',
          expected_output: `Transaction 1 Result: True
Transaction 2 Result: False
Final Balance: 0`,
          quiz: {
            id: 'quiz-l5-5-5',
            title: 'ACID & Transactions Check',
            questions: [
              {
                id: 'q-l5-5-5-1',
                question: 'What does the "Atomicity" property of ACID transactions guarantee?',
                options: [
                  { id: 'opt_1', text: 'All operations inside the transaction either complete successfully together, or the entire transaction is rolled back with zero partial changes.' },
                  { id: 'opt_2', text: 'The database compresses data to atomic particle size.' },
                  { id: 'opt_3', text: 'The transaction executes in one nanosecond.' },
                  { id: 'opt_4', text: 'Only one user can use the database per day.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Atomicity means "all or nothing": if an error occurs halfway through a multi-step transaction, every preceding change is completely rolled back.'
              }
            ]
          },
          key_takeaways: [
            'ACID transactions ensure data integrity under concurrent execution.',
            'Use SELECT ... FOR UPDATE row locks to prevent race conditions on critical state.',
            'Keep transactions as short as possible to minimize lock contention.'
          ],
          revision_prompts: [
            'What is the difference between Read Committed and Serializable isolation levels?'
          ]
        },
        {
          id: 'les-l5-5-6',
          slug: 'connection-and-resource-lifecycle-management',
          title: 'Connection Pooling and Resource Lifecycle Management',
          summary: 'Configure database connection pools, pool sizing math, and prevent connection starvation.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand why creating TCP database connections per-request destroys performance',
            'Configure SQLAlchemy / asyncpg connection pools (pool_size, max_overflow)',
            'Calculate optimal connection pool sizing based on available PostgreSQL resources'
          ],
          content_markdown: `### The Cost of Establishing Database Connections

Every time your app creates a new connection to PostgreSQL:
1. TCP 3-way handshake.
2. TLS handshake.
3. PostgreSQL forks a backend server process and authenticates credentials.
This takes **20 to 100 milliseconds** per request!

### Connection Pooling Architecture

A **connection pool** keeps a set of active connections open in memory.
When a request arrives:
1. It borrows an idle connection from the pool instantly (< 0.1ms).
2. Runs its query.
3. Returns the connection back to the pool in a \`finally:\` block.

\`\`\`python
# Pool Sizing Math:
# Connections = (CPU Cores * 2) + Effective Spindle / Disk Count
\`\`\`
Setting pool sizes to 1,000 does not make apps faster—it exhausts PostgreSQL RAM and causes CPU thrashing!`,
          code_snippet: `# Simulating a bounded connection pool manager
class SimpleConnectionPool:
    def __init__(self, max_connections: int = 2):
        self.max_connections = max_connections
        self.available = [f"conn_{i}" for i in range(max_connections)]

    def acquire(self):
        if not self.available:
            raise TimeoutError("Connection pool exhausted! All workers busy.")
        return self.available.pop()

    def release(self, conn):
        self.available.append(conn)

pool = SimpleConnectionPool(max_connections=2)
c1 = pool.acquire()
c2 = pool.acquire()
print(f"Acquired connections: {c1}, {c2}")

try:
    c3 = pool.acquire()
except TimeoutError as err:
    print(f"Pool boundary protected server: {err}")

pool.release(c1)
print(f"Available after release: {pool.available}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a bounded connection pool preventing resource exhaustion by bounding open database connections and recycling them.',
          expected_output: `Acquired connections: conn_1, conn_0
Pool boundary protected server: Connection pool exhausted! All workers busy.
Available after release: ['conn_1']`,
          quiz: {
            id: 'quiz-l5-5-6',
            title: 'Connection Pooling Check',
            questions: [
              {
                id: 'q-l5-5-6-1',
                question: 'Why should an application reuse database connections via a connection pool rather than opening a new connection for each incoming HTTP request?',
                options: [
                  { id: 'opt_1', text: 'Opening new connections introduces heavy TCP/TLS handshake latency and exhausts database server memory and process limits.' },
                  { id: 'opt_2', text: 'Databases only allow one connection per IP address.' },
                  { id: 'opt_3', text: 'Python cannot open more than one socket at a time.' },
                  { id: 'opt_4', text: 'Connection pools automatically write SQL queries.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Reusing persistent pooled connections eliminates 50ms+ handshake latencies and prevents backend database servers from running out of RAM.'
              }
            ]
          },
          key_takeaways: [
            'Connection pools maintain pre-authenticated database connections for instant reuse.',
            'Always return connections to the pool in a finally block or context manager.',
            'Tune pool sizes conservatively to avoid overloading database CPU and memory.'
          ],
          revision_prompts: [
            'What is connection starvation and what happens when all connections in a pool are busy?'
          ]
        }
      ]
    },
    {
      id: 'top-l5-5-2',
      slug: 'reliability-patterns',
      title: 'Reliability: Idempotency, Rate Limiting & Partial Failures',
      summary: 'Implement idempotency keys, token bucket rate limiters, graceful shutdowns, and circuit breaker patterns.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l5-5-7',
          slug: 'timeouts-and-bounded-retries',
          title: 'Timeouts and Bounded Retries with Full Jitter',
          summary: 'Enforce deadline propagation and combine exponential backoff with full jitter to avoid thundering herds.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Set explicit connection and read timeouts on every network call',
            'Implement exponential backoff with full jitter',
            'Differentiate retryable vs non-retryable HTTP status codes'
          ],
          content_markdown: `### The Peril of Missing Timeouts

If an HTTP client makes a request without a timeout:
\`\`\`python
# CATASTROPHIC:
response = requests.get("https://payment-gateway.internal/charge")
\`\`\`
If the payment gateway hangs or drops packets, your thread hangs **forever**. 50 concurrent requests will exhaust all web worker threads, taking your entire application down!

### The Full Jitter Formula (AWS Architecture)

\`\`\`python
sleep = random.uniform(0, min(max_backoff, base_backoff * (2 ** attempt)))
\`\`\`
Full jitter randomizes the delay uniformly between 0 and the exponential cap, scattering retries and preventing thundering herds from crashing recovering servers.`,
          code_snippet: `import random

def calculate_full_jitter_delay(attempt: int, base: float = 0.5, cap: float = 8.0) -> float:
    exp_cap = min(cap, base * (2 ** attempt))
    # Randomly select a delay between 0 and exp_cap
    return round(random.uniform(0, exp_cap), 3)

delays = [calculate_full_jitter_delay(i) for i in range(4)]
print(f"Simulated jittered delays across attempts 0..3: {delays}")
print("Notice how delays are staggered, preventing synchronized retry storms!")`,
          code_language: 'python',
          code_explanation: 'Demonstrates the AWS Full Jitter calculation, which desynchronizes concurrent retries across recovering backend services.',
          expected_output: `Simulated jittered delays across attempts 0..3: [0.312, 0.841, 1.624, 3.415]
Notice how delays are staggered, preventing synchronized retry storms!`,
          quiz: {
            id: 'quiz-l5-5-7',
            title: 'Full Jitter Check',
            questions: [
              {
                id: 'q-l5-5-7-1',
                question: 'Why is adding "jitter" (randomized noise) to exponential backoff critical in high-concurrency systems?',
                options: [
                  { id: 'opt_1', text: 'It desynchronizes retry attempts across workers, preventing periodic traffic spikes (thundering herds) from overwhelming recovering servers.' },
                  { id: 'opt_2', text: 'It speeds up network cable transmission.' },
                  { id: 'opt_3', text: 'It turns 500 errors into 200 OK responses.' },
                  { id: 'opt_4', text: 'It is required by the HTTP/2 specification.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Without jitter, all failed clients retry at the exact same synchronized intervals, creating massive recurring traffic spikes that knock recovering servers back down.'
              }
            ]
          },
          key_takeaways: [
            'Every network client call must declare explicit connect and read timeouts.',
            'Combine exponential backoff with full jitter to scatter retry waves.',
            'Never retry non-idempotent mutations without an idempotency key.'
          ],
          revision_prompts: [
            'Which HTTP status codes are safe to retry automatically (e.g. 503 vs 400)?'
          ]
        },
        {
          id: 'les-l5-5-8',
          slug: 'idempotency-and-duplicate-requests',
          title: 'Idempotency Keys and Duplicate Request Prevention',
          summary: 'Prevent duplicate billing transactions using Idempotency-Key headers and atomic database deduplication.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand how network timeouts cause duplicate mutations',
            'Implement Idempotency-Key request headers matching Stripe standards',
            'Atomically store and return cached responses for duplicate keys'
          ],
          content_markdown: `### The Double-Charge Disaster

Client submits order:
1. Client sends \`POST /api/v1/orders\` (\$100).
2. Server charges credit card and creates order.
3. Network drops before the HTTP 200 response reaches the client!
4. Client's mobile app retries the request!
**Without Idempotency**: The customer is charged twice!

### Implementing Idempotency Keys:
1. Client generates a UUID: \`Idempotency-Key: 9b1deb4d-...\`.
2. Server checks idempotency store:
   - If key exists with completed status: return the cached response immediately.
   - If key is new: acquire lock, process order, save response, and release lock.`,
          code_snippet: `# Simulating an idempotency store handler
class IdempotencyHandler:
    def __init__(self):
        self.store = {}

    def process_transaction(self, key: str, charge_fn) -> dict:
        if key in self.store:
            return {"cached": True, "result": self.store[key]}
            
        # Execute charge
        res = charge_fn()
        self.store[key] = res
        return {"cached": False, "result": res}

handler = IdempotencyHandler()
charges = 0
def mock_charge():
    global charges
    charges += 1
    return {"tx_id": f"tx_{charges}", "amount": 100}

# First submission:
r1 = handler.process_transaction("idemp_uuid_99", mock_charge)
# Duplicate network retry:
r2 = handler.process_transaction("idemp_uuid_99", mock_charge)

print(f"Call 1 (New): {r1}")
print(f"Call 2 (Retry): {r2}")
print(f"Total charges executed: {charges} (Exactly once!)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates idempotency key deduplication: the second call with the same key returns the cached response, preventing a second charge.',
          expected_output: `Call 1 (New): {'cached': False, 'result': {'tx_id': 'tx_1', 'amount': 100}}
Call 2 (Retry): {'cached': True, 'result': {'tx_id': 'tx_1', 'amount': 100}}
Total charges executed: 1 (Exactly once!)`,
          quiz: {
            id: 'quiz-l5-5-8',
            title: 'Idempotency Check',
            questions: [
              {
                id: 'q-l5-5-8-1',
                question: 'What is the purpose of an Idempotency-Key header in financial and transactional REST APIs?',
                options: [
                  { id: 'opt_1', text: 'To allow clients to safely retry network-interrupted requests without causing duplicate mutations or double-charges.' },
                  { id: 'opt_2', text: 'To encrypt credit card numbers.' },
                  { id: 'opt_3', text: 'To speed up database indexing.' },
                  { id: 'opt_4', text: 'To bypass user login requirements.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Idempotency keys ensure that retried POST requests produce the exact same outcome as the initial request, eliminating duplicate charges.'
              }
            ]
          },
          key_takeaways: [
            'Network timeouts make it impossible for clients to know if a mutation succeeded.',
            'Use Idempotency-Key headers to identify duplicate requests.',
            'Store idempotency responses in persistent fast storage (Redis or PostgreSQL).'
          ],
          revision_prompts: [
            'What happens if two concurrent requests arrive with the exact same idempotency key at the same instant?'
          ]
        },
        {
          id: 'les-l5-5-9',
          slug: 'rate-limiting-fundamentals',
          title: 'Rate Limiting Fundamentals: Token Bucket and 429 Too Many Requests',
          summary: 'Protect services against abuse using the Token Bucket algorithm and return standard HTTP 429 responses.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand rate limiting algorithms: Token Bucket and Sliding Window',
            'Return HTTP 429 Too Many Requests with Retry-After headers',
            'Implement in-memory rate limiting per IP or API key'
          ],
          content_markdown: `### Why Rate Limiting is Mandatory

Without rate limiting:
- A buggy customer script sending 10,000 requests/sec consumes all database connections.
- Malicious scrapers overwhelm backend CPUs.

### The Token Bucket Algorithm

Imagine a bucket that holds up to **10 tokens**:
- Tokens are added continuously at a rate of **2 tokens per second**.
- Each incoming request takes **1 token** from the bucket.
- If the bucket has tokens: request is **allowed**.
- If the bucket is empty: request is **rejected** with **HTTP 429 Too Many Requests**!
This supports short bursts of traffic while capping long-term throughput strictly.`,
          code_snippet: `import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_update = time.time()

    def allow_request(self) -> bool:
        now = time.time()
        elapsed = now - self.last_update
        self.last_update = now
        
        # Add new tokens based on elapsed time:
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        
        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True
        return False

limiter = TokenBucket(capacity=2, refill_rate_per_sec=1.0)
print(f"Req 1: {limiter.allow_request()} (Allowed)")
print(f"Req 2: {limiter.allow_request()} (Allowed)")
print(f"Req 3: {limiter.allow_request()} (Blocked -> HTTP 429!)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates the Token Bucket rate limiting algorithm, allowing burst capacity up to the limit and rejecting requests once tokens are depleted.',
          expected_output: `Req 1: True (Allowed)
Req 2: True (Allowed)
Req 3: False (Blocked -> HTTP 429!)`,
          quiz: {
            id: 'quiz-l5-5-9',
            title: 'Rate Limiting Check',
            questions: [
              {
                id: 'q-l5-5-9-1',
                question: 'What HTTP status code and header should a rate-limited API return to clients when their quota is exceeded?',
                options: [
                  { id: 'opt_1', text: 'HTTP 429 Too Many Requests with a Retry-After header.' },
                  { id: 'opt_2', text: 'HTTP 404 Not Found with a Location header.' },
                  { id: 'opt_3', text: 'HTTP 200 OK with an empty body.' },
                  { id: 'opt_4', text: 'HTTP 500 Internal Server Error.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'RFC 6585 specifies HTTP 429 Too Many Requests. The Retry-After header informs the client how many seconds to wait before attempting another request.'
              }
            ]
          },
          key_takeaways: [
            'Rate limiting protects backend systems from noisy neighbors and denial-of-service.',
            'Token Bucket allows controlled traffic bursts while enforcing strict sustained limits.',
            'Always return HTTP 429 with Retry-After headers.'
          ],
          revision_prompts: [
            'How is rate limiting distributed across multiple web server instances using Redis?'
          ]
        },
        {
          id: 'les-l5-5-10',
          slug: 'background-jobs-and-failure-recovery',
          title: 'Background Jobs and Asynchronous Task Queues',
          summary: 'Offload heavy computations from HTTP threads to background worker queues with Dead Letter Queues (DLQ).',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Decouple fast HTTP request-response cycles from slow background work',
            'Understand task queues (Celery, RQ, ARQ, Redis Streams)',
            'Handle poison pills and unrecoverable tasks via Dead Letter Queues (DLQ)'
          ],
          content_markdown: `### Never Block the HTTP Request Thread!

If an HTTP endpoint needs to generate a PDF report or encode a video:
- Doing it synchronously keeps the HTTP connection open for 15 seconds.
- The user's browser may timeout, and worker threads are held hostage.

### The Background Worker Architecture:

\`\`\`
HTTP Request ──► Enqueue task to Redis/RabbitMQ ──► Return HTTP 202 Accepted (<10ms)
                        │
                        ▼ (Worker Process)
              Picks up task ──► Generates PDF ──► Saves to S3
                        │ (If fails 3 times)
                        ▼
              Dead Letter Queue (DLQ) for operator inspection
\`\`\`

A **Dead Letter Queue (DLQ)** holds failed messages so unrecoverable poison pills do not crash worker loops indefinitely.`,
          code_snippet: `# Simulating an asynchronous job queue with dead-letter queue (DLQ)
class TaskQueue:
    def __init__(self, max_retries: int = 2):
        self.max_retries = max_retries
        self.dlq = []

    def process_task(self, task: dict, worker_fn) -> str:
        for attempt in range(1, self.max_retries + 1):
            try:
                worker_fn(task["payload"])
                return "COMPLETED"
            except Exception as err:
                if attempt == self.max_retries:
                    self.dlq.append({**task, "error": str(err)})
                    return "MOVED_TO_DLQ"
        return "FAILED"

queue = TaskQueue(max_retries=2)

def failing_worker(p):
    raise ValueError("Corrupted image format")

res = queue.process_task({"id": "job_01", "payload": "bad_image.png"}, failing_worker)
print(f"Task outcome: {res}")
print(f"Dead Letter Queue count: {len(queue.dlq)}")
print(f"DLQ Record: {queue.dlq[0]}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates background task queue retry logic: after exhausting retries on a fatal defect, the task is safely routed to the Dead Letter Queue for engineering audit.',
          expected_output: `Task outcome: MOVED_TO_DLQ
Dead Letter Queue count: 1
DLQ Record: {'id': 'job_01', 'payload': 'bad_image.png', 'error': 'Corrupted image format'}`,
          quiz: {
            id: 'quiz-l5-5-10',
            title: 'Task Queue & DLQ Check',
            questions: [
              {
                id: 'q-l5-5-10-1',
                question: 'What is a Dead Letter Queue (DLQ) in background job architecture?',
                options: [
                  { id: 'opt_1', text: 'A dedicated secondary queue where tasks that repeatedly fail are quarantined so they do not crash active workers or block other jobs.' },
                  { id: 'opt_2', text: 'A queue for deleted email messages.' },
                  { id: 'opt_3', text: 'A queue that only runs at midnight.' },
                  { id: 'opt_4', text: 'A database table for expired user passwords.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A DLQ isolates permanently broken jobs ("poison messages"), preventing them from looping indefinitely and allowing engineers to inspect the failure.'
              }
            ]
          },
          key_takeaways: [
            'Return HTTP 202 Accepted immediately and offload slow work to task queues.',
            'Configure bounded retries on worker tasks.',
            'Quarantine persistently failing jobs into a Dead Letter Queue.'
          ],
          revision_prompts: [
            'Why should task payloads contain IDs and references rather than large serialized binary objects?'
          ]
        },
        {
          id: 'les-l5-5-11',
          slug: 'health-checks-and-graceful-shutdown',
          title: 'Health Checks and Graceful Shutdown: Handling SIGTERM',
          summary: 'Handle OS shutdown signals (SIGTERM) gracefully to drain in-flight requests and provide /healthz probes.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Implement liveness (/healthz) vs readiness (/readyz) HTTP probes',
            'Handle POSIX signals: SIGTERM and SIGINT with signal.signal',
            'Gracefully drain active in-flight requests during rolling deployments'
          ],
          content_markdown: `### Rolling Deployments and SIGTERM

When Kubernetes or Docker stops a container during a zero-downtime rolling deployment:
1. Orchestrator removes container from load balancer.
2. Sends **\`SIGTERM\`** signal to the application process.
3. Gives the application **30 seconds** (grace period) to finish active requests.
4. If process is still running after grace period, sends **\`SIGKILL\`** (immediate termination).

### Graceful Shutdown Sequence:
\`\`\`python
import signal
import sys

is_shutting_down = False

def handle_sigterm(signum, frame):
    global is_shutting_down
    print("Received SIGTERM! Draining connections...")
    is_shutting_down = True
    # Stop accepting new requests
    # Wait for active tasks to finish
    # Close database connection pools
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_sigterm)
\`\`\``,
          code_snippet: `# Simulating readiness probe during graceful shutdown
class ServiceLifecycle:
    def __init__(self):
        self.is_draining = False
        self.active_requests = 2

    def trigger_sigterm(self):
        print("SIGTERM received: setting is_draining = True")
        self.is_draining = True

    def readiness_probe(self) -> tuple:
        """K8s calls /readyz: if False, traffic stops immediately."""
        if self.is_draining:
            return 503, "Draining - Do not send traffic"
        return 200, "Ready"

svc = ServiceLifecycle()
print(f"Normal Probe: HTTP {svc.readiness_probe()[0]}")
svc.trigger_sigterm()
print(f"Post-SIGTERM Probe: HTTP {svc.readiness_probe()[0]} (Load balancer stops routing!)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how a readiness probe reflects shutdown state immediately upon receiving SIGTERM, allowing load balancers to stop routing traffic before connections close.',
          expected_output: `Normal Probe: HTTP 200
SIGTERM received: setting is_draining = True
Post-SIGTERM Probe: HTTP 503 (Load balancer stops routing!)`,
          quiz: {
            id: 'quiz-l5-5-11',
            title: 'Graceful Shutdown Check',
            questions: [
              {
                id: 'q-l5-5-11-1',
                question: 'What should an application do upon receiving a SIGTERM signal from the operating system or container orchestrator?',
                options: [
                  { id: 'opt_1', text: 'Fail readiness probes to stop new traffic, finish processing active in-flight requests, close database connections cleanly, and exit.' },
                  { id: 'opt_2', text: 'Immediately crash and drop all current connections.' },
                  { id: 'opt_3', text: 'Ignore the signal and continue running indefinitely.' },
                  { id: 'opt_4', text: 'Restart the computer.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Graceful shutdown ensures zero dropped user requests during rolling deployments by finishing active requests while rejecting new ones.'
              }
            ]
          },
          key_takeaways: [
            'Intercept SIGTERM to execute graceful connection draining.',
            'Readiness probes must return 503 during shutdown to notify load balancers.',
            'Always release database connection pools before process termination.'
          ],
          revision_prompts: [
            'What is the difference between a liveness probe and a readiness probe?'
          ]
        },
        {
          id: 'les-l5-5-12',
          slug: 'designing-for-partial-failures',
          title: 'Designing for Partial Failures: The Circuit Breaker Pattern',
          summary: 'Protect distributed systems from cascading failure using Circuit Breakers, Bulkheads, and graceful degradation.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand cascading outages and downstream saturation',
            'Implement the Circuit Breaker pattern: Closed, Open, and Half-Open states',
            'Provide cached or degraded fallbacks when dependencies are down'
          ],
          content_markdown: `### The Circuit Breaker Pattern

When a downstream microservice is down or timing out, continuing to hammer it with 1,000 requests/sec keeps your threads blocked and prevents the downstream service from ever recovering!

A **Circuit Breaker** acts like an electrical fuse:
1. **CLOSED (Normal)**:
   - Requests flow to the dependency.
   - Failures are counted.
2. **OPEN (Tripped)**:
   - Failure threshold exceeded (e.g. 5 consecutive timeouts).
   - **Immediately fails fast** without calling the downstream network!
   - Returns a fallback (e.g. cached recommendation).
3. **HALF-OPEN (Testing)**:
   - After a cooldown period (e.g. 30s), lets a single canary request through.
   - If it succeeds, circuit resets to CLOSED. If it fails, circuit re-opens!`,
          code_snippet: `# Simulating a 3-state Circuit Breaker
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 2):
        self.state = "CLOSED" # CLOSED, OPEN, HALF_OPEN
        self.failure_count = 0
        self.failure_threshold = failure_threshold

    def execute(self, action_fn, fallback_fn):
        if self.state == "OPEN":
            # Fail fast without calling broken dependency!
            return fallback_fn("Circuit is OPEN (Dependency Down)")

        try:
            res = action_fn()
            self.failure_count = 0
            return res
        except Exception as err:
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            return fallback_fn(f"Failed: {err}")

cb = CircuitBreaker(failure_threshold=2)
def failing_api(): raise ConnectionError("Timeout")
def fallback_val(reason): return f"[FALLBACK_CACHE: {reason}]"

print(f"Call 1: {cb.execute(failing_api, fallback_val)} | State: {cb.state}")
print(f"Call 2: {cb.execute(failing_api, fallback_val)} | State: {cb.state}")
print(f"Call 3 (Trip): {cb.execute(failing_api, fallback_val)} | State: {cb.state}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a Circuit Breaker transitioning from CLOSED to OPEN after reaching the failure threshold, short-circuiting network calls to protect both services.',
          expected_output: `Call 1: [FALLBACK_CACHE: Failed: Timeout] | State: CLOSED
Call 2: [FALLBACK_CACHE: Failed: Timeout] | State: OPEN
Call 3 (Trip): [FALLBACK_CACHE: Circuit is OPEN (Dependency Down)] | State: OPEN`,
          quiz: {
            id: 'quiz-l5-5-12',
            title: 'Circuit Breaker Check',
            questions: [
              {
                id: 'q-l5-5-12-1',
                question: 'What is the primary purpose of transitioning a Circuit Breaker to the OPEN state?',
                options: [
                  { id: 'opt_1', text: 'To fail fast immediately without making network calls, preventing caller thread exhaustion and giving the failing downstream service time to recover.' },
                  { id: 'opt_2', text: 'To delete the downstream service.' },
                  { id: 'opt_3', text: 'To trigger an automated database backup.' },
                  { id: 'opt_4', text: 'To encrypt all outgoing HTTP traffic.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'An OPEN circuit breaker prevents callers from waiting for timeouts on a known-dead dependency, saving caller resources and stopping cascading failures.'
              }
            ]
          },
          key_takeaways: [
            'Circuit Breakers prevent cascading outages across distributed microservices.',
            'Tripping to OPEN fails fast without wasting time on dead network sockets.',
            'Always design graceful fallback degradation when dependencies fail.'
          ],
          revision_prompts: [
            'What is the difference between a Circuit Breaker pattern and a Bulkhead pattern?'
          ]
        }
      ]
    }
  ]
};
