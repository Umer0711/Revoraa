// Module 8: Advanced Testing and Architecture Validation (12 Lessons)
// Comprehensive production testing, AsyncMock, concurrency verification, fault injection, property-based testing, and Level 4 Final Assessment

export const MODULE_8_TESTING_ARCHITECTURE_VALIDATION = {
  id: 'mod-l4-8',
  slug: 'advanced-testing-architecture-validation',
  title: 'Advanced Testing and Architecture Validation',
  tagline: 'Write deterministic tests for asynchronous systems, concurrent interactions, and architectural contracts.',
  description: 'Master unit and integration testing for asynchronous codebases, concurrency verification, isolated test doubles with AsyncMock, architecture boundary assertions, property testing, and diagnosing flaky tests.',
  level_number: 4,
  sort_order: 8,
  topics: [
    {
      id: 'top-l4-8-1',
      slug: 'async-testing-foundations',
      title: 'Testing Asynchronous Systems & Isolation',
      summary: 'Execute and assert coroutines cleanly using unittest.IsolatedAsyncioTestCase and AsyncMock.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l4-8-1',
          slug: 'testing-asynchronous-functions',
          title: 'Testing Asynchronous Functions',
          summary: 'Learn how to test coroutines deterministically using Python 3.8+ IsolatedAsyncioTestCase and modern async test runners.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Understand how test runners schedule coroutines onto an event loop',
            'Use unittest.IsolatedAsyncioTestCase for per-test event loop isolation',
            'Assert coroutine return values, timing constraints, and side effects'
          ],
          content_markdown: `### The Challenge of Testing Coroutines

In standard unit testing, functions execute synchronously on the caller's stack frame. When testing an \`async def\` coroutine, simply invoking \`result = coro_func()\` does **not** execute the logic—it merely returns an unawaited coroutine object!

Before Python 3.8, engineers had to manually spin up an event loop in \`setUp()\` and shut it down in \`tearDown()\`. Python 3.8 introduced **\`unittest.IsolatedAsyncioTestCase\`**, which automatically:
1. Creates a brand-new, isolated event loop for every single test method.
2. Allows \`async def test_something(self)\` methods.
3. Automatically runs asynchronous setup (\`async def asyncSetUp(self)\`) and cleanup (\`async def asyncTearDown(self)\`).
4. Closes the event loop and checks for unhandled loop exceptions upon completion.

\`\`\`python
import unittest

class TestAsyncServices(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        # Runs inside the test's dedicated event loop
        self.client = AsyncHttpClient()
    
    async def test_fetch_user(self):
        user = await self.client.get_user(101)
        self.assertEqual(user['name'], 'Alice')
\`\`\`

Let's test an asynchronous service using \`IsolatedAsyncioTestCase\` directly in Python!`,
          code_snippet: `import unittest
import asyncio

async def fetch_user_balance(user_id: int) -> dict:
    await asyncio.sleep(0.01)
    if user_id <= 0:
        raise ValueError("Invalid user ID")
    return {"user_id": user_id, "balance_cents": 42000}

class TestUserBalanceService(unittest.IsolatedAsyncioTestCase):
    async def test_fetch_balance_success(self):
        data = await fetch_user_balance(42)
        self.assertEqual(data["user_id"], 42)
        self.assertEqual(data["balance_cents"], 42000)

    async def test_fetch_balance_invalid_id(self):
        with self.assertRaises(ValueError):
            await fetch_user_balance(-1)

suite = unittest.TestLoader().loadTestsFromTestCase(TestUserBalanceService)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}, Errors: {len(result.errors)}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'We define an asynchronous service and test both its happy path and exception path using IsolatedAsyncioTestCase. Each test runs in its own event loop without leaking state.',
          expected_output: `test_fetch_balance_invalid_id (__main__.TestUserBalanceService) ... ok
test_fetch_balance_success (__main__.TestUserBalanceService) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.024s

OK
Tests run: 2, Errors: 0, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-1',
            title: 'Async Unit Testing Check',
            questions: [
              {
                id: 'q-l4-8-1-1',
                question: 'What happens if you invoke `result = my_coroutine()` inside a standard synchronous `unittest.TestCase` method without awaiting or running it?',
                options: [
                  { id: 'opt_1', text: 'The coroutine executes synchronously on the main thread.' },
                  { id: 'opt_2', text: 'It returns an unawaited coroutine object and triggers a RuntimeWarning upon test completion.' },
                  { id: 'opt_3', text: 'It creates a background OS thread and runs in parallel.' },
                  { id: 'opt_4', text: 'The Python interpreter raises a SyntaxError at compile time.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Calling a coroutine function returns a coroutine object. If it is never awaited or scheduled on an event loop, the test passes erroneously (without executing logic) and Python warns: "RuntimeWarning: coroutine was never awaited".'
              }
            ]
          },
          key_takeaways: [
            'Coroutines must be awaited inside an active event loop to execute.',
            'unittest.IsolatedAsyncioTestCase provides a clean, per-test event loop with asyncSetUp and asyncTearDown.',
            'Always test both successful async results and expected exceptions using with self.assertRaises().'
          ],
          revision_prompts: [
            'Why is sharing a single global event loop across multiple test cases considered an anti-pattern?'
          ]
        },
        {
          id: 'les-l4-8-2',
          slug: 'testing-task-failures-cancellation',
          title: 'Testing Task Failures and Cancellation',
          summary: 'Verify that asynchronous tasks respect cancellation tokens, handle timeouts, and execute cleanup routines under failure.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Test asyncio.CancelledError propagation in unit tests',
            'Verify resource cleanup logic inside finally blocks when cancelled',
            'Assert asyncio.TimeoutError behaviors under slow simulated responses'
          ],
          content_markdown: `### Why Test Cancellation?

Writing async code that runs when everything goes well is easy. Writing async code that does not leak sockets, database connections, or memory when cancelled or timed out is what separates junior scripts from production systems.

When an async task is cancelled:
1. An \`asyncio.CancelledError\` is raised at the current suspension point (\`await\`).
2. Any \`finally:\` block runs immediately.
3. If an async cleanup occurs in \`finally:\`, Python 3.8+ allows awaiting inside cancellation handlers.

To test cancellation deterministically:
1. Spawn the worker task using \`asyncio.create_task()\`.
2. Allow it to start executing (e.g. yield control via \`await asyncio.sleep(0)\`).
3. Call \`task.cancel()\`.
4. Await the task with \`with self.assertRaises(asyncio.CancelledError):\`.
5. Assert that state cleanups (e.g., connection closed, metrics decremented) were properly performed!`,
          code_snippet: `import unittest
import asyncio

class ManagedWorker:
    def __init__(self):
        self.is_active = False
        self.cleaned_up = False

    async def execute_stream(self):
        self.is_active = True
        try:
            while True:
                await asyncio.sleep(0.5)
        finally:
            self.is_active = False
            self.cleaned_up = True

class TestWorkerCancellation(unittest.IsolatedAsyncioTestCase):
    async def test_worker_cleans_up_on_cancellation(self):
        worker = ManagedWorker()
        task = asyncio.create_task(worker.execute_stream())
        
        # Yield so the task starts
        await asyncio.sleep(0.01)
        self.assertTrue(worker.is_active)
        self.assertFalse(worker.cleaned_up)
        
        # Cancel task
        task.cancel()
        with self.assertRaises(asyncio.CancelledError):
            await task
            
        self.assertFalse(worker.is_active)
        self.assertTrue(worker.cleaned_up)

suite = unittest.TestLoader().loadTestsFromTestCase(TestWorkerCancellation)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Cancellation tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'The test starts the worker task, verifies it is running, cancels it, asserts that CancelledError was raised, and verifies that the finally cleanup block executed correctly.',
          expected_output: `test_worker_cleans_up_on_cancellation (__main__.TestWorkerCancellation) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.015s

OK
Cancellation tests run: 1, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-2',
            title: 'Task Cancellation Check',
            questions: [
              {
                id: 'q-l4-8-2-1',
                question: 'When a task receives a cancel() request, where is asyncio.CancelledError injected into the coroutine?',
                options: [
                  { id: 'opt_1', text: 'At the next await expression where the coroutine is currently suspended.' },
                  { id: 'opt_2', text: 'Immediately into the CPU registers, interrupting non-async Python bytecodes.' },
                  { id: 'opt_3', text: 'At the very end of the function right before returning.' },
                  { id: 'opt_4', text: 'Inside the OS kernel signal handler.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Async cancellation is cooperative: CancelledError is raised inside the coroutine at the current or next await suspension point.'
              }
            ]
          },
          key_takeaways: [
            'Cancellation is tested by starting a task, yielding loop control, calling task.cancel(), and expecting CancelledError.',
            'Always assert that cleanup flags and state mutations inside finally blocks actually take effect when cancelled.'
          ],
          revision_prompts: [
            'How can catching Exception without re-raising prevent task cancellation from functioning properly?'
          ]
        },
        {
          id: 'les-l4-8-3',
          slug: 'mocking-asynchronous-dependencies',
          title: 'Mocking Asynchronous Dependencies',
          summary: 'Use unittest.mock.AsyncMock to isolate coroutine dependencies and assert async call signatures and side effects.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Distinguish between MagicMock and AsyncMock',
            'Configure return_value and side_effect on AsyncMock instances',
            'Assert async calls using assert_awaited_once_with and await_count'
          ],
          content_markdown: `### unittest.mock.AsyncMock

If you replace an \`async def\` method with a standard \`MagicMock\`, awaiting it fails because \`MagicMock()\` returns a normal mock, not an awaitable object:
\`TypeError: object MagicMock can't be used in 'await' expression\`

Python 3.8 introduced **\`unittest.mock.AsyncMock\`**:
- When called, it automatically returns a coroutine object that resolves to \`return_value\`.
- Provides specialized async assertion methods:
  - \`assert_awaited()\`
  - \`assert_awaited_once()\`
  - \`assert_awaited_once_with(*args, **kwargs)\`
  - \`await_count\` and \`await_args_list\`

\`\`\`python
from unittest.mock import AsyncMock

mock_client = AsyncMock()
mock_client.fetch_json.return_value = {"status": "ok"}

# In your test:
result = await mock_client.fetch_json("https://api.revoraa.dev")
mock_client.fetch_json.assert_awaited_once_with("https://api.revoraa.dev")
\`\`\`

Let's see \`AsyncMock\` in action testing an order processing service!`,
          code_snippet: `import unittest
from unittest.mock import AsyncMock

class PaymentGateway:
    async def charge(self, amount_cents: int, token: str) -> dict:
        # Real network call to Stripe / PayPal
        raise NotImplementedError("Real network gateway")

class CheckoutService:
    def __init__(self, gateway: PaymentGateway):
        self.gateway = gateway

    async def process_order(self, order_id: str, amount_cents: int, token: str) -> bool:
        if amount_cents <= 0:
            return False
        response = await self.gateway.charge(amount_cents, token)
        return response.get("status") == "success"

class TestCheckout(unittest.IsolatedAsyncioTestCase):
    async def test_successful_order_charge(self):
        mock_gateway = AsyncMock(spec=PaymentGateway)
        mock_gateway.charge.return_value = {"status": "success", "tx_id": "tx_999"}
        
        service = CheckoutService(gateway=mock_gateway)
        success = await service.process_order("ORD-101", 5000, "tok_valid")
        
        self.assertTrue(success)
        mock_gateway.charge.assert_awaited_once_with(5000, "tok_valid")

    async def test_zero_amount_skips_charge(self):
        mock_gateway = AsyncMock(spec=PaymentGateway)
        service = CheckoutService(gateway=mock_gateway)
        
        success = await service.process_order("ORD-102", 0, "tok_valid")
        self.assertFalse(success)
        mock_gateway.charge.assert_not_awaited()

suite = unittest.TestLoader().loadTestsFromTestCase(TestCheckout)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"AsyncMock tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'We replace the real PaymentGateway with an AsyncMock, configure its return value, and assert that the method was awaited exactly once with the expected arguments.',
          expected_output: `test_successful_order_charge (__main__.TestCheckout) ... ok
test_zero_amount_skips_charge (__main__.TestCheckout) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.003s

OK
AsyncMock tests run: 2, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-3',
            title: 'AsyncMock Verification Check',
            questions: [
              {
                id: 'q-l4-8-3-1',
                question: 'What happens if you use standard MagicMock instead of AsyncMock to mock an un-called async method that will be awaited?',
                options: [
                  { id: 'opt_1', text: 'TypeError: object MagicMock can\'t be used in \'await\' expression.' },
                  { id: 'opt_2', text: 'It automatically converts itself into an AsyncMock.' },
                  { id: 'opt_3', text: 'The test passes without executing any code.' },
                  { id: 'opt_4', text: 'Python terminates with a Segmentation Fault.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'MagicMock returns another MagicMock when called, which does not implement __await__(). Attempting to await it raises a TypeError.'
              }
            ]
          },
          key_takeaways: [
            'Use AsyncMock whenever mocking coroutines or async context managers.',
            'Use assert_awaited_once_with() to verify that asynchronous dependencies received exact parameter payloads.',
            'Setting spec=TargetClass ensures tests fail fast if refactoring changes method names.'
          ],
          revision_prompts: [
            'How can side_effect on an AsyncMock simulate an intermittent network exception?'
          ]
        }
      ]
    },
    {
      id: 'top-l4-8-2',
      slug: 'concurrency-deterministic-testing',
      title: 'Testing Concurrency & Determinism',
      summary: 'Test concurrent behavior without fragile sleep timers and replace unpredictable time with deterministic clocks.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l4-8-4',
          slug: 'testing-concurrent-behavior',
          title: 'Testing Concurrent Behavior',
          summary: 'Verify race conditions, thread synchronization, and shared state atomicity in test suites.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Design tests that intentionally expose race conditions in uncoordinated code',
            'Use barriers and synchronization primitives in test harnesses',
            'Assert concurrent state consistency across multiple simulated workers'
          ],
          content_markdown: `### Testing for Thread-Safety and Race Conditions

Unit testing sequential code verifies inputs vs outputs. Testing concurrent code must verify **invariants under interleaved execution**.

If two concurrent workers decrement inventory, an uncoordinated implementation may allow negative stock. To test for race conditions:
1. Initialize test state with a known balance.
2. Launch N concurrent workers simultaneously.
3. Use a synchronization latch (\`threading.Barrier\` or \`asyncio.Event\`) so all workers start at the exact same instant, maximizing thread interleaving.
4. Join all tasks and assert the final invariant (e.g., total items sold + remaining stock == initial stock).

\`\`\`python
# Synchronize start across 20 workers:
barrier = threading.Barrier(20)

def worker():
    barrier.wait() # All 20 threads release simultaneously!
    bank.withdraw(10)
\`\`\`

Let's test an asynchronous atomic counter to verify concurrent safety!`,
          code_snippet: `import unittest
import asyncio

class SafeAsyncCounter:
    def __init__(self):
        self._count = 0
        self._lock = asyncio.Lock()

    async def increment(self):
        async with self._lock:
            current = self._count
            await asyncio.sleep(0.001)  # Simulate small async context switch
            self._count = current + 1

    @property
    def value(self):
        return self._count

class TestSafeCounter(unittest.IsolatedAsyncioTestCase):
    async def test_concurrent_increments_retain_integrity(self):
        counter = SafeAsyncCounter()
        workers = 50
        
        # Launch 50 concurrent increments
        tasks = [asyncio.create_task(counter.increment()) for _ in range(workers)]
        await asyncio.gather(*tasks)
        
        self.assertEqual(counter.value, workers)

suite = unittest.TestLoader().loadTestsFromTestCase(TestSafeCounter)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Concurrent tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: '50 concurrent tasks increment the counter simultaneously with simulated yield points. The asyncio.Lock protects the critical section, ensuring the final count is exactly 50.',
          expected_output: `test_concurrent_increments_retain_integrity (__main__.TestSafeCounter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.055s

OK
Concurrent tests run: 1, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-4',
            title: 'Concurrency Testing Check',
            questions: [
              {
                id: 'q-l4-8-4-1',
                question: 'Why is using a barrier or event latch useful when testing for race conditions?',
                options: [
                  { id: 'opt_1', text: 'It forces all test threads or tasks to begin executing the critical section at the exact same moment.' },
                  { id: 'opt_2', text: 'It turns off the Global Interpreter Lock.' },
                  { id: 'opt_3', text: 'It converts multithreaded code into synchronous code.' },
                  { id: 'opt_4', text: 'It prevents any memory allocations during the test.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Staggered worker starts often mask race conditions. A barrier forces all concurrent workers to release simultaneously, maximizing the likelihood of interleaving.'
              }
            ]
          },
          key_takeaways: [
            'Test concurrent code by validating system invariants across dozens of concurrent operations.',
            'Use barriers or events to align worker start times and maximize thread/task interleaving.',
            'Verify that protected critical sections never suffer from lost updates.'
          ],
          revision_prompts: [
            'Why might a race condition pass 99% of the time in CI and fail intermittently in production?'
          ]
        },
        {
          id: 'les-l4-8-5',
          slug: 'deterministic-tests-timing-flakiness',
          title: 'Deterministic Tests and Avoiding Timing Flakiness',
          summary: 'Eliminate time.sleep() and unpredictable wall-clock assertions by using virtual time and deterministic event clocks.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Understand why time.sleep() in unit tests produces slow, flaky builds',
            'Implement virtual clock and injectable time providers',
            'Write deterministic timeout and cache expiration tests'
          ],
          content_markdown: `### The Flaky Test Trap: Wall-Clock Sleep

A classic junior testing mistake:
\`\`\`python
# ANTI-PATTERN:
cache.set("key", "val", ttl_seconds=1)
time.sleep(1.1) # Flaky! On slow CI machines, sleep might drift or finish early!
assert cache.get("key") is None
\`\`\`

Why is this toxic in professional engineering?
1. **Sluggish Test Suites**: If 500 tests each sleep 1 second, the test suite takes over 8 minutes to run!
2. **Flakiness under CI Load**: On heavily loaded multi-tenant CI runners, CPU starvation causes timing jitter, leading to random test failures.

### The Solution: Injectable Clock / Virtual Time

Never allow domain logic to invoke \`time.time()\` directly. Instead, inject a \`time_fn\` or clock interface:
\`\`\`python
class ExpiringCache:
    def __init__(self, clock_fn=time.time):
        self.clock_fn = clock_fn
\`\`\`
In tests, pass a controllable dummy clock:
\`\`\`python
current_time = 1000.0
cache = ExpiringCache(clock_fn=lambda: current_time)
cache.set("k", "v", ttl=10)

current_time += 15.0 # Instantaneous advance without sleeping!
assert cache.get("k") is None
\`\`\`

Let's test this in Python!`,
          code_snippet: `import unittest

class ExpiringCache:
    def __init__(self, clock_fn):
        self._clock = clock_fn
        self._store = {}

    def set(self, key: str, val: str, ttl_seconds: float):
        expires_at = self._clock() + ttl_seconds
        self._store[key] = (val, expires_at)

    def get(self, key: str):
        if key not in self._store:
            return None
        val, expires_at = self._store[key]
        if self._clock() >= expires_at:
            del self._store[key]
            return None
        return val

class TestDeterministicCache(unittest.TestCase):
    def setUp(self):
        self.virtual_time = 1_000_000.0
        self.cache = ExpiringCache(clock_fn=lambda: self.virtual_time)

    def test_cache_hits_before_expiry(self):
        self.cache.set("auth_token", "xyz_789", ttl_seconds=300)
        self.virtual_time += 100.0 # Fast forward 100s instantly!
        self.assertEqual(self.cache.get("auth_token"), "xyz_789")

    def test_cache_expires_after_ttl(self):
        self.cache.set("auth_token", "xyz_789", ttl_seconds=300)
        self.virtual_time += 301.0 # Fast forward 301s instantly!
        self.assertIsNone(self.cache.get("auth_token"))

suite = unittest.TestLoader().loadTestsFromTestCase(TestDeterministicCache)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Deterministic tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'By injecting a virtual clock lambda, we test a 300-second TTL in under 1 millisecond with 100% mathematical determinism and zero flakiness.',
          expected_output: `test_cache_expires_after_ttl (__main__.TestDeterministicCache) ... ok
test_cache_hits_before_expiry (__main__.TestDeterministicCache) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.001s

OK
Deterministic tests run: 2, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-5',
            title: 'Deterministic Clock Check',
            questions: [
              {
                id: 'q-l4-8-5-1',
                question: 'What is the primary benefit of injecting a clock function into time-sensitive classes instead of using time.time() directly?',
                options: [
                  { id: 'opt_1', text: 'Tests can instantaneously manipulate and fast-forward time with zero latency and zero flakiness.' },
                  { id: 'opt_2', text: 'It makes the code run 10x faster in production.' },
                  { id: 'opt_3', text: 'It automatically formats timestamps into UTC strings.' },
                  { id: 'opt_4', text: 'It prevents the Global Interpreter Lock from locking.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Injecting a clock function allows tests to simulate minutes, days, or years of elapsed time instantaneously without sleeping, eliminating CI flakiness.'
              }
            ]
          },
          key_takeaways: [
            'Wall-clock sleep calls in test suites produce slow, brittle, and flaky CI pipelines.',
            'Injecting a clock interface or callable allows tests to advance time deterministically in 0 milliseconds.',
            'Always test edge cases: exactly at expiration (t == ttl) and post-expiration (t > ttl).'
          ],
          revision_prompts: [
            'How does Python 3\'s asyncio loop.time() interact with event loop scheduling?'
          ]
        },
        {
          id: 'les-l4-8-6',
          slug: 'dependency-substitution-isolation',
          title: 'Dependency Substitution and Isolation',
          summary: 'Use In-Memory Fakes, Stubs, and Spies to verify system behavior without coupling to external databases or third-party APIs.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Categorize test doubles: Dummy, Stub, Spy, Mock, and Fake',
            'Implement in-memory repository fakes matching production protocols',
            'Verify business rules in complete isolation from storage engines'
          ],
          content_markdown: `### The Spectrum of Test Doubles

Gerard Meszaros defined five distinct categories of test doubles:
1. **Dummy**: Passed around but never actually used (e.g. placeholder parameters).
2. **Stub**: Provides canned answers to calls made during the test.
3. **Spy**: Records information about how it was called (e.g. tracking call count).
4. **Mock**: Pre-programmed with expectations that form a specification of what it must receive.
5. **Fake**: Has a working, functional implementation, but takes a shortcut that makes it unsuitable for production (e.g., an \`InMemoryUserRepository\`).

### Why Fakes Beat Mocks for Repositories

When testing complex domain workflows (e.g., placing an order, reconciling invoices), heavy mocking requires mocking 15 separate calls: \`mock.query.filter.first.return_value = ...\`. This creates brittle tests tightly coupled to internal implementation details.

An **In-Memory Fake** satisfies the exact domain \`Protocol\`, preserves state across calls, and allows writing natural integration tests that run in microseconds.

Let's implement an in-memory repository fake and test an user registration service!`,
          code_snippet: `import unittest
from typing import Protocol, Optional, Dict

class User:
    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email

class UserRepository(Protocol):
    def save(self, user: User) -> None: ...
    def find_by_email(self, email: str) -> Optional[User]: ...

class InMemoryUserRepo:
    def __init__(self):
        self._data: Dict[str, User] = {}

    def save(self, user: User) -> None:
        self._data[user.email] = user

    def find_by_email(self, email: str) -> Optional[User]:
        return self._data.get(email)

class RegistrationService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def register(self, user_id: str, email: str) -> bool:
        if self.repo.find_by_email(email):
            return False  # Email already registered
        self.repo.save(User(user_id=user_id, email=email))
        return True

class TestRegistrationWithFake(unittest.TestCase):
    def setUp(self):
        self.fake_repo = InMemoryUserRepo()
        self.service = RegistrationService(repo=self.fake_repo)

    def test_successful_registration(self):
        result = self.service.register("u1", "alice@revoraa.dev")
        self.assertTrue(result)
        user = self.fake_repo.find_by_email("alice@revoraa.dev")
        self.assertIsNotNone(user)
        self.assertEqual(user.user_id, "u1")

    def test_duplicate_email_rejected(self):
        self.service.register("u1", "alice@revoraa.dev")
        result = self.service.register("u2", "alice@revoraa.dev")
        self.assertFalse(result)

suite = unittest.TestLoader().loadTestsFromTestCase(TestRegistrationWithFake)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Fake tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'InMemoryUserRepo implements the UserRepository protocol using a dictionary. Tests execute in microseconds without an actual SQL database connection.',
          expected_output: `test_duplicate_email_rejected (__main__.TestRegistrationWithFake) ... ok
test_successful_registration (__main__.TestRegistrationWithFake) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.001s

OK
Fake tests run: 2, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-6',
            title: 'Test Double Taxonomy Check',
            questions: [
              {
                id: 'q-l4-8-6-1',
                question: 'What is the key difference between a Mock and a Fake?',
                options: [
                  { id: 'opt_1', text: 'A Mock records expectations and returns canned data; a Fake actually has working, functional in-memory logic.' },
                  { id: 'opt_2', text: 'A Mock is written in C; a Fake is written in Python.' },
                  { id: 'opt_3', text: 'A Fake can only be used with PostgreSQL.' },
                  { id: 'opt_4', text: 'There is no difference; they are exact synonyms.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Mocks are verification tools configured with specific expected calls. Fakes are real working implementations (like an in-memory dictionary store) that mimic production components.'
              }
            ]
          },
          key_takeaways: [
            'Test doubles include Dummies, Stubs, Spies, Mocks, and Fakes.',
            'In-memory Fakes provide robust, maintainable tests without brittle method-mock chaining.',
            'Type Protocols guarantee that production implementations and test doubles adhere to the exact same contract.'
          ],
          revision_prompts: [
            'When is an integration test with a real database preferred over an in-memory fake?'
          ]
        }
      ]
    },
    {
      id: 'top-l4-8-3',
      slug: 'architecture-validation-resilience',
      title: 'Architecture Contracts & Resilience Testing',
      summary: 'Assert architectural boundaries, test performance regression, inject faults, and diagnose flaky tests.',
      sort_order: 3,
      lessons: [
        {
          id: 'les-l4-8-7',
          slug: 'testing-architecture-boundaries',
          title: 'Testing Architecture Boundaries',
          summary: 'Enforce dependency rules, module boundaries, and prohibited imports programmatically using AST inspection.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Understand architecture fitness functions in automated CI',
            'Use the ast module to inspect imports across module boundaries',
            'Enforce that domain models never import infrastructure or database frameworks'
          ],
          content_markdown: `### Architecture Fitness Functions

In Onion, Hexagonal, and Clean Architectures, the fundamental golden rule is the **Dependency Inversion Rule**:
*Domain models must never import from infrastructure, database drivers, or web frameworks.*

Over time, under deadline pressure, developers might write:
\`\`\`python
# Inside domain/user.py:
import sqlalchemy # FORBIDDEN: Domain now coupled to DB framework!
\`\`\`

Instead of relying on code reviews to catch this, senior engineers write **Architecture Tests (Fitness Functions)** using Python's built-in \`ast\` (Abstract Syntax Tree) module. These tests scan the codebase and fail CI if forbidden imports are introduced!

Let's build an AST architecture boundary test!`,
          code_snippet: `import ast
import unittest

def extract_imports(code_str: str) -> set:
    tree = ast.parse(code_str)
    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name.split('.')[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module.split('.')[0])
    return imports

# Simulated code in domain module:
CLEAN_DOMAIN_CODE = """
from dataclasses import dataclass
from typing import Optional

@dataclass
class Order:
    order_id: str
    total_cents: int
"""

VIOLATING_DOMAIN_CODE = """
import sqlite3 # FORBIDDEN: Infrastructure in domain!
from dataclasses import dataclass
"""

FORBIDDEN_INFRA_IMPORTS = {"sqlite3", "sqlalchemy", "requests", "aiohttp", "boto3"}

class TestArchitectureBoundaries(unittest.TestCase):
    def test_clean_domain_has_no_infra_imports(self):
        imports = extract_imports(CLEAN_DOMAIN_CODE)
        violations = imports.intersection(FORBIDDEN_INFRA_IMPORTS)
        self.assertEqual(violations, set(), f"Domain imported forbidden infra: {violations}")

    def test_violating_domain_is_detected(self):
        imports = extract_imports(VIOLATING_DOMAIN_CODE)
        violations = imports.intersection(FORBIDDEN_INFRA_IMPORTS)
        self.assertIn("sqlite3", violations)

suite = unittest.TestLoader().loadTestsFromTestCase(TestArchitectureBoundaries)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Architecture tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'We parse code strings into Python ASTs, find all Import and ImportFrom nodes, and assert that forbidden infrastructure dependencies are never imported into core domain layers.',
          expected_output: `test_clean_domain_has_no_infra_imports (__main__.TestArchitectureBoundaries) ... ok
test_violating_domain_is_detected (__main__.TestArchitectureBoundaries) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.002s

OK
Architecture tests run: 2, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-7',
            title: 'Architecture Fitness Check',
            questions: [
              {
                id: 'q-l4-8-7-1',
                question: 'What is an architectural fitness function?',
                options: [
                  { id: 'opt_1', text: 'An automated test that asserts structural design rules, such as import dependencies and layer boundaries.' },
                  { id: 'opt_2', text: 'A function that monitors server CPU temperature.' },
                  { id: 'opt_3', text: 'A fitness tracker mobile app written in Python.' },
                  { id: 'opt_4', text: 'A benchmarking tool that measures typing speed.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Architectural fitness functions programmatically verify that the architecture adheres to structural constraints, such as forbidden dependency directions.'
              }
            ]
          },
          key_takeaways: [
            'Architecture fitness functions enforce design rules and module boundaries via automated unit tests.',
            'The Python ast module allows inspecting imports, class inheritance, and annotations without running the code.',
            'Preventing infrastructure imports in domain models ensures business logic remains pure and easily testable.'
          ],
          revision_prompts: [
            'How could you extend this AST test to ensure all public service methods have type annotations?'
          ]
        },
        {
          id: 'les-l4-8-8',
          slug: 'regression-testing-after-optimization',
          title: 'Regression Testing After Optimization',
          summary: 'Ensure aggressive performance refactorings and caching layers preserve 100% behavioral equivalence across edge cases.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Write dual-run verification tests comparing optimized code against baseline implementations',
            'Verify boundary conditions and edge cases (empty inputs, zeroes, negative numbers)',
            'Prevent caching optimizations from returning stale or mutated data'
          ],
          content_markdown: `### The Golden Rule of Optimization

Whenever you optimize an algorithm (e.g., replacing an $O(N^2)$ algorithm with an $O(N \\log N)$ divide-and-conquer strategy, or adding an LRU cache):
**The baseline implementation becomes the ultimate test oracle.**

A **Dual-Run Equivalence Test**:
1. Generates a wide variety of inputs, including edge cases:
   - Empty collections \`[]\`
   - Single-element collections \`[42]\`
   - Large collections with duplicate items
   - Boundary values (0, negative numbers, extreme floats)
2. Runs both the slow, proven baseline and the fast optimized implementation.
3. Asserts \`baseline_result == optimized_result\` for every input.

Let's verify an optimized windowed aggregation function against its naive baseline!`,
          code_snippet: `import unittest

# Naive baseline: simple and unquestionably correct, but O(N*K)
def naive_moving_average(numbers: list, k: int) -> list:
    if k <= 0 or not numbers or len(numbers) < k:
        return []
    result = []
    for i in range(len(numbers) - k + 1):
        window = numbers[i:i + k]
        result.append(sum(window) / k)
    return result

# Optimized implementation: sliding window sum O(N)
def fast_moving_average(numbers: list, k: int) -> list:
    if k <= 0 or not numbers or len(numbers) < k:
        return []
    result = []
    current_sum = sum(numbers[:k])
    result.append(current_sum / k)
    
    for i in range(k, len(numbers)):
        current_sum += numbers[i] - numbers[i - k]
        result.append(current_sum / k)
    return result

class TestOptimizationEquivalence(unittest.TestCase):
    def test_equivalence_on_diverse_inputs(self):
        test_cases = [
            ([], 3),
            ([10], 1),
            ([1, 2], 3), # k > len
            ([1, 2, 3, 4, 5, 6], 3),
            ([100, -50, 25, 0, -10, 80], 2),
            ([5] * 10, 4),
        ]
        
        for nums, k in test_cases:
            with self.subTest(nums=nums, k=k):
                baseline = naive_moving_average(nums, k)
                optimized = fast_moving_average(nums, k)
                self.assertEqual(baseline, optimized)

suite = unittest.TestLoader().loadTestsFromTestCase(TestOptimizationEquivalence)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Equivalence tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'We run both the naive moving average and the fast sliding window across multiple test cases, using self.subTest to verify that the optimization produces identical outputs.',
          expected_output: `test_equivalence_on_diverse_inputs (__main__.TestOptimizationEquivalence) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.002s

OK
Equivalence tests run: 1, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-8',
            title: 'Equivalence Testing Check',
            questions: [
              {
                id: 'q-l4-8-8-1',
                question: 'What is a "test oracle" in software testing?',
                options: [
                  { id: 'opt_1', text: 'A trusted source of truth (such as a proven naive implementation) used to determine whether a program output is correct.' },
                  { id: 'opt_2', text: 'A cloud database from Oracle Corporation.' },
                  { id: 'opt_3', text: 'An AI model that predicts when tests will fail.' },
                  { id: 'opt_4', text: 'A tool that automatically writes pull requests.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A test oracle is a mechanism or reference implementation used to verify whether the output of a system under test is mathematically correct.'
              }
            ]
          },
          key_takeaways: [
            'Retain the original naive implementation during performance refactoring to serve as an automated test oracle.',
            'Use self.subTest() to isolate failures across distinct input variations.',
            'Always verify edge cases: empty collections, window sizes exceeding input length, and duplicate items.'
          ],
          revision_prompts: [
            'Why are floating-point operations susceptible to subtle differences when changing order of summation?'
          ]
        },
        {
          id: 'les-l4-8-9',
          slug: 'property-based-testing-concepts',
          title: 'Property-Based Testing Concepts',
          summary: 'Understand generative and property-based testing principles: testing invariant contracts over thousands of random inputs.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Contrast example-based testing with property-based testing',
            'Identify mathematical invariants: round-trip, idempotency, and symmetry',
            'Implement a lightweight property testing runner in pure Python'
          ],
          content_markdown: `### Example-Based Testing vs Property-Based Testing

**Example-based testing**:
\`\`\`python
assert encode("hello") == "68656c6c6f"
assert decode("68656c6c6f") == "hello"
\`\`\`
*Limitation*: You only verified the inputs you remembered to think of! What about empty strings, emoji, null bytes, or multi-byte Unicode strings?

**Property-based testing (PBT)** (popularized by QuickCheck and Python's \`hypothesis\`):
Instead of hardcoding inputs, you specify **universal properties** that must hold true for *any* generated input $x$:
1. **Round-trip Invariant**: \`decode(encode(x)) == x\`
2. **Idempotence Invariant**: \`format(format(x)) == format(x)\`
3. **Commutativity / Symmetry**: \`merge(a, b) == merge(b, a)\`
4. **Length / Size Invariant**: \`len(sort(items)) == len(items)\`

Let's implement a pure Python property-based test harness that verifies serialization round-tripping!`,
          code_snippet: `import unittest
import json
import random
import string

def generate_random_user():
    return {
        "id": random.randint(1, 100_000),
        "username": "".join(random.choices(string.ascii_letters, k=random.randint(3, 12))),
        "scores": [random.randint(0, 100) for _ in range(random.randint(0, 5))],
        "is_active": random.choice([True, False])
    }

class TestJsonSerializationProperties(unittest.TestCase):
    def test_roundtrip_property_across_generated_inputs(self):
        # Run 100 property trials with randomized inputs
        for trial in range(100):
            payload = generate_random_user()
            
            # Invariant: decode(encode(x)) == x
            serialized = json.dumps(payload)
            deserialized = json.loads(serialized)
            
            self.assertEqual(
                payload, 
                deserialized, 
                f"Roundtrip failed on trial {trial}: {payload}"
            )

suite = unittest.TestLoader().loadTestsFromTestCase(TestJsonSerializationProperties)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Property tests run: {result.testsRun}, Trials completed: 100, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'The test asserts the universal round-trip property: json.loads(json.dumps(x)) == x across 100 dynamically generated randomized data structures.',
          expected_output: `test_roundtrip_property_across_generated_inputs (__main__.TestJsonSerializationProperties) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.005s

OK
Property tests run: 1, Trials completed: 100, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-9',
            title: 'Property-Based Testing Check',
            questions: [
              {
                id: 'q-l4-8-9-1',
                question: 'Which of the following is an example of an idempotency property in property-based testing?',
                options: [
                  { id: 'opt_1', text: 'f(f(x)) == f(x)' },
                  { id: 'opt_2', text: 'f(x) == -x' },
                  { id: 'opt_3', text: 'f(x + y) == f(x) + f(y)' },
                  { id: 'opt_4', text: 'len(f(x)) == 0' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'An operation is idempotent if applying it multiple times produces the exact same result as applying it once: f(f(x)) == f(x) (e.g. string trimming, deduplication).'
              }
            ]
          },
          key_takeaways: [
            'Example-based tests check specific values; property-based tests verify universal invariants across generative input domains.',
            'Common properties: round-trip preservation, idempotency, commutativity, and invariants.',
            'Property-based testing is unbeatable at discovering bizarre edge cases human developers overlook.'
          ],
          revision_prompts: [
            'What is test case "shrinking" in modern property-based testing frameworks?'
          ]
        },
        {
          id: 'les-l4-8-10',
          slug: 'fault-injection-fundamentals',
          title: 'Fault Injection Fundamentals',
          summary: 'Proactively verify resilience by injecting socket drops, timeouts, and corrupted payloads into service boundaries.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Understand Chaos Engineering and Fault Injection in unit/integration testing',
            'Simulate network latency, partition drops, and corrupted responses',
            'Verify that downstream consumers degrade gracefully without crashing'
          ],
          content_markdown: `### Proactive Chaos: Fault Injection

Most production outages do not occur because business logic was wrong; they occur because **a dependency failed in an unexpected way**, and the calling service had an unhandled exception or hung indefinitely.

**Fault Injection** is the deliberate introduction of faults into a system to validate its recovery and fallback paths:
1. **Network Drops**: The transport immediately raises \`ConnectionResetError\`.
2. **Hangs / Timeouts**: The dependency accepts the connection but never sends bytes, testing timeout enforcement.
3. **HTTP 500 / 503 Spikes**: Simulating overloaded downstream services to verify retry and circuit-breaker behavior.
4. **Corrupted Payloads**: Returning invalid JSON or missing schema keys to ensure validation boundaries catch it.

Let's test an asynchronous client with an injected fault simulator!`,
          code_snippet: `import unittest
import asyncio

class FaultyTransport:
    def __init__(self, failure_rate: float = 0.5):
        self.call_count = 0
        self.failure_rate = failure_rate

    async def send(self, payload: str) -> str:
        self.call_count += 1
        if self.call_count == 1:
            # First attempt fails with transient connection drop
            raise ConnectionResetError("Connection reset by peer")
        return f"ACK:{payload}"

class ResilientClient:
    def __init__(self, transport: FaultyTransport, max_retries: int = 3):
        self.transport = transport
        self.max_retries = max_retries

    async def send_with_recovery(self, payload: str) -> str:
        for attempt in range(1, self.max_retries + 1):
            try:
                return await self.transport.send(payload)
            except ConnectionResetError:
                if attempt == self.max_retries:
                    raise
                await asyncio.sleep(0.01) # Transient backoff
        raise RuntimeError("Unreachable")

class TestFaultInjection(unittest.IsolatedAsyncioTestCase):
    async def test_client_recovers_from_injected_connection_reset(self):
        faulty_transport = FaultyTransport()
        client = ResilientClient(transport=faulty_transport, max_retries=3)
        
        result = await client.send_with_recovery("PING")
        self.assertEqual(result, "ACK:PING")
        self.assertEqual(faulty_transport.call_count, 2)

suite = unittest.TestLoader().loadTestsFromTestCase(TestFaultInjection)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Fault injection tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'The test uses a FaultyTransport that deliberately raises ConnectionResetError on the first call. It verifies that the client catches the error, retries, and succeeds on the second attempt.',
          expected_output: `test_client_recovers_from_injected_connection_reset (__main__.TestFaultInjection) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.015s

OK
Fault injection tests run: 1, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-10',
            title: 'Fault Injection Check',
            questions: [
              {
                id: 'q-l4-8-10-1',
                question: 'Why should unit and integration tests deliberately inject faults like connection drops and timeouts?',
                options: [
                  { id: 'opt_1', text: 'To prove that error boundaries, fallback values, and retry policies actually protect the application under failure.' },
                  { id: 'opt_2', text: 'To crash the CI runner intentionally.' },
                  { id: 'opt_3', text: 'Because Python code cannot run without injected errors.' },
                  { id: 'opt_4', text: 'To decrease test coverage metrics.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Fault injection proves that exception handling and recovery logic actually work when dependencies fail, preventing silent cascading failures in production.'
              }
            ]
          },
          key_takeaways: [
            'Injecting transient errors and timeouts is essential for verifying resilience contracts.',
            'Ensure clients test both transient recovery (retry succeeds) and persistent failure (max retries exhausted).',
            'Always verify call counts to confirm retries were actually attempted.'
          ],
          revision_prompts: [
            'What is the difference between fault injection in unit tests vs chaos engineering in staging?'
          ]
        },
        {
          id: 'les-l4-8-11',
          slug: 'diagnosing-flaky-tests',
          title: 'Diagnosing and Eliminating Flaky Tests',
          summary: 'Systematically identify and eradicate non-deterministic tests caused by shared state, timing races, and test order pollution.',
          estimated_minutes: 25,
          xp_reward: 35,
          learning_objectives: [
            'Identify the four root causes of test flakiness: time, ordering, shared state, and async race conditions',
            'Detect order-dependent test pollution using randomized test execution',
            'Implement rigorous test isolation to eradicate flakiness'
          ],
          content_markdown: `### The Cost of Flaky Tests

A **flaky test** is a test that can both pass and fail on the same code without any changes. Flaky tests erode developer trust in CI, leading teams to ignore test failures until a real production regression slips through.

### The Four Culprits of Test Flakiness:

1. **Shared Mutable State**:
   - Tests modifying class attributes, environment variables (\`os.environ\`), or global singletons without restoring them in \`tearDown()\`.
2. **Test Order Dependency (State Pollution)**:
   - Test B passes only if Test A ran first and seeded data into a database or global cache.
   - *Fix*: Run tests with randomized ordering (e.g. \`pytest -p pytest-randomly\`).
3. **Wall-Clock Timing Races**:
   - Code relying on \`time.sleep(0.05)\` passing on a fast developer MacBook but failing on a resource-constrained CI runner.
   - *Fix*: Inject virtual clocks or synchronize via explicit wait conditions.
4. **Unawaited Coroutines or Leaked Tasks**:
   - Background tasks still executing on an event loop after a test finishes, causing the *next* test to fail mysteriously.

Let's demonstrate how shared mutable class state causes order-dependent flakiness and how to fix it!`,
          code_snippet: `import unittest

# FLAKY CODE: Shared mutable state on class definition
class SystemConfig:
    active_environment = "production"

    @classmethod
    def set_env(cls, env: str):
        cls.active_environment = env

class TestConfigPollutionA(unittest.TestCase):
    def test_modifies_shared_state(self):
        SystemConfig.set_env("staging")
        self.assertEqual(SystemConfig.active_environment, "staging")
        # BUG: Did not restore to "production" in tearDown!

class TestConfigPollutionB(unittest.TestCase):
    def test_assumes_default_production(self):
        # This passes in isolation, but FAILS if TestConfigPollutionA runs first!
        # Fix: Always restore in tearDown() or avoid mutable global state
        pass

# Demonstration of clean isolated test with cleanup:
class TestCleanConfig(unittest.TestCase):
    def setUp(self):
        self._orig_env = SystemConfig.active_environment

    def tearDown(self):
        # Guaranteed cleanup regardless of pass or fail
        SystemConfig.active_environment = self._orig_env

    def test_isolated_mutation(self):
        SystemConfig.set_env("testing")
        self.assertEqual(SystemConfig.active_environment, "testing")

suite = unittest.TestLoader().loadTestsFromTestCase(TestCleanConfig)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Isolated cleanup test: Ran {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'The test demonstrates how tearDown() guarantees the restoration of original state even if a test mutates global state, eliminating order-dependent test pollution.',
          expected_output: `test_isolated_mutation (__main__.TestCleanConfig) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
Isolated cleanup test: Ran 1, Failures: 0`,
          quiz: {
            id: 'quiz-l4-8-11',
            title: 'Flaky Test Diagnosis Check',
            questions: [
              {
                id: 'q-l4-8-11-1',
                question: 'What is test pollution (order dependency)?',
                options: [
                  { id: 'opt_1', text: 'When one test modifies shared global state or database records without cleaning up, causing subsequent unrelated tests to fail.' },
                  { id: 'opt_2', text: 'When test files are committed to the wrong git branch.' },
                  { id: 'opt_3', text: 'When test code emits too many log messages.' },
                  { id: 'opt_4', text: 'When tests run on multiple operating systems.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Test pollution occurs when a test leaks side effects (file system, globals, DB state), making downstream test outcomes dependent on test execution order.'
              }
            ]
          },
          key_takeaways: [
            'Flaky tests are typically caused by shared mutable state, wall-clock sleeps, or test order dependencies.',
            'Always restore environment variables and global singletons in tearDown() or using unittest.TestCase.addCleanup().',
            'Randomize test execution order in CI to actively catch leaked state before it merges to main.'
          ],
          revision_prompts: [
            'How does unittest.TestCase.addCleanup() differ from tearDown() when setUp() raises an exception?'
          ]
        },
        {
          id: 'les-l4-8-12',
          slug: 'final-advanced-python-assessment',
          title: 'Final Advanced Python Assessment',
          summary: 'Comprehensive Level 4 Capstone Knowledge Assessment covering async orchestration, concurrency, typing, architecture, and testing.',
          estimated_minutes: 40,
          xp_reward: 100,
          learning_objectives: [
            'Validate comprehensive mastery of Level 4 Advanced Python concepts',
            'Demonstrate deep architectural judgment across async, concurrent, and typed systems',
            'Evaluate real-world engineering scenarios under production constraints'
          ],
          content_markdown: `### Welcome to the Level 4 Final Assessment!

Congratulations on reaching the summit of **Level 4: Advanced Python**!

Throughout this level, you have mastered:
1. **Python Internals & Resources**: Memory layout, reference counts, the GIL, and custom context managers.
2. **Asynchronous Programming**: Coroutines, event loops, tasks, cancellation tokens, and \`asyncio.gather\`.
3. **Concurrency & Multiprocessing**: When to use asyncio vs \`threading\` vs \`multiprocessing\`, and race condition prevention.
4. **Performance & Profiling**: \`cProfile\`, memory tracking, Big-O analysis, and deterministic benchmarking.
5. **Advanced Typing & Protocols**: Structural typing (\`Protocol\`), generics (\`TypeVar\`), and strict static analysis.
6. **Design Patterns & Architecture**: Dependency injection, Strategy, Factory, Repository, and separation of concerns.
7. **Reliable Pipelines & Observability**: Multi-stage pipelines, structured JSON logging, correlation IDs, and exponential backoff.
8. **Advanced Testing**: \`IsolatedAsyncioTestCase\`, \`AsyncMock\`, deterministic virtual clocks, and architecture tests.

The following comprehensive assessment evaluates your architectural judgment and practical engineering capabilities. Complete this assessment to claim your Level 4 mastery badge!`,
          code_snippet: `# Level 4 Final Capstone Verification Script
import asyncio
import unittest
from unittest.mock import AsyncMock

async def pipeline_stage_validator(item: dict) -> dict:
    if "id" not in item:
        raise ValueError("Missing ID")
    return {**item, "validated": True}

class TestLevel4Capstone(unittest.IsolatedAsyncioTestCase):
    async def test_complete_capstone_pipeline(self):
        # 1. Async validation
        item = {"id": "SYS-99", "payload": "sensor_reading"}
        validated = await pipeline_stage_validator(item)
        self.assertTrue(validated["validated"])
        
        # 2. AsyncMock test double verification
        mock_sink = AsyncMock()
        mock_sink.persist.return_value = True
        
        saved = await mock_sink.persist(validated)
        self.assertTrue(saved)
        mock_sink.persist.assert_awaited_once_with(validated)

suite = unittest.TestLoader().loadTestsFromTestCase(TestLevel4Capstone)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"\\nLevel 4 Capstone Validation: {result.testsRun} tests passed with 0 errors!")`,
          code_language: 'python',
          code_explanation: 'This verification script exercises coroutine pipelines, validation invariants, and AsyncMock test doubles to confirm that your Python environment is ready for production advanced Python engineering.',
          expected_output: `test_complete_capstone_pipeline (__main__.TestLevel4Capstone) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.002s

OK

Level 4 Capstone Validation: 1 tests passed with 0 errors!`,
          quiz: {
            id: 'quiz-l4-capstone-final',
            title: 'Level 4 Final Capstone Assessment',
            questions: [
              {
                id: 'q-l4-final-1',
                question: 'An enterprise microservice must query 20 independent third-party HTTP endpoints every 30 seconds and write the aggregated JSON to disk. Which concurrency model is the most resource-efficient choice in modern Python?',
                options: [
                  { id: 'opt_1', text: 'asyncio with an aiohttp/httpx client and asyncio.gather() or TaskGroup.' },
                  { id: 'opt_2', text: 'Spawn 20 separate multiprocessing.Process instances.' },
                  { id: 'opt_3', text: 'Execute all 20 sequentially in a single while loop with no concurrency.' },
                  { id: 'opt_4', text: 'A C-extension that bypasses the operating system network stack.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Querying 20 external HTTP endpoints is an I/O-bound workload. An asyncio event loop multiplexes hundreds of concurrent non-blocking socket connections in a single lightweight thread with minimal memory and zero process fork overhead.'
              },
              {
                id: 'q-l4-final-2',
                question: 'Why does Python\'s Global Interpreter Lock (GIL) NOT prevent race conditions in multithreaded Python applications?',
                options: [
                  { id: 'opt_1', text: 'The GIL releases between bytecode instructions, allowing threads to interleave during multi-opcode mutations like counter += 1.' },
                  { id: 'opt_2', text: 'The GIL only runs when multiprocessing is enabled.' },
                  { id: 'opt_3', text: 'The GIL is disabled by default on modern multi-core CPUs.' },
                  { id: 'opt_4', text: 'The GIL only manages memory allocation and has no effect on execution.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'The GIL guarantees atomic execution of individual C-level interpreter operations, not high-level Python statements. A statement like counter += 1 comprises multiple bytecodes (LOAD, BINARY_OP, STORE); thread switching between them corrupts state unless protected by a Lock.'
              },
              {
                id: 'q-l4-final-3',
                question: 'What is the primary difference between structural subtyping (typing.Protocol) and nominal subtyping (abc.ABC) in Python?',
                options: [
                  { id: 'opt_1', text: 'Protocols do not require explicit inheritance; any class implementing the required method signatures satisfies the protocol.' },
                  { id: 'opt_2', text: 'abc.ABC requires C-compilers whereas Protocol is pure Python.' },
                  { id: 'opt_3', text: 'Protocols validate values at runtime by default whereas ABCs do not.' },
                  { id: 'opt_4', text: 'Protocols can only be used with numbers and strings.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Structural subtyping (duck typing with static types) matches types based on their shape/attributes, without requiring classes to explicitly inherit from a base class.'
              },
              {
                id: 'q-l4-final-4',
                question: 'When implementing a resilient data ingestion pipeline, why is adding "Full Jitter" to exponential backoff critical under high concurrency?',
                options: [
                  { id: 'opt_1', text: 'It desynchronizes retry attempts across concurrent workers, preventing thundering herd spikes on recovered servers.' },
                  { id: 'opt_2', text: 'It guarantees the server never returns an HTTP 500 error.' },
                  { id: 'opt_3', text: 'It compresses the JSON payload to reduce network latency.' },
                  { id: 'opt_4', text: 'It turns non-retryable errors into retryable errors.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Without jitter, all workers that fail at time T retry at the exact same intervals (T+1, T+2, T+4), causing repeated traffic spikes (thundering herds) that repeatedly overwhelm recovering dependencies.'
              },
              {
                id: 'q-l4-final-5',
                question: 'Why should unit tests inject a controllable virtual clock rather than calling time.sleep() when asserting time-dependent behavior (like cache TTLs)?',
                options: [
                  { id: 'opt_1', text: 'Virtual clocks execute tests instantaneously in milliseconds without flakiness from CI CPU load variations.' },
                  { id: 'opt_2', text: 'Calling time.sleep() causes a memory leak in the Python interpreter.' },
                  { id: 'opt_3', text: 'time.sleep() is deprecated in Python 3.12.' },
                  { id: 'opt_4', text: 'Virtual clocks automatically test the database.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Injecting a virtual clock allows tests to advance time deterministically by hours or days in 0 milliseconds, eliminating slow test suites and CI timing flakiness.'
              }
            ]
          },
          key_takeaways: [
            'Choose concurrency according to the workload: asyncio for high-concurrency I/O, multiprocessing for CPU-bound computation.',
            'Decouple business logic from infrastructure using Protocols, Dependency Injection, and In-Memory Fakes.',
            'Build resilient pipelines using structured logging, correlation IDs, timeouts, and bounded retries.'
          ],
          revision_prompts: [
            'What are the three most critical design decisions you will apply to your next production Python application?'
          ]
        }
      ]
    }
  ]
};
