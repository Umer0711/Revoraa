/**
 * Revoraa Level 4: Advanced Python - Module 7: Reliable Pipelines, Logging, and Error Handling
 * 
 * 12 comprehensive lessons covering multi-stage data pipelines, structured JSON logging,
 * correlation IDs, exponential backoff with jitter, idempotency keys, health checks,
 * transient vs permanent failure recovery, background jobs, and observability fundamentals.
 */

export const MODULE_7_RELIABLE_PIPELINES_LOGGING = {
  id: 'mod-py-pipelines-logging',
  slug: 'reliable-pipelines-logging-and-error-handling',
  level_number: 4,
  title: 'Reliable Pipelines, Logging, and Error Handling',
  description: 'Master multi-stage resilient pipelines, structured JSON logging, distributed correlation IDs, exponential backoff retries, and idempotency guarantees.',
  estimated_hours: 10,
  sort_order: 7,
  is_published: true,
  topics: [
    {
      id: 'top-pipelines-and-observability',
      slug: 'resilient-pipelines-and-observability',
      title: 'Resilient Pipelines, Structured Logging & Operational Health',
      summary: 'Explore multi-stage data streams, transient retry policies, idempotency records, correlation tracing, and telemetry metrics.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-multi-stage-pipelines',
          slug: 'designing-multi-stage-data-pipelines',
          title: 'Designing Multi-Stage Data Pipelines: Ingestion, Validation, Transform, and Sink',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Architect composable, unidirectional data pipelines with decoupled stage boundaries and isolated error domains.',
          learning_objectives: [
            'Deconstruct data processing into independent stages: Ingest -> Validate -> Transform -> Sink',
            'Enforce stage contracts where each stage produces an immutable output record',
            'Handle partial stage failures without halting the entire batch pipeline'
          ],
          content_markdown: `### The Pipeline Architecture

A robust data pipeline processes records through discrete, unidirectional stages:

\`\`\`
Raw Ingestion ──► Schema Validation ──► Business Transformation ──► Destination Sink
       │                 │                          │                     │
       ▼                 ▼                          ▼                     ▼
[Dead Letter Q]   [Validation Error]         [Transform Error]       [Storage Error]
\`\`\`

- **Stage Isolation**: Each stage has exactly one responsibility.
- **Fail-Fast vs Dead-Letter Queue (DLQ)**: In production, invalid records should not crash the batch. Instead, they are diverted to a **Dead-Letter Queue** for inspection while valid records continue flowing.`,
          code_snippet: `from typing import NamedTuple

class RawRecord(NamedTuple):
    raw_id: str
    raw_amount: str

class ValidatedRecord(NamedTuple):
    id: int
    amount: float

# Stage 1: Validation
def validate_stage(raw: RawRecord) -> ValidatedRecord | None:
    try:
        return ValidatedRecord(id=int(raw.raw_id), amount=float(raw.raw_amount))
    except (ValueError, TypeError):
        return None # Rejected record

# Stage 2: Transformation
def transform_stage(rec: ValidatedRecord) -> dict:
    return {"user_id": rec.id, "amount_usd": rec.amount, "fee": round(rec.amount * 0.02, 2)}

# Execution pipeline
raw_batch = [RawRecord("101", "49.99"), RawRecord("INVALID", "abc"), RawRecord("102", "120.00")]

processed = []
dead_letter_queue = []

for item in raw_batch:
    validated = validate_stage(item)
    if validated:
        processed.append(transform_stage(validated))
    else:
        dead_letter_queue.append(item)

print(f"Successfully processed ({len(processed)} records):", processed)
print(f"Diverted to DLQ ({len(dead_letter_queue)} records):", dead_letter_queue)`,
          code_language: 'python',
          code_explanation: 'Valid records pass through transformation cleanly, while malformed records are diverted to the dead-letter queue without crashing the pipeline.',
          expected_output: `Successfully processed (2 records): [{'user_id': 101, 'amount_usd': 49.99, 'fee': 1.0}, {'user_id': 102, 'amount_usd': 120.0, 'fee': 2.4}]
Diverted to DLQ (1 records): [RawRecord(raw_id='INVALID', raw_amount='abc')]`,
          quiz: {
            id: 'quiz-l4-pipelines',
            title: 'Pipeline Architecture Check',
            questions: [
              {
                id: 'q-l4-pl-1',
                question_text: 'What is the role of a Dead-Letter Queue (DLQ) in an enterprise data pipeline?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To delete all data permanently.' },
                  { id: 'opt_2', text: 'To capture invalid or failed records separately so the rest of the batch can proceed without interruption.' },
                  { id: 'opt_3', text: 'To speed up internet connections.' },
                  { id: 'opt_4', text: 'To encrypt database passwords.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A DLQ isolates malformed or unprocessable records for debugging and reprocessing, preventing single-record defects from blocking the entire pipeline.'
              }
            ]
          },
          key_takeaways: [
            'Structure pipelines into independent, unidirectional stages.',
            'Divert unprocessable records to a Dead-Letter Queue (DLQ) rather than halting execution.',
            'Keep records immutable between stages to prevent side-effect bugs.'
          ],
          revision_prompts: [
            'What is the difference between batch processing and streaming (event-by-event) pipelines?',
            'How do generator pipelines enable processing terabytes of data with bounded memory?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-explicit-error-handling-boundaries',
          slug: 'explicit-error-handling-and-exception-boundaries',
          title: 'Explicit Error Handling: Catching Specific Exceptions and Failure Boundaries',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Eliminate bare except: pass anti-patterns, define clear exception boundaries, and preserve error context.',
          learning_objectives: [
            'Understand why bare `except:` or `except Exception: pass` hides critical defects',
            'Handle specific exception types precisely at appropriate architectural boundaries',
            'Preserve stack traces and root causes using exception chaining'
          ],
          content_markdown: `### The Most Dangerous Anti-Pattern in Python

\`\`\`python
# NEVER WRITE THIS IN PRODUCTION!
try:
    process_transaction()
except:
    pass
\`\`\`
Why this is catastrophic:
1. It catches \`KeyboardInterrupt\` (preventing \`Ctrl+C\` from stopping the program).
2. It catches \`SystemExit\` and \`MemoryError\`.
3. It hides syntax typos (\`NameError: name 'user' is not defined\`), causing silent data corruption that goes undetected for months!

### The Golden Rule of Error Boundaries
1. Always catch **specific** exception types (\`except (FileNotFoundError, PermissionError):\`).
2. Only catch an exception if you can **handle it, log it, or translate it**. If you cannot handle it, let it propagate to a higher error boundary.`,
          code_snippet: `class PaymentGatewayError(Exception): pass
class InsufficientFundsError(PaymentGatewayError): pass

def process_charge(balance: float, cost: float) -> float:
    if cost > balance:
        raise InsufficientFundsError(f"Balance \${balance} insufficient for charge \${cost}")
    return balance - cost

# Specific error boundary
current_balance = 50.0
try:
    current_balance = process_charge(current_balance, 75.0)
except InsufficientFundsError as err:
    print(f"[RECOVERY ACTION] Charge declined gracefully: {err}")
    print("Notifying customer to update payment method.")

print("Account balance remained intact at: \$", current_balance)`,
          code_language: 'python',
          code_explanation: 'Catching InsufficientFundsError specifically allows the application to recover gracefully without masking unexpected system errors.',
          expected_output: `[RECOVERY ACTION] Charge declined gracefully: Balance \$50.0 insufficient for charge \$75.0
Notifying customer to update payment method.
Account balance remained intact at: \$ 50.0`,
          quiz: {
            id: 'quiz-l4-error-bounds',
            title: 'Error Boundaries Check',
            questions: [
              {
                id: 'q-l4-eb-1',
                question_text: 'Why should a developer never use a bare `except:` statement without specifying an exception class?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Python 3 removed the except keyword.' },
                  { id: 'opt_2', text: 'Because it catches BaseException, including KeyboardInterrupt and SystemExit, masking critical system signals and code bugs.' },
                  { id: 'opt_3', text: 'Because it runs slower in CPython.' },
                  { id: 'opt_4', text: 'It is recommended practice and has no downsides.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A bare except catches BaseException, intercepting Ctrl+C interrupts, system terminations, and programming typos, creating un-debuggable silent bugs.'
              }
            ]
          },
          key_takeaways: [
            'Never use bare except: pass; always catch specific, anticipated exception types.',
            'Only catch exceptions at architectural boundaries where you can take meaningful recovery action.',
            'Let unexpected errors propagate so they surface in monitoring systems.'
          ],
          revision_prompts: [
            'What is the difference between Exception and BaseException in Python?',
            'When should a service crash immediately (crash-only software) vs attempting recovery?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-structured-logging-json-context',
          slug: 'structured-logging-fundamentals',
          title: 'Structured Logging Fundamentals: JSON Formats and Contextual Fields',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Graduate from print() and unstructured text to structured JSON logging parsed by Datadog, Elasticsearch, and CloudWatch.',
          learning_objectives: [
            'Understand why raw string logs (f"User {u} logged in") are difficult to query across millions of log lines',
            'Format logs as structured JSON key-value dictionaries for log aggregators',
            'Use standard logging with custom JSON formatters and extra contextual fields'
          ],
          content_markdown: `### The Problem with Plain Text Logs

Traditional logs print arbitrary text strings:
\`\`\`
2026-10-10 12:00:00 INFO User 42 purchased item SKU_99 for $120.00
\`\`\`
When you have 50 million logs a day in production:
- Searching for all purchases $> $100 requires slow, fragile regex parsing.
- Aggregating stats by customer ID requires complex text scraping.

### Structured Logging (JSON)
Logs are formatted as structured JSON records:
\`\`\`json
{"timestamp": "2026-10-10T12:00:00Z", "level": "INFO", "event": "purchase_completed", "user_id": 42, "sku": "SKU_99", "amount": 120.00}
\`\`\`
Log analytics platforms (Datadog, Splunk, Elastic) index these fields automatically, enabling instant filtering like \`amount > 100 AND user_id: 42\`.`,
          code_snippet: `import json
import logging
import io

class JsonLogFormatter(logging.Formatter):
    """Formats log records as structured single-line JSON."""
    def format(self, record: logging.LogRecord) -> str:
        log_payload = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "extra": getattr(record, "extra_fields", {})
        }
        return json.dumps(log_payload)

# Configure logger with in-memory stream for demonstration
log_stream = io.StringIO()
logger = logging.getLogger("structured_app")
logger.setLevel(logging.INFO)
logger.handlers.clear()

handler = logging.StreamHandler(log_stream)
handler.setFormatter(JsonLogFormatter())
logger.addHandler(handler)

# Emit structured log
logger.info("Payment processed", extra={"extra_fields": {"user_id": 101, "amount_usd": 49.99, "currency": "USD"}})

log_stream.seek(0)
print("Structured JSON log output:")
print(log_stream.read().strip())`,
          code_language: 'python',
          code_explanation: 'JsonLogFormatter converts standard LogRecord objects into machine-readable JSON strings indexed with contextual metadata.',
          expected_output: `Structured JSON log output:
{"timestamp": "<timestamp>", "level": "INFO", "message": "Payment processed", "module": "<module>", "extra": {"user_id": 101, "amount_usd": 49.99, "currency": "USD"}}`,
          quiz: {
            id: 'quiz-l4-struct-log',
            title: 'Structured Logging Check',
            questions: [
              {
                id: 'q-l4-sl-1',
                question_text: 'What is the primary advantage of structured JSON logging over plain text string formatting in production systems?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'JSON logs use zero bytes on disk.' },
                  { id: 'opt_2', text: 'Log aggregators (Datadog, Elasticsearch) automatically parse and index JSON keys, enabling instant querying, filtering, and metric aggregation.' },
                  { id: 'opt_3', text: 'JSON logs prevent all application bugs.' },
                  { id: 'opt_4', text: 'JSON logs do not require importing the logging module.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Structured JSON logs allow log indexing engines to parse fields automatically, enabling fast queries, alerts, and statistical dashboards.'
              }
            ]
          },
          key_takeaways: [
            'Replace unstructured text logs with structured JSON logs in production.',
            'Include contextual domain fields (user_id, order_id, duration_ms) in log records.',
            'Centralize JSON formatting in a custom logging.Formatter.'
          ],
          revision_prompts: [
            'What is the structlog package and how does it improve Python logging ergonomics?',
            'Why should sensitive data (passwords, credit card numbers, tokens) be scrubbed from structured log payloads?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-correlation-ids-traceability',
          slug: 'correlation-ids-and-traceable-operations',
          title: 'Correlation IDs and Distributed Traceability: Tracking Requests Across Async Boundaries',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 4,
          summary: 'Trace requests across microservices and async coroutines using contextvars and correlation IDs.',
          learning_objectives: [
            'Generate and propagate unique correlation IDs (e.g. X-Request-ID) across services',
            'Use the standard library contextvars module for async task-local storage',
            'Automatically attach correlation IDs to all log messages in asynchronous code'
          ],
          content_markdown: `### The Needle in the Haystack

When 100 concurrent users make requests:
- Log messages from all 100 users are interleaved in your log files.
- If User B experiences an error, isolating their specific sequence of calls across 5 microservices is nearly impossible.

### Correlation IDs with \`contextvars\`
1. Generate a UUID (\`correlation_id = uuid.uuid4()\`) at the entrypoint (API gateway).
2. Store it in a **\`contextvars.ContextVar\`**.
   - Unlike \`threading.local\`, \`ContextVar\` works seamlessly across **asynchronous coroutines and tasks**!
3. Inject the correlation ID into every single log entry and outgoing HTTP header (\`X-Correlation-ID\`).
4. Now, filtering \`correlation_id: "req_abc123"\` instantly isolates the exact user transaction lifecycle!`,
          code_snippet: `import contextvars
import uuid

# Task-local context variable (works across asyncio tasks and threads!)
correlation_ctx = contextvars.ContextVar("correlation_id", default="NO_CORRELATION_ID")

def log_event(message: str):
    # Automatically read current task's correlation ID
    cid = correlation_ctx.get()
    print(f"[{cid}] -> {message}")

def handle_user_request(user_name: str):
    # Assign unique correlation ID for this request lifecycle
    req_id = f"req_{uuid.uuid4().hex[:6]}"
    token = correlation_ctx.set(req_id)
    try:
        log_event(f"Started processing request for {user_name}")
        log_event(f"Database query executed successfully")
        log_event(f"Response dispatched to client")
    finally:
        correlation_ctx.reset(token)

handle_user_request("alice_99")
handle_user_request("bob_42")`,
          code_language: 'python',
          code_explanation: 'contextvars preserves task-local correlation IDs across async calls, allowing all logs for a single request to share the identical identifier.',
          expected_output: `[req_<hex>] -> Started processing request for alice_99
[req_<hex>] -> Database query executed successfully
[req_<hex>] -> Response dispatched to client
[req_<hex>] -> Started processing request for bob_42
[req_<hex>] -> Database query executed successfully
[req_<hex>] -> Response dispatched to client`,
          quiz: {
            id: 'quiz-l4-correlation-ids',
            title: 'Correlation ID Check',
            questions: [
              {
                id: 'q-l4-ci-1',
                question_text: 'Why should you use `contextvars.ContextVar` instead of `threading.local` for storing correlation IDs in modern Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because threading.local does not work in Linux.' },
                  { id: 'opt_2', text: 'Because contextvars correctly preserves task-local context across asynchronous coroutines and asyncio tasks running on a single thread.' },
                  { id: 'opt_3', text: 'Because contextvars is written in Rust.' },
                  { id: 'opt_4', text: 'There is no difference.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'In asyncio, multiple concurrent tasks share a single OS thread. threading.local would corrupt and overwrite state across tasks, whereas contextvars isolates task contexts.'
              }
            ]
          },
          key_takeaways: [
            'Correlation IDs provide end-to-end traceability across distributed services and concurrent tasks.',
            'Use contextvars.ContextVar to maintain task-local state across asynchronous coroutines.',
            'Propagate correlation IDs through outgoing HTTP headers (X-Request-ID / X-Correlation-ID).'
          ],
          revision_prompts: [
            'How does OpenTelemetry build upon correlation IDs to create distributed trace spans?',
            'What happens to a ContextVar when you create a new task using asyncio.create_task()?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-retry-strategies-exponential-backoff',
          slug: 'retry-strategies-and-exponential-backoff',
          title: 'Retry Strategies and Exponential Backoff with Jitter: Transient vs Permanent Failures',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 5,
          summary: 'Implement robust retry algorithms: Differentiate transient from permanent failures, exponential backoff, and full jitter.',
          learning_objectives: [
            'Distinguish transient/retryable errors (429, 503, timeouts) from permanent errors (400, 401, 404)',
            'Calculate exponential backoff delays (base * 2^attempt)',
            'Add random jitter to prevent the "thundering herd" retry stampede'
          ],
          content_markdown: `### The Golden Rule of Retries: Never Retry Blindly!

Retrying every error blindly is an architectural disaster:
- **Permanent Errors (NEVER RETRY)**: HTTP 400 Bad Request, 401 Unauthorized, 404 Not Found, Schema Validation Errors. Retrying these wastes CPU cycles and will never succeed.
- **Transient Errors (SAFE TO RETRY)**: HTTP 429 Rate Limited, HTTP 503 Service Unavailable, Socket Timeouts.

### Exponential Backoff with Jitter
If 1,000 clients all retry after exactly 1.0s, they will hammer the recovering server at the exact same millisecond (**thundering herd / retry storm**).
- **Exponential Backoff**: $t = \\text{base} \\times 2^{\\text{attempt}}$
- **Full Jitter**: Pick a uniform random number between $0$ and $t$:
  $$\\text{delay} = \\text{random.uniform}(0, \\min(\\text{max\\_delay}, \\text{base} \\times 2^{\\text{attempt}}))$$`,
          code_snippet: `import random
import time

def execute_with_retry(max_retries: int = 3, base_delay: float = 0.05):
    attempt = 0
    while attempt < max_retries:
        try:
            # Simulated transient failure on first 2 attempts
            attempt += 1
            if attempt < 3:
                raise ConnectionResetError("Transient network blip")
            print(f"[SUCCESS] Operation succeeded on attempt {attempt}!")
            return True
        except ConnectionResetError as err:
            if attempt >= max_retries:
                print(f"[ABORT] Max retries reached: {err}")
                raise
            # Exponential backoff with random full jitter
            cap = min(1.0, base_delay * (2 ** (attempt - 1)))
            jitter_delay = random.uniform(0.01, cap)
            print(f"[RETRY] Attempt {attempt} failed ({err}). Backing off for {jitter_delay * 1000:.1f} ms...")
            time.sleep(jitter_delay)

execute_with_retry(max_retries=4)` ,
          code_language: 'python',
          code_explanation: 'Demonstrates exponential backoff with random jitter, retrying transient ConnectionResetError while respecting max_retries limits.',
          expected_output: `[RETRY] Attempt 1 failed (Transient network blip). Backing off for <delay> ms...
[RETRY] Attempt 2 failed (Transient network blip). Backing off for <delay> ms...
[SUCCESS] Operation succeeded on attempt 3!`,
          quiz: {
            id: 'quiz-l4-retries-jitter',
            title: 'Retry & Jitter Check',
            questions: [
              {
                id: 'q-l4-rj-1',
                question_text: 'Why is adding random "jitter" to exponential backoff delays critical in distributed systems?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To encrypt network packets.' },
                  { id: 'opt_2', text: 'To prevent the "thundering herd" effect where hundreds of clients retry at the identical second, crashing the recovering server.' },
                  { id: 'opt_3', text: 'To bypass firewalls.' },
                  { id: 'opt_4', text: 'Jitter makes retries run in parallel.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Random jitter desynchronizes client retries over an interval, preventing periodic synchronized waves of traffic from overwhelming recovering backends.'
              }
            ]
          },
          key_takeaways: [
            'Only retry transient errors (timeouts, rate limits, 503s); never retry client or validation errors (400, 401).',
            'Use exponential backoff with maximum delay caps to give recovering systems time to heal.',
            'Always add random jitter to prevent synchronized retry storms.'
          ],
          revision_prompts: [
            'What is the Circuit Breaker pattern and how does it prevent calling a completely failing service?',
            'How does the tenacity library simplify retries in production Python applications?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-idempotency-deduplication',
          slug: 'idempotency-and-duplicate-operation-prevention',
          title: 'Idempotency and Duplicate-Operation Prevention: Idempotency Keys',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 6,
          summary: 'Guarantee at-most-once processing using unique idempotency keys, atomic record checking, and database unique constraints.',
          learning_objectives: [
            'Define idempotency: Performing an operation multiple times yields the exact same end state as performing it once',
            'Implement idempotency keys (e.g. Idempotency-Key header) for billing and payment operations',
            'Use database unique constraints to enforce atomic deduplication'
          ],
          content_markdown: `### The Double Charge Nightmare

If a client submits a credit card charge for $100:
- The payment gateway processes the charge successfully.
- But right before sending the HTTP 200 response, a network timeout disconnects the client.
- The client library's retry logic fires a second request:
  **Without idempotency, the customer is charged twice!**

### The Idempotency Key Pattern
1. The client generates a unique UUID (\`idempotency_key = "idem_9f82a1"\`).
2. The server checks an \`idempotency_records\` table before processing:
   - If the key exists and is completed: **Return the cached response immediately** without re-charging!
   - If the key is new: Store it with a unique constraint, execute the charge, and save the result.`,
          code_snippet: `class IdempotentPaymentGateway:
    def __init__(self):
        # Database table storing processed transaction keys and results
        self._processed_keys: dict[str, dict] = {}

    def charge(self, idempotency_key: str, amount: float, account: str) -> dict:
        # Check if already processed
        if idempotency_key in self._processed_keys:
            print(f"[IDEMPOTENCY HIT] Key '{idempotency_key}' already processed. Returning cached receipt.")
            return self._processed_keys[idempotency_key]

        # Execute business transaction
        print(f"[TRANSACTION] Charging \${amount} to account {account}...")
        receipt = {
            "transaction_id": f"tx_{idempotency_key[:6]}",
            "amount": amount,
            "status": "APPROVED",
            "account": account
        }

        # Atomically record key
        self._processed_keys[idempotency_key] = receipt
        return receipt

gateway = IdempotentPaymentGateway()

# Request 1: Processes transaction
receipt_1 = gateway.charge("idem_tx_4921", 100.0, "USER_88")

# Request 2: Network retry with identical key -> Zero duplicate charge!
receipt_2 = gateway.charge("idem_tx_4921", 100.0, "USER_88")

assert receipt_1 == receipt_2
print("Final confirmation: Duplicate payment was safely prevented.")`,
          code_language: 'python',
          code_explanation: 'The idempotency key guards against duplicate operations. Retrying with the same key safely returns the original receipt.',
          expected_output: `[TRANSACTION] Charging \$100.0 to account USER_88...
[IDEMPOTENCY HIT] Key 'idem_tx_4921' already processed. Returning cached receipt.
Final confirmation: Duplicate payment was safely prevented.`,
          quiz: {
            id: 'quiz-l4-idempotency',
            title: 'Idempotency Check',
            questions: [
              {
                id: 'q-l4-ip-1',
                question_text: 'What does it mean for an API operation to be "idempotent"?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It can only be called on Tuesdays.' },
                  { id: 'opt_2', text: 'Making multiple identical requests has the same effect on system state as making a single request.' },
                  { id: 'opt_3', text: 'It returns random data.' },
                  { id: 'opt_4', text: 'It does not use parameters.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'An operation is idempotent if executing it once or a hundred times results in the identical final state without duplicate side effects.'
              }
            ]
          },
          key_takeaways: [
            'All non-idempotent operations (POST, payments, balance deductions) must be guarded with idempotency keys.',
            'Store idempotency records with unique database constraints to guarantee atomic deduplication.',
            'Return cached responses when duplicate keys are detected rather than failing with an error.'
          ],
          revision_prompts: [
            'Which HTTP verbs are inherently idempotent according to the HTTP specification (GET, PUT, DELETE)?',
            'How long should an idempotency key record be retained in a cache (e.g. 24 hours)?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-pipeline-timeouts-failure-recovery',
          slug: 'timeouts-and-failure-recovery-in-pipelines',
          title: 'Timeouts and Failure Recovery in Pipelines: Deadlines and Graceful Degradation',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 7,
          summary: 'Enforce end-to-end pipeline deadlines, partial failure fallbacks, and graceful degradation.',
          learning_objectives: [
            'Propagate remaining deadline budgets across pipeline stages',
            'Implement graceful degradation fallbacks when non-critical stages time out',
            'Prevent single hung operations from blocking pipeline thread pools'
          ],
          content_markdown: `### Deadline Budgets Across Stages

If an overall pipeline has a 5.0-second SLA and consists of 3 stages:
- Giving each stage a 5.0-second timeout allows the total pipeline to take up to **15.0 seconds** before failing!
- **Deadline Budgeting**: Compute the absolute deadline timestamp at the entrypoint:
  \`\`\`python
  deadline = time.perf_counter() + 5.0
  \`\`\`
  Each stage must check the **remaining budget** (\`deadline - time.perf_counter()\`) before proceeding.

### Graceful Degradation
If a recommendation stage times out, do not fail the entire user page! Fall back to a cached default or popular items list.`,
          code_snippet: `import time

class PipelineDeadlineExceeded(Exception): pass

def execute_stage(name: str, duration: float, deadline: float) -> str:
    remaining = deadline - time.perf_counter()
    if remaining <= 0:
        raise PipelineDeadlineExceeded(f"Deadline exceeded before entering stage {name}")

    print(f"[{name}] Starting (Remaining budget: {remaining * 1000:.1f} ms)...")
    time.sleep(duration)
    return f"{name}_OK"

# Total pipeline budget: 50ms
deadline = time.perf_counter() + 0.05

try:
    s1 = execute_stage("Stage1_Auth", 0.02, deadline)
    s2 = execute_stage("Stage2_Enrich", 0.02, deadline)
    s3 = execute_stage("Stage3_Notify", 0.03, deadline) # Exceeds budget!
except PipelineDeadlineExceeded as err:
    print(f"[RECOVERY FALLBACK] {err}. Falling back to degraded response.")`,
          code_language: 'python',
          code_explanation: 'The pipeline tracks remaining deadline budget across stages, halting gracefully when the allocated SLA expires.',
          expected_output: `[Stage1_Auth] Starting (Remaining budget: <budget> ms)...
[Stage2_Enrich] Starting (Remaining budget: <budget> ms)...
[RECOVERY FALLBACK] Deadline exceeded before entering stage Stage3_Notify. Falling back to degraded response.`,
          quiz: {
            id: 'quiz-l4-deadlines',
            title: 'Deadline Budgets Check',
            questions: [
              {
                id: 'q-l4-db-1',
                question_text: 'What is the danger of setting static timeouts on individual pipeline stages without tracking total remaining deadline budgets?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It creates compiler errors.' },
                  { id: 'opt_2', text: 'The sum of all individual timeouts can dramatically exceed the total client SLA, keeping callers waiting long after they have abandoned the request.' },
                  { id: 'opt_3', text: 'It uses too many CPU registers.' },
                  { id: 'opt_4', text: 'There is no danger.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Without a shared deadline budget, each stage can exhaust its full timeout, resulting in cumulative durations that vastly exceed user SLAs.'
              }
            ]
          },
          key_takeaways: [
            'Propagate remaining deadline budgets across pipeline stages.',
            'Apply graceful degradation for non-critical stages that time out.',
            'Always set aggressive, bounded timeouts on external network calls.'
          ],
          revision_prompts: [
            'How does gRPC propagate deadline metadata across microservice boundaries?',
            'What is the difference between client-side timeouts and server-side timeouts?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-pipeline-configuration-management',
          slug: 'configuration-management-for-reliable-services',
          title: 'Configuration Management for Reliable Services: Validation and Dynamic Reloading',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 8,
          summary: 'Validate configuration hierarchies, detect missing secrets at startup, and avoid runtime crashes caused by misconfigured environments.',
          learning_objectives: [
            'Validate all environment variables and configuration schemas at startup (fail-fast principle)',
            'Provide sensible defaults for non-sensitive options while requiring secrets strictly',
            'Prevent runtime crashes caused by type mismatches in configuration values'
          ],
          content_markdown: `### Fail-Fast Configuration Validation

A service should **never start up** if required configuration is missing:
- If \`DATABASE_URL\` is missing or malformed, crashing 2 hours later during the first customer write is unacceptable.
- **Fail-Fast**: Validate all environment settings on boot. If any key fails validation, print a clear diagnostic error and exit with a non-zero code immediately.`,
          code_snippet: `import os

class ConfigurationError(Exception): pass

class ServiceSettings:
    def __init__(self):
        # Mandatory secret: must exist and be non-empty
        api_key = os.environ.get("SERVICE_API_KEY", "")
        if not api_key:
            # For demonstration, use a fallback but warn
            print("[CONFIG WARNING] SERVICE_API_KEY unset; using simulated test key.")
            api_key = "test_key_simulated"

        # Validated numeric parameter
        try:
            self.max_concurrency = int(os.environ.get("MAX_CONCURRENCY", "10"))
            if self.max_concurrency <= 0:
                raise ValueError()
        except ValueError:
            raise ConfigurationError("MAX_CONCURRENCY must be a positive integer.")

        self.api_key = api_key

settings = ServiceSettings()
print(f"Validated Settings: Max Concurrency={settings.max_concurrency}, Key set={bool(settings.api_key)}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates fail-fast configuration validation, validating types and positive bounds during initialization.',
          expected_output: `[CONFIG WARNING] SERVICE_API_KEY unset; using simulated test key.
Validated Settings: Max Concurrency=10, Key set=True`,
          quiz: {
            id: 'quiz-l4-config-validation',
            title: 'Config Validation Check',
            questions: [
              {
                id: 'q-l4-cv-1',
                question_text: 'Why should services validate all environment variables at startup rather than reading them lazily when first needed?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To save RAM.' },
                  { id: 'opt_2', text: 'To fail-fast on boot if misconfigured, preventing deployment of broken containers that fail hours later during user traffic.' },
                  { id: 'opt_3', text: 'Because os.environ can only be read once.' },
                  { id: 'opt_4', text: 'To encrypt the hard drive.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Validating configuration at startup guarantees that a misconfigured container fails immediately during deployment health checks, preventing faulty releases.'
              }
            ]
          },
          key_takeaways: [
            'Validate all environment variables and configuration schemas at startup (fail-fast).',
            'Enforce strict types and bounds on configuration values.',
            'Never allow services to boot with missing mandatory secrets.'
          ],
          revision_prompts: [
            'How can Pydantic BaseSettings automate environment variable parsing and validation?',
            'What is the security risk of printing the entire configuration object to debug logs?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-health-checks-operational-visibility',
          slug: 'health-checks-and-operational-visibility',
          title: 'Health Checks and Operational Visibility: Liveness vs Readiness Probes',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 9,
          summary: 'Design Kubernetes-compatible liveness and readiness probes to manage traffic routing and automated container restarts.',
          learning_objectives: [
            'Differentiate Liveness Probes (is the process alive or deadlocked?) from Readiness Probes (can it accept traffic?)',
            'Implement shallow vs deep dependency checks without cascading downtime',
            'Return standard HTTP status codes (200 OK vs 503 Service Unavailable)'
          ],
          content_markdown: `### Liveness vs Readiness Probes

Container orchestrators (Kubernetes, AWS ECS) use probes to manage service lifecycles:

1. **Liveness Probe (\`/healthz/live\`)\**:
   - Question: *Is the process alive and responsive, or deadlocked/hung?*
   - If it fails: The orchestrator **kills the container and restarts it**.
   - Must be lightweight and have **no external dependencies**!

2. **Readiness Probe (\`/healthz/ready\`)\**:
   - Question: *Is the service ready to handle customer traffic right now?*
   - Checks: Database connection initialized, local cache warmed up.
   - If it fails: The load balancer stops routing traffic to this instance, but does **NOT** kill it.`,
          code_snippet: `class HealthCheckController:
    def __init__(self):
        self.is_shutting_down = False
        self.db_connected = True

    def liveness_check(self) -> tuple[int, dict]:
        # Shallow check: process is alive and event loop is responsive
        return 200, {"status": "ALIVE"}

    def readiness_check(self) -> tuple[int, dict]:
        # Deep check: can we serve traffic right now?
        if self.is_shutting_down:
            return 503, {"status": "DRAINING_TRAFFIC"}
        if not self.db_connected:
            return 503, {"status": "DATABASE_DISCONNECTED"}
        return 200, {"status": "READY"}

controller = HealthCheckController()
print("Liveness: ", controller.liveness_check())
print("Readiness:", controller.readiness_check())

# Graceful shutdown initiated
controller.is_shutting_down = True
print("Readiness during shutdown drain:", controller.readiness_check())`,
          code_language: 'python',
          code_explanation: 'Demonstrates the architectural distinction between shallow liveness probes and state-aware readiness probes.',
          expected_output: `Liveness:  (200, {'status': 'ALIVE'})
Readiness: (200, {'status': 'READY'})
Readiness during shutdown drain: (503, {'status': 'DRAINING_TRAFFIC'})`,
          quiz: {
            id: 'quiz-l4-health-checks',
            title: 'Health Checks Check',
            questions: [
              {
                id: 'q-l4-hc-1',
                question_text: 'Why should a Liveness Probe NOT perform deep database queries or check external third-party APIs?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because databases do not support health checks.' },
                  { id: 'opt_2', text: 'Because if the database goes down, all application containers will fail their liveness probe simultaneously and reboot endlessly in a crash loop.' },
                  { id: 'opt_3', text: 'To save network bandwidth.' },
                  { id: 'opt_4', text: 'Liveness probes only run on weekends.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'If a liveness probe checks external dependencies, a brief external database outage will cause the orchestrator to restart all containers simultaneously, creating a catastrophic crash loop.'
              }
            ]
          },
          key_takeaways: [
            'Liveness probes verify process health and restart hung containers.',
            'Readiness probes verify external dependencies and remove unready containers from load balancers.',
            'Never check external dependencies inside liveness probes.'
          ],
          revision_prompts: [
            'What is a Startup Probe in Kubernetes and why is it useful for slow-loading Python applications?',
            'What HTTP status code should a probe return during graceful shutdown draining?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-testing-failures-recovery-behavior',
          slug: 'testing-failures-and-recovery-behavior',
          title: 'Testing Failures and Recovery Behavior: Fault Injection and Chaos Testing',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 10,
          summary: 'Simulate network drops, disk-full errors, and corrupted payloads in automated tests to prove recovery behavior.',
          learning_objectives: [
            'Write automated tests that deliberately inject faults and network failures',
            'Verify that pipelines recover gracefully and preserve partial data',
            'Test circuit breaker transitions between CLOSED, OPEN, and HALF_OPEN states'
          ],
          content_markdown: `### Proving Failure Recovery with Tests

Do not assume your error handling works just because you wrote a \`try...except\` block:
- **Fault Injection**: Mock dependencies to raise specific errors (\`ConnectionResetError\`, \`TimeoutError\`, \`sqlite3.OperationalError\`).
- **Assertions**:
  1. Verify the service returns a graceful fallback response.
  2. Verify an alert/log was emitted.
  3. Verify database transactions rolled back completely with zero orphaned records.`,
          code_snippet: `class FaultyDownstreamService:
    def __init__(self, failure_rate: int = 2):
        self.attempts = 0
        self.failure_rate = failure_rate

    def call_api(self):
        self.attempts += 1
        if self.attempts <= self.failure_rate:
            raise ConnectionError("Simulated socket timeout fault")
        return "SUCCESS_DATA"

def robust_client(service: FaultyDownstreamService) -> str:
    # Service with recovery fallback
    for _ in range(3):
        try:
            return service.call_api()
        except ConnectionError:
            pass # In real code, backoff with jitter
    return "DEGRADED_DEFAULT_DATA"

# Test fault recovery
faulty_svc = FaultyDownstreamService(failure_rate=2)
result = robust_client(faulty_svc)
print(f"Client recovered successfully after {faulty_svc.attempts} attempts: {result}")`,
          code_language: 'python',
          code_explanation: 'Tests verify that the client handles simulated downstream failures and succeeds when the service stabilizes.',
          expected_output: `Client recovered successfully after 3 attempts: SUCCESS_DATA`,
          quiz: {
            id: 'quiz-l4-fault-injection',
            title: 'Fault Injection Check',
            questions: [
              {
                id: 'q-l4-fi-1',
                question_text: 'Why is fault injection testing necessary in distributed systems?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To prove that code works when everything succeeds.' },
                  { id: 'opt_2', text: 'To verify empirically that retry policies, fallbacks, and rollback mechanisms function correctly when simulated failures occur.' },
                  { id: 'opt_3', text: 'To delete unit tests.' },
                  { id: 'opt_4', text: 'To format code.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Fault injection proves that error recovery code paths actually work as expected under adverse network, database, and hardware conditions.'
              }
            ]
          },
          key_takeaways: [
            'Test failure paths as rigorously as success paths.',
            'Inject simulated network faults, timeouts, and corrupted payloads in test harnesses.',
            'Assert that transactions roll back and dead-letter queues capture invalid records.'
          ],
          revision_prompts: [
            'What is Chaos Engineering (e.g. Chaos Monkey)?',
            'How can unittest.mock.patch(side_effect=...) inject simulated exceptions in tests?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-designing-reliable-background-jobs',
          slug: 'designing-reliable-background-jobs',
          title: 'Designing Reliable Background Jobs: Task Queues, Leases, and Heartbeats',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 11,
          summary: 'Build resilient background workers using visibility timeouts, task leasing, and graceful shutdown signal handling.',
          learning_objectives: [
            'Understand task queue leasing and visibility timeouts (Celery, SQS, Redis)',
            'Handle SIGTERM signals to complete in-flight jobs before container termination',
            'Prevent zombie tasks using worker heartbeats'
          ],
          content_markdown: `### The Challenge of Distributed Background Workers

When running asynchronous background tasks (Celery, RQ, AWS SQS):
1. **At-Least-Once Delivery**: Networks drop packets; workers crash. Most queues guarantee a message is delivered **at least once**, meaning a task may be delivered multiple times!
2. **Visibility Timeouts (Leases)**: When a worker fetches a job, the queue hides it for $N$ seconds. If the worker does not acknowledge completion before the lease expires, the job reappears for another worker.
3. **Graceful SIGTERM Draining**: When scaling down or deploying, the OS sends \`SIGTERM\`. Workers must stop accepting new jobs, finish current jobs, and exit cleanly.`,
          code_snippet: `import signal
import time

class GracefulWorker:
    def __init__(self):
        self.keep_running = True

    def handle_signal(self, signum, frame):
        print(f"\\n[SIGNAL RECEIVED] Received signal {signum}. Draining active jobs before shutdown...")
        self.keep_running = False

    def process_jobs(self, job_list: list[str]):
        for job in job_list:
            if not self.keep_running:
                print(f"[SHUTDOWN] Skipping {job}; worker is draining.")
                break
            print(f"[JOB EXECUTING] Processing {job}...")
            time.sleep(0.01)

worker = GracefulWorker()
# Simulate processing with a shutdown triggered
jobs = ["Task_A", "Task_B", "Task_C"]
worker.process_jobs(jobs[:2])
worker.handle_signal(signal.SIGTERM, None)
worker.process_jobs(jobs[2:])`,
          code_language: 'python',
          code_explanation: 'Demonstrates graceful shutdown signal handling, finishing current jobs and draining gracefully without dropping tasks.',
          expected_output: `[JOB EXECUTING] Processing Task_A...
[JOB EXECUTING] Processing Task_B...

[SIGNAL RECEIVED] Received signal 15. Draining active jobs before shutdown...
[SHUTDOWN] Skipping Task_C; worker is draining.`,
          quiz: {
            id: 'quiz-l4-background-jobs',
            title: 'Background Jobs Check',
            questions: [
              {
                id: 'q-l4-bj-1',
                question_text: 'What is a "visibility timeout" in a message queue system like AWS SQS or Redis RQ?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'How long a message is displayed on a monitor.' },
                  { id: 'opt_2', text: 'The period of time during which a message is hidden from other workers while being processed by the worker that leased it.' },
                  { id: 'opt_3', text: 'The time before an email is deleted.' },
                  { id: 'opt_4', text: 'The frame rate of an animation.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A visibility timeout leases a message to a worker. If the worker crashes before acknowledging completion, the message becomes visible to other workers.'
              }
            ]
          },
          key_takeaways: [
            'Design background jobs to be idempotent to handle at-least-once message delivery.',
            'Use visibility timeouts to automatically re-queue abandoned jobs if a worker crashes.',
            'Trap SIGTERM signals to finish in-flight tasks cleanly during deployments.'
          ],
          revision_prompts: [
            'What is the difference between a task queue (Celery) and an event log (Kafka)?',
            'How can heartbeats prevent false-positive task re-queues during long-running tasks?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-observability-metrics-logs-traces',
          slug: 'understanding-observability-fundamentals',
          title: 'Understanding Observability Fundamentals: The Three Pillars (Metrics, Logs, Traces)',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 12,
          summary: 'Synthesize the three pillars of modern observability: Aggregated metrics (Prometheus), structured logs (Elasticsearch), and distributed traces (OpenTelemetry).',
          learning_objectives: [
            'Explain the complementary roles of the Three Pillars: Metrics, Logs, and Traces',
            'Track system counters, gauges, and latency histograms',
            'Correlate trace spans with structured logs to diagnose distributed production incidents'
          ],
          content_markdown: `### The Three Pillars of Observability

1. **Metrics (Aggregated Statistics)**:
   - Numerical data points aggregated over time (e.g. CPU %, request rate, p99 latency).
   - High-level alerts: *“Error rate just jumped above 2%!”*
   - Tools: Prometheus, Datadog.

2. **Logs (Contextual Event Records)**:
   - Discrete, timestamped JSON records of events.
   - Deep inspection: *“Show me the stack trace for user 42’s checkout failure.”*
   - Tools: Elasticsearch, Grafana Loki.

3. **Traces (Request Pathways)**:
   - Tracks a request’s journey across microservices, databases, and message queues with latency breakdown spans.
   - Anomaly localization: *“Which microservice took 800ms of our 1.0s request?”*
   - Tools: OpenTelemetry, Jaeger.`,
          code_snippet: `class TelemetryTracker:
    def __init__(self):
        self.counters = {"requests_total": 0, "errors_total": 0}
        self.latencies_ms = []

    def record_request(self, duration_ms: float, is_error: bool = False):
        self.counters["requests_total"] += 1
        if is_error:
            self.counters["errors_total"] += 1
        self.latencies_ms.append(duration_ms)

    def print_observability_summary(self):
        total = self.counters["requests_total"]
        errs = self.counters["errors_total"]
        avg_lat = sum(self.latencies_ms) / len(self.latencies_ms) if self.latencies_ms else 0.0
        print(f"[METRICS] Total: {total} | Errors: {errs} ({errs/total*100:.1f}%) | Avg Latency: {avg_lat:.1f} ms")

telemetry = TelemetryTracker()
telemetry.record_request(45.2)
telemetry.record_request(52.1)
telemetry.record_request(310.5, is_error=True)
telemetry.print_observability_summary()`,
          code_language: 'python',
          code_explanation: 'Demonstrates metric tracking, capturing request counts, error rates, and latency statistics for observability monitoring.',
          expected_output: `[METRICS] Total: 3 | Errors: 1 (33.3%) | Avg Latency: 135.9 ms`,
          quiz: {
            id: 'quiz-l4-observability',
            title: 'Observability Pillars Check',
            questions: [
              {
                id: 'q-l4-ob-1',
                question_text: 'Which pillar of observability is designed to track a single request as it traverses across multiple microservices and database queries?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Distributed Tracing (Spans)' },
                  { id: 'opt_2', text: 'Counter Metrics' },
                  { id: 'opt_3', text: 'Code Comments' },
                  { id: 'opt_4', text: 'Operating System Kernels' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Distributed tracing instruments requests with trace and span IDs, mapping the end-to-end journey and timing across every participating microservice.'
              }
            ]
          },
          key_takeaways: [
            'Metrics detect anomalies and trigger alerts.',
            'Logs explain why an error occurred with rich context.',
            'Traces pinpoint where latency bottlenecks occurred across distributed services.'
          ],
          revision_prompts: [
            'What is OpenTelemetry (OTel) and why has it become the industry standard for telemetry collection?',
            'What is the difference between a gauge metric and a counter metric?'
          ]
        }
      ]
    }
  ]
};
