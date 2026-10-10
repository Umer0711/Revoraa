// Module 4: Production Testing and Quality Assurance (12 Lessons)
// Comprehensive test engineering, test pyramid, pytest fixtures, mock boundaries, coverage realities, Ruff, Mypy CI

export const MODULE_4_PRODUCTION_TESTING_QA = {
  id: 'mod-l5-4',
  slug: 'production-testing-and-quality-assurance',
  title: 'Production Testing and Quality Assurance',
  tagline: 'Engineer automated quality gates: unit tests, integration fixtures, Ruff linting, Mypy, and branch coverage.',
  description: 'Master the test pyramid, pytest fixtures, boundary mocking with auto-specs, database test isolation, branch coverage realities, Ruff static analysis, strict Mypy CI configuration, and eradicating test flakiness.',
  level_number: 5,
  sort_order: 4,
  is_published: true,
  topics: [
    {
      id: 'top-l5-4-1',
      slug: 'testing-strategy-and-fixtures',
      title: 'Testing Strategy, Fixtures & Isolation',
      summary: 'Design a balanced testing pyramid, structure reusable pytest fixtures with clean teardown, and isolate databases.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l5-4-1',
          slug: 'designing-a-comprehensive-test-strategy',
          title: 'Designing a Comprehensive Test Strategy',
          summary: 'Understand the Test Pyramid: balancing fast unit tests, realistic integration tests, and focused end-to-end checks.',
          estimated_minutes: 20,
          xp_reward: 40,
          learning_objectives: [
            'Analyze the Testing Pyramid: Unit, Integration, and End-to-End (E2E)',
            'Avoid the Ice Cream Cone anti-pattern (over-reliance on slow E2E tests)',
            'Allocate test budgets to maximize confidence while minimizing CI runtime'
          ],
          content_markdown: `### The Testing Pyramid

A healthy test suite is shaped like a pyramid:

\`\`\`
      /\\
     / E2E \\        <- Fewest (slow, expensive, tests full journeys)
    /------- \\
   / Integration \\   <- Moderate (tests DB, cache, API contracts)
  /---------------\\
 /   Unit Tests    \\ <- Most (thousands, runs in milliseconds, pure logic)
/-------------------\\
\`\`\`

### The "Ice Cream Cone" Anti-Pattern

When teams rely heavily on UI or end-to-end tests:
- Test suites take 45+ minutes to run in CI.
- Tests fail unpredictably due to network jitter (flakiness).
- Developers stop running tests locally before pushing code.

**Best Practice**: Test business logic extensively with microsecond unit tests; verify database and external API integrations with targeted integration tests; and use a small handful of end-to-end tests for critical user journeys.`,
          code_snippet: `# Simulating test suite distribution audit
def audit_test_suite_pyramid(unit: int, integration: int, e2e: int) -> dict:
    total = unit + integration + e2e
    unit_pct = round((unit / total) * 100, 1)
    e2e_pct = round((e2e / total) * 100, 1)
    
    is_healthy = unit_pct >= 60 and e2e_pct <= 15
    return {
        "total_tests": total,
        "unit_percentage": f"{unit_pct}%",
        "e2e_percentage": f"{e2e_pct}%",
        "pyramid_health": "HEALTHY" if is_healthy else "INVERTED_ANTIPATTERN"
    }

report = audit_test_suite_pyramid(unit=450, integration=80, e2e=20)
print(f"Test Suite Status: {report['pyramid_health']}")
print(f"Unit Tests: {report['unit_percentage']} | E2E Tests: {report['e2e_percentage']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates quantitative test suite analysis, verifying that fast unit tests form the vast foundation of the automated testing pyramid.',
          expected_output: `Test Suite Status: HEALTHY
Unit Tests: 81.8% | E2E Tests: 3.6%`,
          quiz: {
            id: 'quiz-l5-4-1',
            title: 'Test Pyramid Check',
            questions: [
              {
                id: 'q-l5-4-1-1',
                question: 'Why should unit tests comprise the vast majority (70-80%) of an automated test suite?',
                options: [
                  { id: 'opt_1', text: 'Unit tests run in milliseconds, require no external infrastructure, and pinpoint the exact line of code that failed.' },
                  { id: 'opt_2', text: 'Unit tests are the only tests that can run on Linux.' },
                  { id: 'opt_3', text: 'End-to-end tests are illegal in corporate environments.' },
                  { id: 'opt_4', text: 'Unit tests compile Python code into C binaries.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Unit tests provide instant feedback during development, enabling fast iteration without waiting for slow databases or network timeouts.'
              }
            ]
          },
          key_takeaways: [
            'Follow the Test Pyramid: majority unit tests, focused integration tests, few E2E tests.',
            'Avoid the inverted Ice Cream Cone anti-pattern that creates slow, flaky CI runs.',
            'Test business logic extensively in isolated memory.'
          ],
          revision_prompts: [
            'When should you promote a test scenario from a unit test to an integration test?'
          ]
        },
        {
          id: 'les-l5-4-2',
          slug: 'unit-integration-and-end-to-end-testing',
          title: 'Unit, Integration, and End-to-End Testing in Python',
          summary: 'Contrast the responsibilities, execution speed, and failure signatures of unit, integration, and E2E tests.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Define precise boundaries for unit vs integration tests',
            'Use pytest markers (@pytest.mark.integration) to separate test tiers',
            'Run fast unit tests on pre-commit and heavy integration suites in CI'
          ],
          content_markdown: `### The Three Tiers of Testing

1. **Unit Tests**:
   - Scope: A single function, method, or class.
   - Dependencies: Replaced with pure Python test doubles or in-memory fakes.
   - Speed: < 5 milliseconds per test.
2. **Integration Tests**:
   - Scope: Two or more components working together (e.g. Repository + SQLite database).
   - Dependencies: Real databases, local containers, or filesystems.
   - Speed: 10 - 200 milliseconds per test.
3. **End-to-End (E2E) Tests**:
   - Scope: The entire running application from HTTP entry to database to background workers.
   - Speed: 1 - 10 seconds per test.

### Marking Tests with Pytest

\`\`\`python
import pytest

def test_calculate_fee_unit():
    # Runs instantaneously in default pytest run:
    assert calculate_fee(100) == 5

@pytest.mark.integration
def test_user_repository_postgres():
    # Skipped during fast pre-commit checks:
    repo = PostgresUserRepository(test_db_url)
    assert repo.find("usr_101") is not None
\`\`\``,
          code_snippet: `# Simulating tier filtering in test harnesses
def classify_test(test_name: str, duration_sec: float, uses_network: bool) -> str:
    if uses_network or duration_sec > 1.0:
        return "E2E"
    elif duration_sec > 0.05 or "db" in test_name:
        return "INTEGRATION"
    return "UNIT"

print(f"test_tax_calc: {classify_test('test_tax_calc', 0.001, False)}")
print(f"test_save_db: {classify_test('test_save_db', 0.08, False)}")
print(f"test_checkout_flow: {classify_test('test_checkout_flow', 2.5, True)}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates classification of tests based on execution duration, network reliance, and database coupling.',
          expected_output: `test_tax_calc: UNIT
test_save_db: INTEGRATION
test_checkout_flow: E2E`,
          quiz: {
            id: 'quiz-l5-4-2',
            title: 'Test Tiers Check',
            questions: [
              {
                id: 'q-l5-4-2-1',
                question: 'Why is it common to mark integration tests with `@pytest.mark.integration` in large Python codebases?',
                options: [
                  { id: 'opt_1', text: 'To allow developers to run fast unit tests instantly during local coding (pytest -m "not integration"), reserving slow integration tests for pre-push or CI.' },
                  { id: 'opt_2', text: 'Because pytest crashes if integration tests are not marked.' },
                  { id: 'opt_3', text: 'To compile integration tests with CPython.' },
                  { id: 'opt_4', text: 'It increases database connection speed.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Marking tests enables selective test execution, maintaining developer velocity by keeping local inner-loop test runs under 2 seconds.'
              }
            ]
          },
          key_takeaways: [
            'Unit tests verify pure logic without network or database I/O.',
            'Integration tests verify component boundaries and persistence layers.',
            'Use pytest markers to separate fast unit runs from slow integration runs.'
          ],
          revision_prompts: [
            'How can you configure pytest.ini to fail if an unregistered marker is used?'
          ]
        },
        {
          id: 'les-l5-4-3',
          slug: 'test-fixtures-and-isolated-environments',
          title: 'Pytest Fixtures and Lifecycle Management',
          summary: 'Build clean, reusable fixtures using pytest.fixture, scope control (function, session), and yield teardowns.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand pytest dependency injection via fixtures',
            'Control fixture scopes: function, class, module, and session',
            'Implement guaranteed teardown cleanup using yield fixtures'
          ],
          content_markdown: `### The Power of Pytest Fixtures

In standard unittest, \`setUp()\` and \`tearDown()\` couple all tests to the same class lifecycle.
In **pytest**, fixtures are modular, composable, and injected by parameter name!

\`\`\`python
import pytest

@pytest.fixture
def temp_database():
    # 1. SETUP:
    db = create_sqlite_in_memory()
    db.create_tables()
    
    # 2. YIELD resource to the test:
    yield db
    
    # 3. TEARDOWN: Guaranteed to execute even if the test fails!
    db.close()

def test_insert_user(temp_database):
    temp_database.insert({"id": 1, "name": "Alice"})
    assert temp_database.count() == 1
\`\`\`

### Fixture Scopes:
- \`scope="function"\` (default): Fresh fixture instance for every test method.
- \`scope="session"\`: Created once across the entire test run (great for expensive Docker containers or schema compilation).`,
          code_snippet: `# Simulating a generator-based fixture with guaranteed teardown
class MockDatabase:
    def __init__(self):
        self.is_connected = True
    def close(self):
        self.is_connected = False

def simulate_fixture_lifecycle():
    # Setup
    db = MockDatabase()
    print(f"Fixture Setup: DB Connected = {db.is_connected}")
    try:
        yield db
    finally:
        # Teardown
        db.close()
        print(f"Fixture Teardown: DB Connected = {db.is_connected}")

# Executing test lifecycle:
fixture_gen = simulate_fixture_lifecycle()
active_db = next(fixture_gen)
# Test asserts here...
try:
    next(fixture_gen)
except StopIteration:
    pass`,
          code_language: 'python',
          code_explanation: 'Demonstrates how pytest uses generator yield expressions with finally blocks to guarantee resource teardown after test execution.',
          expected_output: `Fixture Setup: DB Connected = True
Fixture Teardown: DB Connected = False`,
          quiz: {
            id: 'quiz-l5-4-3',
            title: 'Pytest Fixture Check',
            questions: [
              {
                id: 'q-l5-4-3-1',
                question: 'In a pytest fixture that uses `yield`, when does the code after the `yield` statement execute?',
                options: [
                  { id: 'opt_1', text: 'Immediately after the test function finishes executing (acting as teardown cleanup).' },
                  { id: 'opt_2', text: 'Before the test function starts.' },
                  { id: 'opt_3', text: 'Only if the test raises an AssertionError.' },
                  { id: 'opt_4', text: 'It is never executed.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Pytest executes fixture code up to the yield statement before the test, yields the value to the test, and executes post-yield code immediately after the test completes.'
              }
            ]
          },
          key_takeaways: [
            'pytest fixtures provide modular, composable dependency injection for tests.',
            'Use yield inside fixtures to guarantee teardown cleanup in finally blocks.',
            'Choose appropriate fixture scopes (function vs session) to balance isolation and speed.'
          ],
          revision_prompts: [
            'What is the risk of using scope="session" for fixtures that mutate database tables?'
          ]
        },
        {
          id: 'les-l5-4-4',
          slug: 'mocking-external-dependencies-appropriately',
          title: 'Mocking External Dependencies Appropriately',
          summary: 'Use unittest.mock.patch with autospec=True and avoid the trap of testing your mocks.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Apply unittest.mock.patch without leaking mock state across tests',
            'Enforce method signatures using autospec=True to prevent stale mock bugs',
            'Avoid over-mocking: mock only at architecture boundaries (HTTP, disk, time)'
          ],
          content_markdown: `### The Danger of "Testing Your Mocks"

Mocking is essential for replacing third-party APIs (Stripe, Twilio, AWS S3) that cannot be called during unit tests.

However, junior developers often mock internal helper classes:
\`\`\`python
# ANTI-PATTERN: Over-mocking internal methods
mock_calc.calculate.return_value = 42
assert service.run() == 42 # You tested nothing! You tested your mock configuration!
\`\`\`

### The \`autospec=True\` Golden Rule

By default, Python's \`MagicMock\` accepts **any** attribute or method call:
\`\`\`python
mock = MagicMock()
mock.completely_fictional_method_name(1, 2, 3) # Passes silently!
\`\`\`
If you refactor your service from \`client.send_email()\` to \`client.dispatch()\`, un-specced mocks will pass in CI while production crashes!
Always use **\`autospec=True\`**:
\`\`\`python
@patch("revoraa.adapters.email.SmtpClient", autospec=True)
def test_notification(mock_smtp):
    # Fails immediately if method name or signature does not match SmtpClient!
\`\`\``,
          code_snippet: `from unittest.mock import create_autospec

class RealEmailService:
    def send_email(self, recipient: str, subject: str) -> bool:
        return True

# Auto-specced mock strictly enforces method signatures
mock_service = create_autospec(RealEmailService, instance=True)

# Calling existing method works:
mock_service.send_email("alice@revoraa.dev", "Welcome")
print(f"Call count: {mock_service.send_email.call_count}")

# Calling non-existent method raises AttributeError:
try:
    mock_service.non_existent_method()
except AttributeError as err:
    print(f"Caught invalid method call: {err}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates create_autospec enforcing that the mock mirrors the real class interface, catching typos and stale refactored method calls at test time.',
          expected_output: `Call count: 1
Caught invalid method call: Mock object has no attribute 'non_existent_method'`,
          quiz: {
            id: 'quiz-l5-4-4',
            title: 'Auto-Spec Mocking Check',
            questions: [
              {
                id: 'q-l5-4-4-1',
                question: 'Why should you always pass autospec=True when using unittest.mock.patch on a production class?',
                options: [
                  { id: 'opt_1', text: 'It forces the mock to mirror the real class signatures, catching invalid method names and incorrect argument counts.' },
                  { id: 'opt_2', text: 'It connects the mock to live production servers.' },
                  { id: 'opt_3', text: 'It converts the test into an asynchronous coroutine.' },
                  { id: 'opt_4', text: 'It makes the test run in parallel.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Standard mocks allow calling arbitrary nonexistent methods. autospec=True inspects the target class, causing tests to fail fast if code calls removed or altered methods.'
              }
            ]
          },
          key_takeaways: [
            'Mock only at architectural boundaries (external APIs, clocks, network).',
            'Always use autospec=True to prevent tests from passing with obsolete method signatures.',
            'Never mock internal domain logic; test real domain objects directly.'
          ],
          revision_prompts: [
            'Where should patch() target: where an object is defined, or where it is imported and used?'
          ]
        },
        {
          id: 'les-l5-4-5',
          slug: 'testing-api-boundaries',
          title: 'Testing API Boundaries: Contracts and HTTP Clients',
          summary: 'Test web APIs in-memory using TestClient and httpx.AsyncClient without binding physical network ports.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Use ASGI/WSGI in-process test clients for zero-latency API testing',
            'Assert HTTP status codes, JSON payload schemas, and headers',
            'Test authentication middleware and forbidden access rejection'
          ],
          content_markdown: `### In-Process API Testing

Starting a live web server on \`http://127.0.0.1:8000\` and querying it with \`requests\` is slow and prone to port collision errors.

Modern Python web frameworks (FastAPI, Starlette, Django) support **in-process ASGI/WSGI test clients** (like \`httpx.AsyncClient(app=app, base_url="http://test")\`):
1. Requests bypass the OS network stack and socket layer.
2. The HTTP request is passed directly into the Python application callable in memory.
3. Tests execute in **1 to 2 milliseconds** while exercising the full routing, middleware, authentication, and serialization pipeline!`,
          code_snippet: `# Simulating an in-memory WSGI/ASGI dispatch test
def dummy_app(method: str, path: str, headers: dict) -> tuple:
    if "Authorization" not in headers:
        return 401, {"error": "Unauthorized"}
    if path == "/api/health":
        return 200, {"status": "HEALTHY"}
    return 404, {"error": "Not Found"}

# Test client simulation:
def test_api_client(app_fn, path: str, auth_token: str = None) -> tuple:
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    return app_fn("GET", path, headers)

status, body = test_api_client(dummy_app, "/api/health", auth_token="valid_jwt")
print(f"Health Check: HTTP {status} -> {body}")

status401, body401 = test_api_client(dummy_app, "/api/health", auth_token=None)
print(f"Missing Auth: HTTP {status401} -> {body401}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates testing API routing and authentication in memory without network sockets or port allocation.',
          expected_output: `Health Check: HTTP 200 -> {'status': 'HEALTHY'}
Missing Auth: HTTP 401 -> {'error': 'Unauthorized'}`,
          quiz: {
            id: 'quiz-l5-4-5',
            title: 'In-Process API Testing Check',
            questions: [
              {
                id: 'q-l5-4-5-1',
                question: 'What is the primary architectural advantage of using an ASGI/WSGI TestClient (like httpx or starlette.testclient) over making live HTTP requests to localhost?',
                options: [
                  { id: 'opt_1', text: 'It executes in-memory without binding TCP ports or network sockets, running 100x faster and eliminating port-binding collisions in CI.' },
                  { id: 'opt_2', text: 'It bypasses all Python validation rules.' },
                  { id: 'opt_3', text: 'It automatically writes documentation in Markdown.' },
                  { id: 'opt_4', text: 'It encrypts test files on disk.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'In-process test clients feed ASGI/WSGI scope dictionaries directly into the application, testing the complete web pipeline in microseconds without OS networking overhead.'
              }
            ]
          },
          key_takeaways: [
            'Test web APIs using in-process ASGI/WSGI clients (httpx, TestClient).',
            'In-memory dispatch exercises routing, middleware, and schemas in milliseconds.',
            'Always test happy paths, 401 Unauthorized, 403 Forbidden, and 422 Validation errors.'
          ],
          revision_prompts: [
            'How can database sessions be rolled back at the end of each API test request?'
          ]
        },
        {
          id: 'les-l5-4-6',
          slug: 'database-testing-and-cleanup',
          title: 'Database Testing and Transactional Rollbacks',
          summary: 'Isolate database tests with zero state leakage using transactional rollbacks and in-memory SQLite instances.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Implement transactional rollback isolation for database tests',
            'Understand SQLite in-memory testing vs PostgreSQL testcontainers',
            'Prevent test order pollution caused by residual database rows'
          ],
          content_markdown: `### The Challenge of Database State Pollution

If Test A inserts a user with ID 1, and Test B expects the database to be empty:
- Running Test B alone passes!
- Running Test A followed by Test B causes Test B to fail!

### The Transactional Rollback Pattern

Instead of dropping and recreating database tables for every test (which takes seconds):
1. Wrap every test execution in an outer database **transaction** (\`BEGIN\`).
2. The test runs, inserts rows, and executes queries.
3. At the end of the test, issue a **\`ROLLBACK\`**!

The database immediately returns to its pristine state in microseconds, with zero persistent mutations!`,
          code_snippet: `import sqlite3

def run_isolated_test(conn):
    # Begin savepoint
    conn.execute("SAVEPOINT test_isolation")
    try:
        # Test code inserts rows:
        conn.execute("INSERT INTO audit_log VALUES ('test_event')")
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM audit_log")
        assert cur.fetchone()[0] == 1
    finally:
        # Guaranteed rollback to savepoint:
        conn.execute("ROLLBACK TO SAVEPOINT test_isolation")

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE audit_log (msg TEXT)")

# Run test
run_isolated_test(conn)

# Verify DB is completely empty again:
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM audit_log")
row_count = cur.fetchone()[0]
print(f"Row count after test rollback: {row_count} (Clean database!)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates database test isolation using SQL SAVEPOINT and ROLLBACK. The database returns to its clean state immediately with zero row leakage.',
          expected_output: `Row count after test rollback: 0 (Clean database!)`,
          quiz: {
            id: 'quiz-l5-4-6',
            title: 'Database Rollback Check',
            questions: [
              {
                id: 'q-l5-4-6-1',
                question: 'Why is rolling back an outer transaction at the end of a database test preferred over dropping and recreating all tables?',
                options: [
                  { id: 'opt_1', text: 'Rolling back a transaction takes sub-millisecond time, whereas dropping and recreating schemas takes seconds per test, drastically slowing CI.' },
                  { id: 'opt_2', text: 'Because PostgreSQL does not support dropping tables.' },
                  { id: 'opt_3', text: 'Dropping tables deletes the Python interpreter.' },
                  { id: 'opt_4', text: 'Transactions cannot be rolled back in SQLite.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Transactional rollbacks are virtually instantaneous in relational databases, enabling hundreds of isolated integration tests to run in seconds.'
              }
            ]
          },
          key_takeaways: [
            'Use transactional rollbacks or savepoints to isolate database tests cleanly.',
            'Never leave residual rows in a shared test database.',
            'Guarantee rollback in fixture teardown blocks.'
          ],
          revision_prompts: [
            'When can SQLite in-memory tests mask PostgreSQL-specific SQL syntax differences?'
          ]
        }
      ]
    },
    {
      id: 'top-l5-4-2',
      slug: 'qa-tooling-and-ci-gates',
      title: 'QA Tooling, Coverage Realities & Static Analysis',
      summary: 'Measure meaningful branch coverage, configure Ruff and Mypy strict mode, and prevent flaky CI tests.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l5-4-7',
          slug: 'regression-testing',
          title: 'Regression Testing: Catching Bugs Before They Return',
          summary: 'Turn production bugs into permanent regression test fixtures that prove defects are permanently resolved.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand regression testing in maintenance engineering',
            'Write reproducing test cases before writing bug fixes (TDD for bugs)',
            'Prevent fixed defects from re-appearing in future refactors'
          ],
          content_markdown: `### The Golden Protocol for Bug Fixing

When a customer reports a production bug:
1. **Never write the fix first!**
2. **Write a failing test first**: Create a regression test that reproduces the exact defect and asserts expected behavior. Run it and watch it **FAIL** (RED).
3. **Apply the minimal fix**: Modify the production code until the test passes (GREEN).
4. **Commit the test alongside the fix**: The regression test remains in the test suite forever, guaranteeing that future developers cannot accidentally re-introduce the bug.`,
          code_snippet: `# Simulating TDD bug fix reproduction: handling None values
def calculate_discount(price: float, discount_percent: float = None) -> float:
    # BUG FIX: Handle discount_percent is None safely
    if discount_percent is None:
        return price
    return price * (1.0 - (discount_percent / 100.0))

# Regression test case:
def test_regression_discount_none_does_not_crash():
    result = calculate_discount(100.0, None)
    assert result == 100.0, f"Expected 100.0, got {result}"

test_regression_discount_none_does_not_crash()
print("Regression test passed! The defect is proven fixed.")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a regression test that explicitly asserts behavior on edge-case inputs (None), ensuring the defect cannot silently regress.',
          expected_output: `Regression test passed! The defect is proven fixed.`,
          quiz: {
            id: 'quiz-l5-4-7',
            title: 'Regression Testing Check',
            questions: [
              {
                id: 'q-l5-4-7-1',
                question: 'Why should a reproducing regression test be committed alongside every bug fix?',
                options: [
                  { id: 'opt_1', text: 'To prove the fix works and ensure that future refactoring or dependency upgrades cannot silently re-introduce the same defect.' },
                  { id: 'opt_2', text: 'Because git rejects commits labeled "fix" without tests.' },
                  { id: 'opt_3', text: 'To increase the file size of the test suite.' },
                  { id: 'opt_4', text: 'It sends an automated email to the customer.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A regression test serves as an automated safeguard. If any future modification breaks the corrected behavior, CI will fail immediately.'
              }
            ]
          },
          key_takeaways: [
            'Always reproduce bugs with a failing test before applying a code fix.',
            'Commit the regression test to the permanent test suite.',
            'Document the issue tracker ID in the regression test docstring.'
          ],
          revision_prompts: [
            'What is the difference between a functional test and a regression test?'
          ]
        },
        {
          id: 'les-l5-4-8',
          slug: 'coverage-reports-and-their-limitations',
          title: 'Coverage Reports and Their Limitations',
          summary: 'Use coverage.py to measure line vs branch coverage, and recognize why 100% coverage does not mean zero bugs.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Measure line coverage vs branch coverage using coverage.py',
            'Identify vanity coverage metrics (100% line coverage with zero assertions)',
            'Focus coverage on critical business domain algorithms'
          ],
          content_markdown: `### Line Coverage vs Branch Coverage

- **Line Coverage**: Did the interpreter execute line 42?
- **Branch Coverage (\`--branch\`)**: For every \`if/else\`, did the test suite evaluate both the \`True\` path AND the \`False\` path?

\`\`\`python
# Example:
def process(x):
    if x > 0:
        do_something() # If tests only pass x=5, line coverage is 100%, but x<=0 was NEVER tested!
\`\`\`

### The Vanity Metric Trap:
You can achieve 100% test coverage by executing functions without a single \`assert\` statement!
Coverage tells you **what code was executed**, not **whether the code was verified for correctness**. Aim for 80-90% branch coverage on core domain logic rather than obsessing over 100% vanity coverage on boilerplate.`,
          code_snippet: `# Simulating branch coverage calculation
def evaluate_branch_coverage(branches_taken: list, total_branches: int) -> dict:
    unique_taken = len(set(branches_taken))
    pct = round((unique_taken / total_branches) * 100, 1)
    return {
        "unique_branches_exercised": unique_taken,
        "total_branches": total_branches,
        "branch_coverage_percent": pct,
        "meets_target_85": pct >= 85.0
    }

# Function with 4 branches (if/else on two conditions):
# Test ran branches: 1 (True), 2 (False), 3 (True), but missed 4 (False)
report = evaluate_branch_coverage([1, 2, 3], total_branches=4)
print(f"Branch Coverage: {report['branch_coverage_percent']}%")
print(f"Meets Production Gate: {report['meets_target_85']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates branch coverage analysis where missing the alternate conditional path reveals untested edge cases.',
          expected_output: `Branch Coverage: 75.0%
Meets Production Gate: False`,
          quiz: {
            id: 'quiz-l5-4-8',
            title: 'Coverage Realities Check',
            questions: [
              {
                id: 'q-l5-4-8-1',
                question: 'Why can an application with 100% line coverage still suffer from critical production bugs?',
                options: [
                  { id: 'opt_1', text: 'Line coverage only measures if a line ran, not whether edge cases, negative numbers, missing branches, or assertion checks were tested.' },
                  { id: 'opt_2', text: 'Because coverage.py only works on Python 2.' },
                  { id: 'opt_3', text: 'Because line coverage resets to 0% after deployment.' },
                  { id: 'opt_4', text: 'Line coverage is calculated in hexadecimal.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Coverage measures execution, not verification. Code can execute without testing boundary conditions, exception handlers, or verifying return values with assertions.'
              }
            ]
          },
          key_takeaways: [
            'Enable branch coverage (--branch) to verify both sides of boolean conditionals.',
            'High coverage is a diagnostic aid, not a guarantee of defect-free code.',
            'Prioritize deep testing of domain logic over vanity metrics on boilerplate.'
          ],
          revision_prompts: [
            'What is mutation testing (mutmut) and how does it test test-quality?'
          ]
        },
        {
          id: 'les-l5-4-9',
          slug: 'static-analysis-and-code-formatting',
          title: 'Static Analysis and Code Formatting with Ruff',
          summary: 'Replace Black, Flake8, and isort with Ruff for instantaneous, 100x faster linting and formatting.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Configure modern linter and formatter: Ruff (written in Rust)',
            'Set up rule selection (E, F, I, B, UP, S) in pyproject.toml',
            'Enforce automated code formatting on pre-commit hooks'
          ],
          content_markdown: `### The Modern Tooling Revolution: Ruff

Historically, Python developers configured multiple separate tools:
- \`flake8\` for linting.
- \`black\` for formatting.
- \`isort\` for import sorting.
- \`bandit\` for security checks.
Running all four took 10-20 seconds on medium repositories.

**Ruff** replaces all of them in a single tool written in Rust:
- **100x faster**: Lints 100,000 lines of code in under 0.1 seconds!
- Integrates formatting, import sorting, and linting.
- Configured directly in \`pyproject.toml\`:

\`\`\`toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "F",   # Pyflakes
    "I",   # isort (import sorting)
    "B",   # flake8-bugbear (common design bugs)
    "UP",  # pyupgrade (modern Python syntax)
]
\`\`\``,
          code_snippet: `# Simulating automated lint check rule validation
def run_linter_checks(code_lines: list) -> list:
    violations = []
    for line_num, line in enumerate(code_lines, start=1):
        if "import *" in line:
            violations.append(f"Line {line_num}: F403 Star import used (pollutes namespace)")
        if len(line) > 100:
            violations.append(f"Line {line_num}: E501 Line too long ({len(line)} > 100)")
    return violations

sample_code = [
    "from typing import *",
    "x = 10",
    "a = '" + "A" * 110 + "'"
]

issues = run_linter_checks(sample_code)
print(f"Linter detected {len(issues)} violations:")
for issue in issues:
    print(f"  -> {issue}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates static analysis rules detecting star imports and excessive line lengths before code reaches review.',
          expected_output: `Linter detected 2 violations:
  -> Line 1: F403 Star import used (pollutes namespace)
  -> Line 3: E501 Line too long (116 > 100)`,
          quiz: {
            id: 'quiz-l5-4-9',
            title: 'Static Analysis Check',
            questions: [
              {
                id: 'q-l5-4-9-1',
                question: 'Why has Ruff become the modern standard linter and formatter in the Python community?',
                options: [
                  { id: 'opt_1', text: 'It combines the functionality of flake8, black, isort, and pyupgrade in a single tool that runs up to 100x faster.' },
                  { id: 'opt_2', text: 'It converts Python into Javascript.' },
                  { id: 'opt_3', text: 'It automatically writes unittests.' },
                  { id: 'opt_4', text: 'It is the only tool compatible with macOS.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Ruff replaces multiple fragmented Python tools with a single blazing-fast Rust-based binary configured in pyproject.toml.'
              }
            ]
          },
          key_takeaways: [
            'Ruff unifies linting, import sorting, and code formatting at lightning speed.',
            'Configure lint rule selections (E, F, I, B, UP) in pyproject.toml.',
            'Automate formatting checks in pre-commit hooks to eliminate review debates.'
          ],
          revision_prompts: [
            'What is the bugbear (B) rule family in Ruff and what kinds of bugs does it catch?'
          ]
        },
        {
          id: 'les-l5-4-10',
          slug: 'type-checking-in-a-ci-workflow',
          title: 'Strict Type Checking with Mypy in CI',
          summary: 'Configure Mypy in strict mode, handle untyped dependencies, and enforce typing gates in automated CI.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Configure Mypy strict mode in pyproject.toml',
            'Handle third-party untyped dependencies with ignore_missing_imports',
            'Enforce zero-untyped-defs quality gates in CI pipelines'
          ],
          content_markdown: `### Mypy in CI: Preventing Type Degradation

Running Mypy locally is helpful, but if it is not enforced in CI, type coverage will steadily decay as deadlines loom.

### Modern \`pyproject.toml\` Mypy Configuration:

\`\`\`toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true

# Handling third-party libraries without type stubs:
[[tool.mypy.overrides]]
module = "legacy_untyped_lib.*"
ignore_missing_imports = true
\`\`\`

With \`disallow_untyped_defs = true\`, CI rejects any new function that lacks type annotations, keeping the codebase permanently typed!`,
          code_snippet: `# Simulating Mypy signature inspection
def verify_annotated_function(func) -> dict:
    hints = getattr(func, "__annotations__", {})
    params = [p for p in func.__code__.co_varnames[:func.__code__.co_argcount]]
    missing_params = [p for p in params if p not in hints]
    missing_return = "return" not in hints
    return {
        "function_name": func.__name__,
        "is_fully_typed": len(missing_params) == 0 and not missing_return,
        "missing": missing_params + (["return"] if missing_return else [])
    }

def properly_typed_add(a: int, b: int) -> int:
    return a + b

def unannotated_add(a, b):
    return a + b

print(verify_annotated_function(properly_typed_add))
print(verify_annotated_function(unannotated_add))`,
          code_language: 'python',
          code_explanation: 'Demonstrates function signature reflection checking for complete type annotations on all parameters and return types.',
          expected_output: `{'function_name': 'properly_typed_add', 'is_fully_typed': True, 'missing': []}
{'function_name': 'unannotated_add', 'is_fully_typed': False, 'missing': ['a', 'b', 'return']}`,
          quiz: {
            id: 'quiz-l5-4-10',
            title: 'Mypy CI Gate Check',
            questions: [
              {
                id: 'q-l5-4-10-1',
                question: 'What does setting disallow_untyped_defs = true do in your Mypy configuration?',
                options: [
                  { id: 'opt_1', text: 'It flags an error for any function definition that lacks complete parameter or return type annotations.' },
                  { id: 'opt_2', text: 'It converts untyped variables to None.' },
                  { id: 'opt_3', text: 'It automatically generates type annotations using AI.' },
                  { id: 'opt_4', text: 'It disables all class inheritance.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'disallow_untyped_defs ensures developers cannot commit functions without type signatures, preventing unannotated code from creeping into the codebase.'
              }
            ]
          },
          key_takeaways: [
            'Configure Mypy strict mode to prevent gradual type annotation decay.',
            'Use overrides to handle legacy third-party libraries lacking type stubs.',
            'Enforce mypy as a required passing check in CI before pull requests can merge.'
          ],
          revision_prompts: [
            'What is the difference between Any and object in strict Mypy?'
          ]
        },
        {
          id: 'les-l5-4-11',
          slug: 'test-automation',
          title: 'Test Automation: Makefiles and Task Runners',
          summary: 'Unify test, lint, format, and typecheck commands into a single repeatable developer command (make test, tox, nox).',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Standardize quality commands across the team using a Makefile or task runner',
            'Implement composite checks (make check: format + lint + typecheck + test)',
            'Ensure local developer commands match CI runner commands exactly'
          ],
          content_markdown: `### The "What Command Do I Run?" Problem

If developer A runs \`pytest\`, developer B runs \`pytest --cov\`, and CI runs \`pytest -ra -q\`, discrepancies will arise!

### Standardizing with a \`Makefile\`

A root \`Makefile\` provides clean, memorable shortcuts:
\`\`\`makefile
.PHONY: check test lint format

format:
	ruff format .
	ruff check --fix .

lint:
	ruff check .
	mypy src tests

test:
	pytest tests --cov=src --cov-report=term-missing

check: format lint test
\`\`\`

Now, any engineer or new contributor simply types:
\`\`\`bash
make check
\`\`\`
And the entire quality suite runs identically to CI!`,
          code_snippet: `# Simulating a task runner pipeline
def run_quality_pipeline(steps: list) -> dict:
    log = []
    all_passed = True
    for step_name, success in steps:
        status = "PASSED" if success else "FAILED"
        log.append(f"[{status}] {step_name}")
        if not success:
            all_passed = False
            break # Stop on first pipeline failure
    return {"pipeline_success": all_passed, "log": log}

tasks = [
    ("Code Formatting (Ruff Format)", True),
    ("Static Linting (Ruff Check)", True),
    ("Type Checking (Mypy Strict)", True),
    ("Unit & Integration Tests (Pytest)", True)
]

res = run_quality_pipeline(tasks)
print(f"Overall Quality Gate: {'SUCCESS' if res['pipeline_success'] else 'FAILED'}")
for item in res['log']:
    print(f"  {item}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a sequential quality pipeline runner that exercises format, lint, type-check, and tests in order, stopping on the first failure.',
          expected_output: `Overall Quality Gate: SUCCESS
  [PASSED] Code Formatting (Ruff Format)
  [PASSED] Static Linting (Ruff Check)
  [PASSED] Type Checking (Mypy Strict)
  [PASSED] Unit & Integration Tests (Pytest)`,
          quiz: {
            id: 'quiz-l5-4-11',
            title: 'Task Runner Check',
            questions: [
              {
                id: 'q-l5-4-11-1',
                question: 'Why is standardizing test and lint commands via a Makefile or task runner (like tox or nox) crucial for engineering teams?',
                options: [
                  { id: 'opt_1', text: 'It guarantees that every developer executes the exact same flags, linters, and test arguments locally that CI executes in the cloud.' },
                  { id: 'opt_2', text: 'It eliminates the need to install Python.' },
                  { id: 'opt_3', text: 'It encrypts the source code.' },
                  { id: 'opt_4', text: 'It creates automated git commits without human review.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Standardized task runners ensure zero friction onboarding and guarantee parity between local developer environments and cloud CI pipelines.'
              }
            ]
          },
          key_takeaways: [
            'Create a root Makefile or task runner script to standardize developer commands.',
            'Combine format, lint, typecheck, and test into a single composite check target.',
            'Ensure local checks mirror CI commands byte-for-byte.'
          ],
          revision_prompts: [
            'What is the difference between a simple Makefile and an environment matrix tool like tox or nox?'
          ]
        },
        {
          id: 'les-l5-4-12',
          slug: 'preventing-flaky-tests',
          title: 'Preventing and Eradicating Flaky Tests in CI',
          summary: 'Systematically diagnose race conditions, order pollution, and wall-clock sleeps to keep CI builds 100% deterministic.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Identify the primary causes of test flakiness in production suites',
            'Run tests with randomized ordering (pytest-randomly) to expose leaks',
            'Eliminate timing jitter and replace live networks with local test doubles'
          ],
          content_markdown: `### The Toxic Impact of Flaky Tests

A **flaky test** passes 9 times out of 10 and fails randomly on the 10th run.
When tests are flaky:
1. Developers re-run failed CI pipelines hoping it passes.
2. The team stops treating red CI builds as real blockers.
3. A real production bug slips through because developers assumed "it's just that flaky test again!"

### The Flakiness Remediation Checklist:
1. **Never sleep on real time**: Replace \`time.sleep()\` with injected deterministic clocks or event condition waits.
2. **Never rely on test execution order**: Use \`pytest-randomly\` to run tests in randomized order on every CI build.
3. **Never share global mutable state**: Restore modified environment variables or class attributes in teardown fixtures.
4. **Never call live internet APIs**: Mock external networks or use in-memory servers.`,
          code_snippet: `# Detecting order dependency by shuffling test execution
import random

def run_test_suite_shuffled(tests: list, seed: int = 42) -> dict:
    shuffled = tests.copy()
    random.Random(seed).shuffle(shuffled)
    
    # State tracking: Test B fails if Test A did not run first!
    state = {"a_ran": False}
    results = {}
    
    for t in shuffled:
        if t == "test_a":
            state["a_ran"] = True
            results[t] = "PASSED"
        elif t == "test_b":
            # Fragile test depends on test_a!
            results[t] = "PASSED" if state["a_ran"] else "FAILED (Order Dep Bug!)"
            
    return {"order": shuffled, "results": results}

test_names = ["test_b", "test_a"]
run1 = run_test_suite_shuffled(test_names, seed=1) # test_b runs first
print(f"Randomized Run Order: {run1['order']}")
print(f"Outcome: {run1['results']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how randomized test ordering exposes hidden order dependencies where test_b secretly relied on test_a running first.',
          expected_output: `Randomized Run Order: ['test_b', 'test_a']
Outcome: {'test_b': 'FAILED (Order Dep Bug!)', 'test_a': 'PASSED'}`,
          quiz: {
            id: 'quiz-l5-4-12',
            title: 'Flaky Tests Check',
            questions: [
              {
                id: 'q-l5-4-12-1',
                question: 'Why is running tests in randomized order (e.g. using pytest-randomly) a best practice in CI?',
                options: [
                  { id: 'opt_1', text: 'It aggressively flushes out state leakage and hidden order dependencies where tests accidentally rely on prior tests to seed data.' },
                  { id: 'opt_2', text: 'It makes the tests run 2x faster.' },
                  { id: 'opt_3', text: 'It reduces CPU utilization on the server.' },
                  { id: 'opt_4', text: 'Randomized testing is required by PEP 8.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Randomizing test order ensures every test is completely self-contained and fails fast if any test accidentally relies on uncleaned state left by a previous test.'
              }
            ]
          },
          key_takeaways: [
            'Flaky tests destroy developer confidence in CI builds.',
            'Randomize test ordering in CI to uncover state leakage.',
            'Eliminate wall-clock sleep timers and external network calls.'
          ],
          revision_prompts: [
            'How can pytest-rerunfailures mask architecture bugs instead of solving them?'
          ]
        }
      ]
    }
  ]
};
