/**
 * Revoraa Level 4: Advanced Python - Guided Projects Dataset
 * 
 * 8 Module Projects + 1 Level 4 Capstone Systems Lab (36 progressive milestones total)
 * Each project includes 4 progressive milestones with starter code, assertions,
 * and translations in English, Hinglish, and Hindi.
 */

export const LEVEL_4_PROJECTS = [
  // ─── Module 1 Project: Resource-Safe File Processor ───────────────────────────
  {
    id: 'proj-04-resource-safe-processor',
    slug: 'resource-safe-file-processor',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Resource-Safe File Processor',
    tagline: 'Build a leak-proof stream parser with custom context managers and rollback cleanup',
    difficulty: 'advanced',
    estimated_hours: 6,
    xp_reward: 220,
    is_published: true,
    description: {
      en: 'Construct a production-grade resource-safe processing utility that guarantees zero file descriptor leaks, rolls back transient buffer states upon processing errors, and tracks memory allocation lifecycle.',
      'hi-Latn': 'Ek leak-proof file stream processor banayein jo custom context managers use kare, failure par buffers ko rollback kare aur zero resource leak guarantee kare.',
      hi: 'एक लीक-प्रूफ फ़ाइल स्ट्रीम प्रोसेसर बनाएं जो कस्टम संदर्भ प्रबंधकों का उपयोग करे, विफलता पर बफ़र्स को रोलबैक करे और शून्य संसाधन लीक की गारंटी दे।'
    },
    learning_objectives: [
      'Implement custom class and generator context managers with __enter__ and __exit__',
      'Guarantee deterministic resource cleanup during unhandled exceptions',
      'Build atomic write staging and rollback mechanics',
      'Diagnose and eliminate lingering object references'
    ],
    milestones: [
      {
        id: 'm1-managed-staging-buffer',
        title: 'Milestone 1: Managed Staging Buffer',
        instructions: {
          en: 'Implement `StagingBuffer` with `__enter__` and `__exit__`. It should provide `write(data: str)` and an `in_memory_records` list. On exception during the block, it must discard all uncommitted writes and set `was_rolled_back = True`. On clean exit, set `was_committed = True`.',
          'hi-Latn': '`StagingBuffer` banayein jisme `__enter__` aur `__exit__` ho. Exception aane par uncommitted data discard ho aur `was_rolled_back = True` set ho; clean exit par `was_committed = True`.',
          hi: '`StagingBuffer` लागू करें। अपवाद आने पर डेटा डिस्कार्ड हो और `was_rolled_back = True` सेट हो; सामान्य निकास पर `was_committed = True` सेट हो।'
        },
        starter_code: `class StagingBuffer:
    def __init__(self):
        self.committed = []
        self._staging = []
        self.was_rolled_back = False
        self.was_committed = False

    def write(self, record: str):
        self._staging.append(record)

    def __enter__(self):
        self._staging = []
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self._staging.clear()
            self.was_rolled_back = True
            return False  # Propagate exception
        self.committed.extend(self._staging)
        self._staging.clear()
        self.was_committed = True
        return True`,
        test_harness: `
buf = StagingBuffer()
with buf:
    buf.write("rec_1")
    buf.write("rec_2")

assert buf.was_committed is True
assert buf.committed == ["rec_1", "rec_2"]

try:
    with buf:
        buf.write("rec_corrupted")
        raise ValueError("Simulated parsing crash")
except ValueError:
    pass

assert buf.was_rolled_back is True
assert buf.committed == ["rec_1", "rec_2"]  # Unchanged!
print("MILESTONE 1 VERIFIED: StagingBuffer atomic rollback passed!")`
      },
      {
        id: 'm2-record-sanitizer',
        title: 'Milestone 2: Safe Record Validator and Sanitizer',
        instructions: {
          en: 'Implement `sanitize_record(raw_line: str) -> dict`. It must parse CSV lines formatted as "ID,ACTION,AMOUNT", trim whitespace, validate that AMOUNT is an integer >= 0, and raise `ValueError` for invalid lines.',
          'hi-Latn': '`sanitize_record(raw_line)` banayein jo "ID,ACTION,AMOUNT" format parse kare, whitespace trim kare aur negative ya invalid amount par `ValueError` raise kare.',
          hi: '`sanitize_record(raw_line)` लागू करें जो "ID,ACTION,AMOUNT" को पार्स करे और अमान्य इनपुट पर `ValueError` उठाए।'
        },
        starter_code: `def sanitize_record(raw_line: str) -> dict:
    parts = [p.strip() for p in raw_line.strip().split(",")]
    if len(parts) != 3:
        raise ValueError(f"Malformed record format: {raw_line}")
    rec_id, action, amount_str = parts
    if not rec_id or not action:
        raise ValueError("Missing ID or Action")
    try:
        amount = int(amount_str)
        if amount < 0:
            raise ValueError()
    except ValueError:
        raise ValueError(f"Invalid non-negative integer amount: {amount_str}")
    return {"id": rec_id, "action": action.upper(), "amount": amount}`,
        test_harness: `
rec = sanitize_record("  tx_101 , deposit , 500  ")
assert rec == {"id": "tx_101", "action": "DEPOSIT", "amount": 500}

try:
    sanitize_record("tx_102,bad,-10")
    assert False, "Should have raised ValueError"
except ValueError:
    pass

print("MILESTONE 2 VERIFIED: sanitize_record validation passed!")`
      },
      {
        id: 'm3-batch-stream-processor',
        title: 'Milestone 3: Safe Batch Stream Processor',
        instructions: {
          en: 'Implement `process_records(lines: list, buffer: StagingBuffer) -> tuple[int, int]`. It processes lines in batches. If any line in a batch fails validation, that entire batch must be rolled back in the buffer, and processing continues for next batches. Returns `(success_count, error_count)`.',
          'hi-Latn': '`process_records(lines, buffer)` banayein jo batches process kare. Batch me error aane par rollback kare aur `(success_count, error_count)` return kare.',
          hi: '`process_records(lines, buffer)` लागू करें जो बैचों को प्रोसेस करे और विफलता पर रोलबैक करे।'
        },
        starter_code: `def process_records(lines: list, buffer: StagingBuffer, batch_size: int = 2) -> tuple:
    successes = 0
    errors = 0
    
    for i in range(0, len(lines), batch_size):
        batch = lines[i:i + batch_size]
        try:
            with buffer:
                for line in batch:
                    parsed = sanitize_record(line)
                    buffer.write(f"{parsed['id']}:{parsed['action']}:{parsed['amount']}")
                    successes += 1
        except ValueError:
            errors += len(batch)
            # Entire batch rolled back by context manager!
            
    return successes, errors`,
        test_harness: `
buf = StagingBuffer()
lines = [
    "tx_1,PAY,100",
    "tx_2,PAY,200",
    "tx_3,BAD,-50", # Causes batch 2 to rollback!
    "tx_4,PAY,400",
    "tx_5,PAY,500",
    "tx_6,PAY,600"
]
succ, err = process_records(lines, buf, batch_size=2)
assert succ == 4
assert err == 2
assert len(buf.committed) == 4
assert "tx_1:PAY:100" in buf.committed
print("MILESTONE 3 VERIFIED: Batch stream processor passed!")`
      },
      {
        id: 'm4-audit-trail-generator',
        title: 'Milestone 4: Diagnostic Audit & Summary Report',
        instructions: {
          en: 'Implement `generate_audit_report(buffer: StagingBuffer, success_count: int, error_count: int) -> dict`. It calculates total amount processed, unique actions count, and produces a structured dictionary.',
          'hi-Latn': '`generate_audit_report` implement karein jo committed records ka total amount aur unique actions calculate karke structured summary return kare.',
          hi: '`generate_audit_report` लागू करें जो कुल प्रोसेस की गई राशि और रिपोर्ट तैयार करे।'
        },
        starter_code: `def generate_audit_report(buffer: StagingBuffer, success_count: int, error_count: int) -> dict:
    total_amount = 0
    actions = set()
    for item in buffer.committed:
        _, action, amt = item.split(":")
        total_amount += int(amt)
        actions.add(action)
    return {
        "records_committed": len(buffer.committed),
        "total_amount": total_amount,
        "unique_actions": sorted(list(actions)),
        "error_count": error_count,
        "is_clean": error_count == 0
    }`,
        test_harness: `
report = generate_audit_report(buf, succ, err)
assert report["records_committed"] == 4
assert report["total_amount"] == 1400  # 100 + 200 + 500 + 600
assert report["unique_actions"] == ["PAY"]
assert report["error_count"] == 2
assert report["is_clean"] is False
print("MILESTONE 4 VERIFIED: Resource-Safe File Processor project complete!")`
      }
    ]
  },

  // ─── Module 2 Project: Async Job Coordinator ─────────────────────────────────
  {
    id: 'proj-04-async-job-coordinator',
    slug: 'async-job-coordinator',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Async Job Coordinator',
    tagline: 'Orchestrate concurrent async tasks with bounded concurrency, timeouts, and result streaming',
    difficulty: 'advanced',
    estimated_hours: 7,
    xp_reward: 230,
    is_published: true,
    description: {
      en: 'Architect a deterministic asynchronous job coordinator using asyncio. Learn how to limit concurrency with Semaphore, gracefully handle timeouts and task cancellations, and stream completed results.',
      'hi-Latn': 'Ek asynchronous job coordinator banayein jo asyncio.Semaphore ke saath concurrency limit kare, timeouts handle kare aur job status stream kare.',
      hi: 'एक अतुल्यकालिक कार्य समन्वयक बनाएं जो सेमाफोर के साथ समवर्तीता को सीमित करे और टाइमआउट को संभाले।'
    },
    learning_objectives: [
      'Manage bounded concurrency using asyncio.Semaphore',
      'Enforce per-task deadlines using asyncio.wait_for',
      'Aggregate completed task results safely with asyncio.as_completed',
      'Handle CancelledError and task cleanup'
    ],
    milestones: [
      {
        id: 'm1-job-definition',
        title: 'Milestone 1: Async Job Model and Executor',
        instructions: {
          en: 'Define `execute_job(job_id: str, work_units: int, should_fail: bool = False) -> dict`. It simulates work with `await asyncio.sleep(0.001 * work_units)`, raises `RuntimeError("Job failed")` if `should_fail=True`, and returns a result dict.',
          'hi-Latn': '`execute_job(job_id, work_units, should_fail)` coroutine banayein jo simulation ke baad result dict return kare ya failure raise kare.',
          hi: '`execute_job` कोरोटिन बनाएं जो कार्य का अनुकरण करे और परिणाम या विफलता लौटाए।'
        },
        starter_code: `import asyncio

async def execute_job(job_id: str, work_units: int, should_fail: bool = False) -> dict:
    await asyncio.sleep(0.001 * work_units)
    if should_fail:
        raise RuntimeError(f"Job {job_id} encountered fatal error")
    return {
        "job_id": job_id,
        "status": "COMPLETED",
        "output": work_units * 10
    }`,
        test_harness: `
async def test_m1():
    res = await execute_job("job_1", 2)
    assert res["status"] == "COMPLETED"
    assert res["output"] == 20
    try:
        await execute_job("job_err", 1, should_fail=True)
        assert False, "Should fail"
    except RuntimeError:
        pass
    print("MILESTONE 1 VERIFIED: execute_job coroutine passed!")

asyncio.run(test_m1())`
      },
      {
        id: 'm2-bounded-coordinator',
        title: 'Milestone 2: Bounded Concurrency Coordinator',
        instructions: {
          en: 'Implement `run_with_semaphore(semaphore: asyncio.Semaphore, job_func, *args)`. It acquires the semaphore, executes `job_func`, and guarantees semaphore release in finally.',
          'hi-Latn': '`run_with_semaphore` implement karein jo semaphore acquire karke job execute kare aur concurrency limit kare.',
          hi: '`run_with_semaphore` लागू करें जो सेमाफोर का उपयोग करके एक साथ चलने वाले कार्यों को सीमित करे।'
        },
        starter_code: `async def run_with_semaphore(sem: asyncio.Semaphore, job_coro_fn, *args):
    async with sem:
        return await job_coro_fn(*args)`,
        test_harness: `
async def test_m2():
    sem = asyncio.Semaphore(2)
    active = 0
    max_active = 0

    async def monitored_job(jid):
        nonlocal active, max_active
        active += 1
        max_active = max(max_active, active)
        await asyncio.sleep(0.01)
        active -= 1
        return jid

    tasks = [run_with_semaphore(sem, monitored_job, f"j_{i}") for i in range(6)]
    results = await asyncio.gather(*tasks)
    assert len(results) == 6
    assert max_active <= 2, f"Expected concurrency <= 2, got {max_active}"
    print("MILESTONE 2 VERIFIED: Bounded concurrency verified!")

asyncio.run(test_m2())`
      },
      {
        id: 'm3-timeout-and-fault-guard',
        title: 'Milestone 3: Task Timeouts and Fault Guarding',
        instructions: {
          en: 'Implement `safe_execute_job(sem, job_id, work_units, timeout_sec, should_fail=False) -> dict`. It catches `asyncio.TimeoutError` and `RuntimeError`, returning `{ "job_id": job_id, "status": "FAILED", "error": str(err) }`.',
          'hi-Latn': '`safe_execute_job` banayein jo `asyncio.wait_for` use kare aur timeout ya error aane par safely error dictionary return kare.',
          hi: '`safe_execute_job` लागू करें जो टाइमआउट और त्रुटियों को पकड़कर सुरक्षित डिक्शनरी लौटाए।'
        },
        starter_code: `async def safe_execute_job(sem: asyncio.Semaphore, job_id: str, work_units: int, timeout_sec: float, should_fail: bool = False) -> dict:
    try:
        async with sem:
            return await asyncio.wait_for(
                execute_job(job_id, work_units, should_fail),
                timeout=timeout_sec
            )
    except asyncio.TimeoutError:
        return {"job_id": job_id, "status": "TIMEOUT", "error": "Operation timed out"}
    except Exception as err:
        return {"job_id": job_id, "status": "FAILED", "error": str(err)}`,
        test_harness: `
async def test_m3():
    sem = asyncio.Semaphore(5)
    # 1. Normal
    r1 = await safe_execute_job(sem, "ok", 1, timeout_sec=1.0)
    assert r1["status"] == "COMPLETED"
    # 2. Timeout
    r2 = await safe_execute_job(sem, "slow", 50, timeout_sec=0.005)
    assert r2["status"] == "TIMEOUT"
    # 3. Crash
    r3 = await safe_execute_job(sem, "crash", 1, timeout_sec=1.0, should_fail=True)
    assert r3["status"] == "FAILED"
    print("MILESTONE 3 VERIFIED: Timeout and fault guarding verified!")

asyncio.run(test_m3())`
      },
      {
        id: 'm4-orchestration-summary',
        title: 'Milestone 4: Batch Coordinator Pipeline',
        instructions: {
          en: 'Implement `coordinate_jobs(job_specs: list, max_concurrency: int = 3) -> dict`. Orchestrates all job specs concurrently and returns total, completed, failed, and timeout counts.',
          'hi-Latn': '`coordinate_jobs` banayein jo saare jobs ko concurrently coordinate kare aur aggregate stats return kare.',
          hi: '`coordinate_jobs` लागू करें जो सभी कार्यों का समन्वय करे और सारांश आंकड़े तैयार करे।'
        },
        starter_code: `async def coordinate_jobs(job_specs: list, max_concurrency: int = 3) -> dict:
    sem = asyncio.Semaphore(max_concurrency)
    tasks = [
        safe_execute_job(sem, spec["id"], spec["work"], spec.get("timeout", 1.0), spec.get("fail", False))
        for spec in job_specs
    ]
    results = await asyncio.gather(*tasks)
    
    summary = {"total": len(results), "COMPLETED": 0, "TIMEOUT": 0, "FAILED": 0}
    for r in results:
        summary[r["status"]] += 1
    return summary`,
        test_harness: `
async def test_m4():
    specs = [
        {"id": "j1", "work": 1},
        {"id": "j2", "work": 2},
        {"id": "j3", "work": 100, "timeout": 0.005}, # Timeout
        {"id": "j4", "work": 1, "fail": True}         # Failure
    ]
    res = await coordinate_jobs(specs, max_concurrency=2)
    assert res["total"] == 4
    assert res["COMPLETED"] == 2
    assert res["TIMEOUT"] == 1
    assert res["FAILED"] == 1
    print("MILESTONE 4 VERIFIED: Async Job Coordinator complete!")

asyncio.run(test_m4())`
      }
    ]
  },

  // ─── Module 3 Project: Concurrent Workload Simulator ─────────────────────────
  {
    id: 'proj-04-concurrent-workload-simulator',
    slug: 'concurrent-workload-simulator',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Concurrent Workload Simulator',
    tagline: 'Benchmark and compare Sequential, Threading, and Async concurrency models',
    difficulty: 'advanced',
    estimated_hours: 6,
    xp_reward: 220,
    is_published: true,
    description: {
      en: 'Build a rigorous workload simulation engine that models I/O-bound and CPU-bound workloads across sequential execution, thread workers, and async coroutines, analyzing turnaround times and GIL constraints.',
      'hi-Latn': 'Ek concurrency simulator banayein jo Sequential, Thread-based aur Async models ka comparison kare aur GIL tradeoffs analyze kare.',
      hi: 'एक समवर्ती कार्यभार सिम्युलेटर बनाएं जो अनुक्रमिक, थ्रेड-आधारित और अतुल्यकालिक मॉडलों की तुलना करे।'
    },
    learning_objectives: [
      'Model simulated I/O latency vs CPU compute loops',
      'Benchmark thread worker queues and context switches',
      'Explain GIL impact on compute-bound vs I/O-bound tasks',
      'Provide clear pedagogical explanations of concurrency models'
    ],
    milestones: [
      {
        id: 'm1-workload-models',
        title: 'Milestone 1: Workload Task Definitions',
        instructions: {
          en: 'Implement `simulate_io_task(task_id: int, delay_sec: float) -> str` and `simulate_cpu_task(task_id: int, iterations: int) -> int`. Compute task calculates sum of squares.',
          'hi-Latn': '`simulate_io_task` (sleep based) aur `simulate_cpu_task` (sum of squares computation) banayein.',
          hi: '`simulate_io_task` और `simulate_cpu_task` बनाएं।'
        },
        starter_code: `import time

def simulate_io_task(task_id: int, delay_sec: float) -> str:
    time.sleep(delay_sec)
    return f"IO_DONE:{task_id}"

def simulate_cpu_task(task_id: int, iterations: int) -> int:
    total = 0
    for i in range(iterations):
        total += i * i
    return total`,
        test_harness: `
t1 = simulate_io_task(1, 0.001)
assert t1 == "IO_DONE:1"
c1 = simulate_cpu_task(1, 1000)
assert c1 > 0
print("MILESTONE 1 VERIFIED: Workload models passed!")`
      },
      {
        id: 'm2-thread-pool-executor',
        title: 'Milestone 2: Thread Pool Worker Harness',
        instructions: {
          en: 'Implement `run_with_threads(tasks_list, max_workers: int = 4) -> list`. Uses `concurrent.futures.ThreadPoolExecutor` to execute tasks and returns sorted results.',
          'hi-Latn': '`run_with_threads` banayein jo `ThreadPoolExecutor` use karke tasks ko concurrently execute kare.',
          hi: '`run_with_threads` लागू करें जो थ्रेड पूल का उपयोग करके कार्यों को निष्पादित करे।'
        },
        starter_code: `from concurrent.futures import ThreadPoolExecutor

def run_with_threads(task_fn, args_list, max_workers: int = 4) -> list:
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(task_fn, args_list))
    return results`,
        test_harness: `
args = [0.005, 0.005, 0.005, 0.005]
def dummy_io(delay):
    return simulate_io_task(1, delay)

res = run_with_threads(dummy_io, args, max_workers=4)
assert len(res) == 4
print("MILESTONE 2 VERIFIED: Thread pool execution verified!")`
      },
      {
        id: 'm3-async-io-harness',
        title: 'Milestone 3: Async Event Loop Harness',
        instructions: {
          en: 'Implement `run_with_async(delays: list) -> list` using `asyncio`. It runs simulated coroutine tasks concurrently using `asyncio.gather`.',
          'hi-Latn': '`run_with_async` banayein jo coroutines ke saath asynchronous I/O simulate kare.',
          hi: '`run_with_async` लागू करें जो अतुल्यकालिक I/O का अनुकरण करे।'
        },
        starter_code: `import asyncio

async def async_io_worker(delay_sec: float) -> str:
    await asyncio.sleep(delay_sec)
    return "ASYNC_IO_DONE"

async def run_with_async_coro(delays: list) -> list:
    tasks = [async_io_worker(d) for d in delays]
    return await asyncio.gather(*tasks)

def run_with_async(delays: list) -> list:
    return asyncio.run(run_with_async_coro(delays))`,
        test_harness: `
res = run_with_async([0.005, 0.005, 0.005])
assert len(res) == 3
assert all(r == "ASYNC_IO_DONE" for r in res)
print("MILESTONE 3 VERIFIED: Async harness passed!")`
      },
      {
        id: 'm4-concurrency-comparison-report',
        title: 'Milestone 4: Concurrency Decision Matrix',
        instructions: {
          en: 'Implement `recommend_concurrency_strategy(workload_type: str, task_count: int, relies_on_c_libs: bool) -> dict`. Returns recommended strategy (`"asyncio"`, `"threading"`, or `"multiprocessing"`) and educational rationale.',
          'hi-Latn': '`recommend_concurrency_strategy` banayein jo workload aur GIL constraints ke basis par right model recommend kare.',
          hi: '`recommend_concurrency_strategy` लागू करें जो उपयुक्त रणनीति सुझाए।'
        },
        starter_code: `def recommend_concurrency_strategy(workload_type: str, task_count: int, relies_on_c_libs: bool) -> dict:
    if workload_type == "IO_BOUND":
        if task_count > 100:
            return {
                "strategy": "asyncio",
                "reason": "asyncio scales to thousands of concurrent network/socket streams without OS thread memory overhead."
            }
        return {
            "strategy": "threading",
            "reason": "Threading is well-suited for moderate I/O counts with synchronous libraries."
        }
    elif workload_type == "CPU_BOUND":
        if relies_on_c_libs:
            return {
                "strategy": "threading",
                "reason": "C extensions (NumPy, OpenCV) release the GIL, allowing threads to achieve true multicore parallelism."
            }
        return {
            "strategy": "multiprocessing",
            "reason": "Pure Python CPU-bound code is bound by the GIL; multiprocessing bypasses the GIL via separate OS processes."
        }
    raise ValueError(f"Unknown workload: {workload_type}")`,
        test_harness: `
r1 = recommend_concurrency_strategy("IO_BOUND", 500, False)
assert r1["strategy"] == "asyncio"

r2 = recommend_concurrency_strategy("CPU_BOUND", 4, False)
assert r2["strategy"] == "multiprocessing"

r3 = recommend_concurrency_strategy("CPU_BOUND", 4, True)
assert r3["strategy"] == "threading"
print("MILESTONE 4 VERIFIED: Concurrent Workload Simulator complete!")`
      }
    ]
  },

  // ─── Module 4 Project: Python Performance Lab ────────────────────────────────
  {
    id: 'proj-04-python-performance-lab',
    slug: 'python-performance-lab',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Python Performance Lab',
    tagline: 'Benchmark, identify algorithmic bottlenecks, optimize with memoization, and verify speedups',
    difficulty: 'advanced',
    estimated_hours: 6,
    xp_reward: 220,
    is_published: true,
    description: {
      en: 'Take a deliberately slow data pipeline, profile its execution bottlenecks, eliminate redundant computations using LRU caching, and verify algorithmic speedups with regression tests.',
      'hi-Latn': 'Ek slow program ko profile karein, bottleneck identify karein, LRU caching aur efficient data structures se optimize karein aur speedup prove karein.',
      hi: 'एक धीमे प्रोग्राम को प्रोफ़ाइल करें, बॉटलनेक पहचानें, कैशिंग के साथ अनुकूलित करें और गति सुधार को सत्यापित करें।'
    },
    learning_objectives: [
      'Measure accurate execution deltas using time.perf_counter',
      'Diagnose O(N^2) bottlenecks and replace with O(N) hash sets or deques',
      'Implement functional memoization using functools.lru_cache',
      'Verify that optimizations preserve identical functional behavior'
    ],
    milestones: [
      {
        id: 'm1-slow-baseline',
        title: 'Milestone 1: Slow Baseline Implementation',
        instructions: {
          en: 'Implement `find_duplicates_naive(items: list) -> list`. It uses nested loops O(N^2) to find duplicate values and returns unique duplicates sorted.',
          'hi-Latn': '`find_duplicates_naive` implement karein jo nested loops se duplicates dhundhe (O(N^2)).',
          hi: '`find_duplicates_naive` लागू करें।'
        },
        starter_code: `def find_duplicates_naive(items: list) -> list:
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return sorted(duplicates)`,
        test_harness: `
dup = find_duplicates_naive([4, 2, 7, 4, 9, 2, 3])
assert dup == [2, 4]
print("MILESTONE 1 VERIFIED: Slow baseline passed!")`
      },
      {
        id: 'm2-optimized-hashset',
        title: 'Milestone 2: Optimized Hash Set Algorithm',
        instructions: {
          en: 'Implement `find_duplicates_fast(items: list) -> list` with O(N) time complexity using sets. Assert that it produces identical results to naive.',
          'hi-Latn': '`find_duplicates_fast` banayein jo set use karke O(N) me duplicates dhundhe aur identical output de.',
          hi: '`find_duplicates_fast` लागू करें जो O(N) समय में समान परिणाम दे।'
        },
        starter_code: `def find_duplicates_fast(items: list) -> list:
    seen = set()
    duplicates = set()
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    return sorted(list(duplicates))`,
        test_harness: `
data = [1, 5, 2, 9, 5, 1, 8, 3]
assert find_duplicates_fast(data) == find_duplicates_naive(data)
print("MILESTONE 2 VERIFIED: O(N) optimization verified!")`
      },
      {
        id: 'm3-memoized-computation',
        title: 'Milestone 3: LRU Caching Expensive Computation',
        instructions: {
          en: 'Implement `compute_heavy_score(factor: int, base: int) -> int` wrapped with `@functools.lru_cache(maxsize=128)`. Verify cache hits via cache_info().',
          'hi-Latn': '`compute_heavy_score` ko `@functools.lru_cache` se wrap karein aur cache hits verify karein.',
          hi: '`compute_heavy_score` को `@functools.lru_cache` से सजाएं और कैश हिट सत्यापित करें।'
        },
        starter_code: `import functools

@functools.lru_cache(maxsize=128)
def compute_heavy_score(factor: int, base: int) -> int:
    # Simulated expensive computation
    val = 1
    for _ in range(factor):
        val = (val * base + 7) % 1_000_007
    return val`,
        test_harness: `
compute_heavy_score.cache_clear()
v1 = compute_heavy_score(10, 3)
v2 = compute_heavy_score(10, 3) # Cache HIT!
assert v1 == v2
info = compute_heavy_score.cache_info()
assert info.hits == 1
assert info.misses == 1
print("MILESTONE 3 VERIFIED: Memoization verified!")`
      },
      {
        id: 'm4-speedup-verification',
        title: 'Milestone 4: Automated Speedup Verification',
        instructions: {
          en: 'Implement `verify_speedup(slow_fn, fast_fn, test_input) -> dict`. Measures execution time and asserts fast is at least 2x faster on 500-element list.',
          'hi-Latn': '`verify_speedup` implement karein jo time measure kare aur confirm kare ki fast implementation significantly faster hai.',
          hi: '`verify_speedup` लागू करें जो गति में सुधार को सत्यापित करे।'
        },
        starter_code: `import time

def verify_speedup(slow_fn, fast_fn, test_input) -> dict:
    t0 = time.perf_counter()
    res_slow = slow_fn(test_input)
    t_slow = time.perf_counter() - t0
    
    t1 = time.perf_counter()
    res_fast = fast_fn(test_input)
    t_fast = time.perf_counter() - t1
    
    assert res_slow == res_fast, "Optimization altered functional behavior!"
    
    speedup = t_slow / max(t_fast, 1e-9)
    return {
        "slow_sec": t_slow,
        "fast_sec": t_fast,
        "speedup_factor": round(speedup, 2),
        "is_faster": t_fast <= t_slow
    }`,
        test_harness: `
test_data = list(range(300)) + list(range(100))
report = verify_speedup(find_duplicates_naive, find_duplicates_fast, test_data)
assert report["is_faster"] is True
print(f"MILESTONE 4 VERIFIED: Speedup factor: {report['speedup_factor']}x!")`
      }
    ]
  },

  // ─── Module 5 Project: Typed Utility Library ─────────────────────────────────
  {
    id: 'proj-04-typed-utility-library',
    slug: 'typed-utility-library',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Typed Utility Library',
    tagline: 'Create a reusable type-safe package using Protocols, Generics, and TypedDicts',
    difficulty: 'advanced',
    estimated_hours: 6,
    xp_reward: 220,
    is_published: true,
    description: {
      en: 'Develop a modern, type-checked utility package that exports structural protocols, generic collections, runtime type guards, and immutable return contracts.',
      'hi-Latn': 'Ek fully type-annotated library banayein jisme Protocols, TypeVar generics aur runtime type validation ho.',
      hi: 'एक प्रकार-सुरक्षित उपयोगिता पैकेज बनाएं जिसमें प्रोटोकॉल, जेनेरिक्स और टाइपडिक्ट शामिल हों।'
    },
    learning_objectives: [
      'Define structural subtyping contracts with typing.Protocol',
      'Implement reusable generic algorithms using TypeVar',
      'Create structured schema models with TypedDict',
      'Implement runtime type guards and validation assertions'
    ],
    milestones: [
      {
        id: 'm1-serializable-protocol',
        title: 'Milestone 1: Structural Protocol Contract',
        instructions: {
          en: 'Define `Serializable(Protocol)` requiring `to_dict() -> dict`. Implement `JSONRecord` and `MetricsSnapshot` adhering to the protocol, and a function `dump_records(items: list[Serializable]) -> list[dict]`.',
          'hi-Latn': '`Serializable` Protocol define karein jisme `to_dict()` required ho, aur `dump_records` function banayein.',
          hi: '`Serializable` प्रोटोकॉल परिभाषित करें और `dump_records` लागू करें।'
        },
        starter_code: `from typing import Protocol, List, Dict, Any

class Serializable(Protocol):
    def to_dict(self) -> Dict[str, Any]:
        ...

class JSONRecord:
    def __init__(self, record_id: str, payload: str):
        self.record_id = record_id
        self.payload = payload

    def to_dict(self) -> Dict[str, Any]:
        return {"id": self.record_id, "data": self.payload}

def dump_records(items: List[Serializable]) -> List[Dict[str, Any]]:
    return [item.to_dict() for item in items]`,
        test_harness: `
r1 = JSONRecord("1", "alpha")
r2 = JSONRecord("2", "beta")
dumped = dump_records([r1, r2])
assert dumped == [{"id": "1", "data": "alpha"}, {"id": "2", "data": "beta"}]
print("MILESTONE 1 VERIFIED: Structural protocol verified!")`
      },
      {
        id: 'm2-generic-cache',
        title: 'Milestone 2: Generic Bounded Store',
        instructions: {
          en: 'Implement `GenericStore[K, V]` using `TypeVar("K")` and `TypeVar("V")`. It supports `put(key: K, val: V)`, `get(key: K) -> Optional[V]`, and `size() -> int`.',
          'hi-Latn': '`TypeVar` ke saath generic `GenericStore` banayein jo keys aur values ke types preserve kare.',
          hi: '`TypeVar` के साथ एक सामान्य `GenericStore` लागू करें।'
        },
        starter_code: `from typing import TypeVar, Generic, Optional, Dict

K = TypeVar("K")
V = TypeVar("V")

class GenericStore(Generic[K, V]):
    def __init__(self):
        self._items: Dict[K, V] = {}

    def put(self, key: K, val: V) -> None:
        self._items[key] = val

    def get(self, key: K) -> Optional[V]:
        return self._items.get(key)

    def size(self) -> int:
        return len(self._items)`,
        test_harness: `
store = GenericStore[str, int]()
store.put("latency_ms", 42)
assert store.get("latency_ms") == 42
assert store.get("unknown") is None
assert store.size() == 1
print("MILESTONE 2 VERIFIED: Generic store passed!")`
      },
      {
        id: 'm3-typed-event-schema',
        title: 'Milestone 3: Structured Schema with TypedDict',
        instructions: {
          en: 'Define `EventPayload(TypedDict)` with keys `event_id: str`, `category: str`, and `timestamp: int`. Implement `validate_and_build_event(event_id, category, timestamp) -> EventPayload`.',
          'hi-Latn': '`EventPayload` TypedDict define karein aur builder function banayein jo data validate kare.',
          hi: '`EventPayload` TypedDict परिभाषित करें और बिल्डर फ़ंक्शन लागू करें।'
        },
        starter_code: `from typing import TypedDict

class EventPayload(TypedDict):
    event_id: str
    category: str
    timestamp: int

def validate_and_build_event(event_id: str, category: str, timestamp: int) -> EventPayload:
    if not event_id or not category:
        raise ValueError("Invalid event attributes")
    if timestamp <= 0:
        raise ValueError("Timestamp must be positive")
    return {
        "event_id": event_id,
        "category": category,
        "timestamp": timestamp
    }`,
        test_harness: `
ev = validate_and_build_event("evt_01", "LOGIN", 1700000000)
assert ev["event_id"] == "evt_01"
assert ev["category"] == "LOGIN"
print("MILESTONE 3 VERIFIED: TypedDict schema verified!")`
      },
      {
        id: 'm4-runtime-type-guard',
        title: 'Milestone 4: Runtime Type Guard Function',
        instructions: {
          en: 'Implement `is_string_list(val: Any) -> bool` that verifies at runtime if an object is a `list` containing solely `str` items.',
          'hi-Latn': '`is_string_list` type guard banayein jo runtime par verify kare ki argument strictly list of strings hai.',
          hi: '`is_string_list` प्रकार गार्ड लागू करें।'
        },
        starter_code: `def is_string_list(val: Any) -> bool:
    if not isinstance(val, list):
        return False
    return all(isinstance(x, str) for x in val)`,
        test_harness: `
assert is_string_list(["a", "b", "c"]) is True
assert is_string_list(["a", 1, "c"]) is False
assert is_string_list("not_a_list") is False
print("MILESTONE 4 VERIFIED: Typed Utility Library complete!")`
      }
    ]
  },

  // ─── Module 6 Project: Extensible Notification Service ───────────────────────
  {
    id: 'proj-04-extensible-notification-service',
    slug: 'extensible-notification-service',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Extensible Notification Service',
    tagline: 'Implement Strategy, Factory, and Observer patterns to build a modular notification platform',
    difficulty: 'advanced',
    estimated_hours: 7,
    xp_reward: 230,
    is_published: true,
    description: {
      en: 'Architect an enterprise notification service using the Strategy pattern for delivery channels (Email, SMS, Webhook), Factory pattern for channel instantiation, and Observer pattern for dispatch metrics.',
      'hi-Latn': 'Strategy, Factory aur Observer patterns use karke modular notification dispatcher banayein jo easily extensible ho.',
      hi: 'रणनीति, फ़ैक्टरी और पर्यवेक्षक पैटर्न का उपयोग करके एक मॉड्यूलर अधिसूचना प्रणाली बनाएं।'
    },
    learning_objectives: [
      'Apply the Strategy Pattern to decouple delivery logic from message preparation',
      'Use the Factory Pattern with a registry to dynamically create channels',
      'Implement the Observer Pattern to notify audit and analytics listeners',
      'Decouple domain logic from concrete third-party services'
    ],
    milestones: [
      {
        id: 'm1-notification-strategy',
        title: 'Milestone 1: Notification Delivery Strategy',
        instructions: {
          en: 'Define `DeliveryStrategy(Protocol)` with `deliver(recipient: str, message: str) -> bool`. Implement `MockEmailStrategy` and `MockSmsStrategy` capturing delivered messages in a list.',
          'hi-Latn': '`DeliveryStrategy` protocol banayein aur `MockEmailStrategy` & `MockSmsStrategy` implement karein.',
          hi: '`DeliveryStrategy` प्रोटोकॉल और मॉक डिलीवरी रणनीतियाँ बनाएं।'
        },
        starter_code: `from typing import Protocol, List

class DeliveryStrategy(Protocol):
    def deliver(self, recipient: str, message: str) -> bool: ...

class MockEmailStrategy:
    def __init__(self):
        self.sent: List[dict] = []

    def deliver(self, recipient: str, message: str) -> bool:
        if "@" not in recipient:
            return False
        self.sent.append({"to": recipient, "msg": message, "type": "EMAIL"})
        return True

class MockSmsStrategy:
    def __init__(self):
        self.sent: List[dict] = []

    def deliver(self, recipient: str, message: str) -> bool:
        if not recipient.startswith("+"):
            return False
        self.sent.append({"to": recipient, "msg": message, "type": "SMS"})
        return True`,
        test_harness: `
email_strat = MockEmailStrategy()
assert email_strat.deliver("alice@revoraa.dev", "Welcome!") is True
assert email_strat.deliver("invalid_email", "Hello") is False
assert len(email_strat.sent) == 1
print("MILESTONE 1 VERIFIED: Strategy pattern verified!")`
      },
      {
        id: 'm2-strategy-factory',
        title: 'Milestone 2: Dynamic Strategy Factory',
        instructions: {
          en: 'Implement `StrategyFactory` with `register(channel_name, strategy_cls)` and `create(channel_name) -> DeliveryStrategy`. Raise `KeyError` if unknown channel requested.',
          'hi-Latn': '`StrategyFactory` banayein jo delivery strategies register aur dynamically instantiate kare.',
          hi: '`StrategyFactory` लागू करें जो डिलीवरी रणनीतियों को गतिशील रूप से बनाए।'
        },
        starter_code: `class StrategyFactory:
    def __init__(self):
        self._registry = {}

    def register(self, channel_name: str, strategy_cls):
        self._registry[channel_name.lower()] = strategy_cls

    def create(self, channel_name: str) -> DeliveryStrategy:
        channel = channel_name.lower()
        if channel not in self._registry:
            raise KeyError(f"Unsupported channel: {channel_name}")
        return self._registry[channel]()`,
        test_harness: `
factory = StrategyFactory()
factory.register("email", MockEmailStrategy)
factory.register("sms", MockSmsStrategy)

strat = factory.create("EMAIL")
assert isinstance(strat, MockEmailStrategy)
print("MILESTONE 2 VERIFIED: Factory registry passed!")`
      },
      {
        id: 'm3-audit-observer',
        title: 'Milestone 3: Notification Audit Observer',
        instructions: {
          en: 'Implement `NotificationDispatcher` supporting `subscribe(listener_fn)` and `dispatch(channel, recipient, message)`. Notify all subscribed listeners whenever a message is dispatched.',
          'hi-Latn': '`NotificationDispatcher` me Observer pattern lagayein taaki har dispatch par registered listeners trigger hon.',
          hi: '`NotificationDispatcher` लागू करें जो सभी श्रोताओं को सूचित करे।'
        },
        starter_code: `class NotificationDispatcher:
    def __init__(self, factory: StrategyFactory):
        self.factory = factory
        self.listeners = []

    def subscribe(self, listener_fn):
        self.listeners.append(listener_fn)

    def dispatch(self, channel: str, recipient: str, message: str) -> bool:
        strategy = self.factory.create(channel)
        success = strategy.deliver(recipient, message)
        payload = {"channel": channel, "recipient": recipient, "success": success}
        for listener in self.listeners:
            listener(payload)
        return success`,
        test_harness: `
audit_events = []
def audit_logger(evt):
    audit_events.append(evt)

dispatcher = NotificationDispatcher(factory)
dispatcher.subscribe(audit_logger)

res = dispatcher.dispatch("email", "bob@revoraa.dev", "OTP: 1234")
assert res is True
assert len(audit_events) == 1
assert audit_events[0]["success"] is True
print("MILESTONE 3 VERIFIED: Observer notification verified!")`
      },
      {
        id: 'm4-complete-service-test',
        title: 'Milestone 4: Resilient Dispatch Pipeline',
        instructions: {
          en: 'Implement `dispatch_batch(dispatcher, messages_list) -> tuple[int, int]` returning `(successes, failures)` count.',
          'hi-Latn': '`dispatch_batch` banayein jo batch me messages dispatch kare aur total success/failure counts return kare.',
          hi: '`dispatch_batch` लागू करें जो बैच में संदेश भेजे।'
        },
        starter_code: `def dispatch_batch(dispatcher: NotificationDispatcher, messages: list) -> tuple:
    successes = 0
    failures = 0
    for m in messages:
        try:
            ok = dispatcher.dispatch(m["channel"], m["to"], m["body"])
            if ok:
                successes += 1
            else:
                failures += 1
        except Exception:
            failures += 1
    return successes, failures`,
        test_harness: `
msgs = [
    {"channel": "email", "to": "test@domain.com", "body": "msg1"},
    {"channel": "sms", "to": "+123456789", "body": "msg2"},
    {"channel": "email", "to": "invalid_email", "body": "msg3"}
]
succ, fail = dispatch_batch(dispatcher, msgs)
assert succ == 2
assert fail == 1
print("MILESTONE 4 VERIFIED: Extensible Notification Service complete!")`
      }
    ]
  },

  // ─── Module 7 Project: Reliable Data Pipeline ────────────────────────────────
  {
    id: 'proj-04-reliable-data-pipeline',
    slug: 'reliable-data-pipeline',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Reliable Data Pipeline',
    tagline: 'Build an idempotent data ingestion pipeline with exponential retries and correlation tracking',
    difficulty: 'advanced',
    estimated_hours: 7,
    xp_reward: 230,
    is_published: true,
    description: {
      en: 'Construct a resilient data ingestion pipeline featuring multi-stage validation, exponential backoff retries for transient HTTP errors, idempotency deduplication, and structured correlation logging.',
      'hi-Latn': 'Ek robust pipeline banayein jisme exponential retries, idempotency key deduplication aur structured correlation logs hon.',
      hi: 'एक मजबूत डेटा पाइपलाइन बनाएं जिसमें घातीय पुनः प्रयास और स्ट्रक्चर्ड लॉगिंग शामिल हो।'
    },
    learning_objectives: [
      'Implement multi-stage pipeline stages with explicit error boundaries',
      'Build exponential backoff retry policies with maximum attempt limits',
      'Enforce idempotency to prevent duplicate mutations',
      'Inject and propagate correlation IDs across pipeline stages'
    ],
    milestones: [
      {
        id: 'm1-correlation-context',
        title: 'Milestone 1: Correlation ID Tracking',
        instructions: {
          en: 'Implement `PipelineContext` tracking a unique `correlation_id: str`. It should provide `log(stage_name: str, message: str) -> dict` returning a structured log entry.',
          'hi-Latn': '`PipelineContext` banayein jo `correlation_id` maintain kare aur structured log records produce kare.',
          hi: '`PipelineContext` लागू करें जो सहसंबंध आईडी ट्रैक करे।'
        },
        starter_code: `import uuid

class PipelineContext:
    def __init__(self, correlation_id: str = None):
        self.correlation_id = correlation_id or str(uuid.uuid4())[:8]
        self.logs = []

    def log(self, stage: str, message: str) -> dict:
        entry = {
            "correlation_id": self.correlation_id,
            "stage": stage,
            "message": message
        }
        self.logs.append(entry)
        return entry`,
        test_harness: `
ctx = PipelineContext("corr_test_99")
entry = ctx.log("INGESTION", "Starting stream batch")
assert entry["correlation_id"] == "corr_test_99"
assert entry["stage"] == "INGESTION"
print("MILESTONE 1 VERIFIED: Pipeline context tracking verified!")`
      },
      {
        id: 'm2-idempotency-deduplicator',
        title: 'Milestone 2: In-Memory Idempotency Store',
        instructions: {
          en: 'Implement `IdempotencyStore` with `is_processed(idempotency_key: str) -> bool` and `mark_processed(idempotency_key: str, result: dict) -> None`.',
          'hi-Latn': '`IdempotencyStore` implement karein jo duplicate requests ko detect kare aur cached response return kare.',
          hi: '`IdempotencyStore` लागू करें जो डुप्लिकेट अनुरोधों को रोके।'
        },
        starter_code: `class IdempotencyStore:
    def __init__(self):
        self._store = {}

    def is_processed(self, key: str) -> bool:
        return key in self._store

    def mark_processed(self, key: str, result: dict) -> None:
        self._store[key] = result

    def get_result(self, key: str) -> dict:
        return self._store.get(key)`,
        test_harness: `
store = IdempotencyStore()
assert store.is_processed("req_101") is False
store.mark_processed("req_101", {"status": "SUCCESS"})
assert store.is_processed("req_101") is True
assert store.get_result("req_101")["status"] == "SUCCESS"
print("MILESTONE 2 VERIFIED: Idempotency store verified!")`
      },
      {
        id: 'm3-bounded-retry-stage',
        title: 'Milestone 3: Bounded Retry Mechanism',
        instructions: {
          en: 'Implement `execute_with_retry(task_fn, max_retries: int = 3) -> dict`. Retries on `ConnectionError`, but fails immediately on `ValueError` (non-retryable).',
          'hi-Latn': '`execute_with_retry` implement karein jo `ConnectionError` par retry kare par `ValueError` par turant fail ho.',
          hi: '`execute_with_retry` लागू करें जो केवल अस्थायी त्रुटियों पर पुनः प्रयास करे।'
        },
        starter_code: `def execute_with_retry(task_fn, max_retries: int = 3) -> dict:
    attempts = 0
    for attempt in range(1, max_retries + 1):
        attempts += 1
        try:
            res = task_fn()
            return {"result": res, "attempts": attempts, "success": True}
        except ConnectionError:
            if attempt == max_retries:
                raise
        except ValueError:
            # Fatal error, do not retry!
            raise`,
        test_harness: `
calls = 0
def transient_flaky():
    global calls
    calls += 1
    if calls < 2:
        raise ConnectionError("Timeout")
    return "SUCCESS_DATA"

res = execute_with_retry(transient_flaky, max_retries=3)
assert res["success"] is True
assert res["attempts"] == 2
print("MILESTONE 3 VERIFIED: Retry mechanism verified!")`
      },
      {
        id: 'm4-pipeline-coordinator',
        title: 'Milestone 4: End-to-End Resilient Pipeline',
        instructions: {
          en: 'Implement `ingest_event(payload: dict, store: IdempotencyStore, ctx: PipelineContext) -> dict`. Enforces idempotency key, validates payload, and logs output.',
          'hi-Latn': '`ingest_event` banayein jo idempotency check kare, data validate kare aur correlation logs record kare.',
          hi: '`ingest_event` लागू करें जो पूरी पाइपलाइन को जोड़े।'
        },
        starter_code: `def ingest_event(payload: dict, store: IdempotencyStore, ctx: PipelineContext) -> dict:
    key = payload.get("idempotency_key")
    if not key:
        raise ValueError("Missing idempotency_key")
        
    if store.is_processed(key):
        ctx.log("IDEMPOTENCY", f"Skipping duplicate event {key}")
        return {**store.get_result(key), "was_cached": True}
        
    ctx.log("VALIDATION", f"Validating payload for {key}")
    if "amount" not in payload or payload["amount"] <= 0:
        raise ValueError("Invalid amount")
        
    res = {"key": key, "processed_amount": payload["amount"] * 10, "status": "OK"}
    store.mark_processed(key, res)
    ctx.log("COMPLETION", f"Event {key} processed successfully")
    return {**res, "was_cached": False}`,
        test_harness: `
ctx = PipelineContext("corr_pipe_1")
store = IdempotencyStore()
p1 = {"idempotency_key": "tx_abc", "amount": 25}
out1 = ingest_event(p1, store, ctx)
assert out1["was_cached"] is False
assert out1["processed_amount"] == 250

# Second call with same key -> cached!
out2 = ingest_event(p1, store, ctx)
assert out2["was_cached"] is True
assert len(ctx.logs) >= 3
print("MILESTONE 4 VERIFIED: Reliable Data Pipeline complete!")`
      }
    ]
  },

  // ─── Module 8 Project: Harden an Unreliable Python Service ────────────────────
  {
    id: 'proj-04-harden-unreliable-service',
    slug: 'harden-unreliable-python-service',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Harden an Unreliable Python Service',
    tagline: 'Audit, debug, and harden a broken service suffering from resource leaks and unhandled exceptions',
    difficulty: 'advanced',
    estimated_hours: 8,
    xp_reward: 240,
    is_published: true,
    description: {
      en: 'Diagnose and repair a deliberately flawed Python service that leaks file resources, hangs indefinitely on slow network calls, crashes on unexpected JSON, and causes flaky unit tests.',
      'hi-Latn': 'Ek broken Python service ko diagnose aur fix karein jo resource leaks karti hai aur unhandled errors par crash hoti hai.',
      hi: 'एक अविश्वसनीय पायथन सेवा को ठीक करें और उसमें मौजूद बग्स को समाप्त करें।'
    },
    learning_objectives: [
      'Diagnose resource leaks and implement context managers',
      'Replace bare un-bounded network calls with explicit timeouts',
      'Enforce input schema validation before execution',
      'Write deterministic automated regression tests'
    ],
    milestones: [
      {
        id: 'm1-diagnose-resource-leak',
        title: 'Milestone 1: Patch Resource-Leaking File Handler',
        instructions: {
          en: 'Fix `FlawedFileHandler`. Rewrite `read_config(path: str)` so that it safely opens and closes the file descriptor using a context manager, returning `{}` if the file does not exist.',
          'hi-Latn': '`read_config` ko fix karein taaki context manager use ho aur missing file par safe `{}` return kare.',
          hi: '`read_config` को संदर्भ प्रबंधक के साथ सुरक्षित बनाएं।'
        },
        starter_code: `class SafeConfigHandler:
    @staticmethod
    def read_config(mock_fs: dict, path: str) -> dict:
        # mock_fs represents a virtual file system: {path: content_str}
        if path not in mock_fs:
            return {}
        content = mock_fs[path]
        parsed = {}
        for line in content.splitlines():
            if "=" in line:
                k, v = line.split("=", 1)
                parsed[k.strip()] = v.strip()
        return parsed`,
        test_harness: `
fs = {"/etc/app.conf": "ENV=staging\\nDEBUG=true"}
cfg = SafeConfigHandler.read_config(fs, "/etc/app.conf")
assert cfg["ENV"] == "staging"
assert cfg["DEBUG"] == "true"
assert SafeConfigHandler.read_config(fs, "/missing.conf") == {}
print("MILESTONE 1 VERIFIED: SafeConfigHandler passed!")`
      },
      {
        id: 'm2-bounded-timeout-patch',
        title: 'Milestone 2: Guarding Asynchronous Timeouts',
        instructions: {
          en: 'Fix `fetch_with_timeout(async_fetcher, url: str, timeout_sec: float)`. It must wrap the call in `asyncio.wait_for`, catching `asyncio.TimeoutError` and returning `None`.',
          'hi-Latn': '`fetch_with_timeout` banayein jo `asyncio.wait_for` use karke slow calls ko timeout kare aur `None` return kare.',
          hi: '`fetch_with_timeout` लागू करें जो टाइमआउट पर `None` लौटाए।'
        },
        starter_code: `import asyncio

async def fetch_with_timeout(async_fetcher, url: str, timeout_sec: float):
    try:
        return await asyncio.wait_for(async_fetcher(url), timeout=timeout_sec)
    except asyncio.TimeoutError:
        return None`,
        test_harness: `
async def test_m2():
    async def slow_fetch(url):
        await asyncio.sleep(0.05)
        return "DATA"

    res = await fetch_with_timeout(slow_fetch, "http://api.revoraa.dev", 0.005)
    assert res is None  # Timed out safely!
    print("MILESTONE 2 VERIFIED: Bounded timeout guard verified!")

asyncio.run(test_m2())`
      },
      {
        id: 'm3-schema-sanitization-guard',
        title: 'Milestone 3: Defensive Schema Validation',
        instructions: {
          en: 'Implement `safe_parse_incoming_payload(raw_dict: dict) -> dict`. It verifies that `user_id` is an int, `email` has `@`, and strips extraneous keys.',
          'hi-Latn': '`safe_parse_incoming_payload` banayein jo `user_id` aur `email` validate kare aur invalid data par `ValueError` raise kare.',
          hi: '`safe_parse_incoming_payload` लागू करें जो डेटा की सुरक्षा और वैधता की जांच करे।'
        },
        starter_code: `def safe_parse_incoming_payload(raw_dict: dict) -> dict:
    if not isinstance(raw_dict, dict):
        raise ValueError("Payload must be a dictionary")
    user_id = raw_dict.get("user_id")
    email = raw_dict.get("email")
    
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("Invalid user_id")
    if not isinstance(email, str) or "@" not in email:
        raise ValueError("Invalid email format")
        
    return {"user_id": user_id, "email": email.strip().lower()}`,
        test_harness: `
clean = safe_parse_incoming_payload({"user_id": 42, "email": "ALICE@REVORAA.DEV", "hack": "drop table"})
assert clean == {"user_id": 42, "email": "alice@revoraa.dev"}
try:
    safe_parse_incoming_payload({"user_id": -1, "email": "bad"})
    assert False, "Should fail"
except ValueError:
    pass
print("MILESTONE 3 VERIFIED: Defensive schema validation verified!")`
      },
      {
        id: 'm4-hardened-service-integration',
        title: 'Milestone 4: Regression Test Suite for Hardened Service',
        instructions: {
          en: 'Implement `run_hardened_service_pipeline(raw_payloads: list) -> dict`. Returns `{ "processed": count, "discarded": count }`.',
          'hi-Latn': 'Hardened pipeline integrate karein jo bad records ko safely discard kare bina crash hue.',
          hi: 'पूरी सेवा को एकीकृत करें और सारांश लौटाएं।'
        },
        starter_code: `def run_hardened_service_pipeline(raw_payloads: list) -> dict:
    processed = 0
    discarded = 0
    for p in raw_payloads:
        try:
            safe_parse_incoming_payload(p)
            processed += 1
        except ValueError:
            discarded += 1
    return {"processed": processed, "discarded": discarded}`,
        test_harness: `
data = [
    {"user_id": 1, "email": "u1@test.com"},
    {"user_id": "invalid", "email": "u2@test.com"},
    {"user_id": 2, "email": "u3@test.com"}
]
res = run_hardened_service_pipeline(data)
assert res["processed"] == 2
assert res["discarded"] == 1
print("MILESTONE 4 VERIFIED: Harden an Unreliable Python Service project complete!")`
      }
    ]
  },

  // ─── Level 4 Capstone Project: Advanced Python Systems Lab ────────────────────
  {
    id: 'proj-04-capstone-systems-lab',
    slug: 'advanced-python-systems-lab',
    path_slug: 'python-development',
    level_number: 4,
    title: 'Advanced Python Systems Lab (Level 4 Capstone)',
    tagline: 'Architect a full asynchronous telemetry processing service combining Protocols, Caching, and Fault Tolerance',
    difficulty: 'advanced',
    estimated_hours: 10,
    xp_reward: 350,
    is_published: true,
    description: {
      en: 'The ultimate Level 4 Capstone Project. Design and implement a high-throughput, fault-tolerant telemetry processing engine that synthesizes async task pipelines, typed domain protocols, LRU performance caches, and automated test suites.',
      'hi-Latn': 'Level 4 ka ultimate Capstone Project. High-throughput telemetry pipeline banayein jo Asyncio, Typed Protocols, LRU Caching aur Resilient Retries combine kare.',
      hi: 'लेवल 4 का अंतिम कैपस्टोन प्रोजेक्ट। एक उच्च-थ्रूपुट, त्रुटि-सहिष्णु टेलीमेट्री प्रोसेसिंग इंजन का निर्माण करें।'
    },
    learning_objectives: [
      'Synthesize asynchronous pipelines with asyncio.gather and bounded semaphores',
      'Enforce architectural boundaries with typing.Protocol and dependency injection',
      'Optimize hot paths using memoization and efficient data structures',
      'Implement structured observability with correlation IDs and comprehensive unit tests'
    ],
    milestones: [
      {
        id: 'm1-telemetry-protocol-and-domain',
        title: 'Milestone 1: Telemetry Data Model and Protocol',
        instructions: {
          en: 'Define `TelemetrySink(Protocol)` with `async def persist(event: dict) -> bool`. Create `MockTelemetrySink` that stores persisted events in an internal list.',
          'hi-Latn': '`TelemetrySink` protocol define karein aur in-memory `MockTelemetrySink` banayein jo events list me save kare.',
          hi: '`TelemetrySink` प्रोटोकॉल परिभाषित करें और `MockTelemetrySink` बनाएं।'
        },
        starter_code: `from typing import Protocol, List

class TelemetrySink(Protocol):
    async def persist(self, event: dict) -> bool: ...

class MockTelemetrySink:
    def __init__(self):
        self.events: List[dict] = []

    async def persist(self, event: dict) -> bool:
        self.events.append(event)
        return True`,
        test_harness: `
import asyncio
async def test_m1():
    sink = MockTelemetrySink()
    ok = await sink.persist({"device_id": "sensor_01", "temp": 22.5})
    assert ok is True
    assert len(sink.events) == 1
    print("CAPSTONE MILESTONE 1 VERIFIED: Telemetry Protocol verified!")

asyncio.run(test_m1())`
      },
      {
        id: 'm2-telemetry-enrichment-and-cache',
        title: 'Milestone 2: Cached Device Metadata Enricher',
        instructions: {
          en: 'Implement `DeviceEnricher` with `@functools.lru_cache` to resolve static device metadata (e.g. model, location) without repeated lookups.',
          'hi-Latn': '`DeviceEnricher` banayein jo device model aur location cache kare taaki repeat queries fast hon.',
          hi: '`DeviceEnricher` लागू करें जो डिवाइस मेटाडेटा को कैश करे।'
        },
        starter_code: `import functools

class DeviceEnricher:
    @staticmethod
    @functools.lru_cache(maxsize=128)
    def resolve_device_metadata(device_id: str) -> dict:
        # Simulated lookup
        return {
            "device_id": device_id,
            "region": "ap-south-1" if device_id.startswith("dev_in") else "us-east-1",
            "tier": "enterprise"
        }`,
        test_harness: `
meta1 = DeviceEnricher.resolve_device_metadata("dev_in_101")
meta2 = DeviceEnricher.resolve_device_metadata("dev_in_101")
assert meta1["region"] == "ap-south-1"
assert meta1 is meta2  # Returned exact cached object reference!
print("CAPSTONE MILESTONE 2 VERIFIED: Cached Device Metadata Enricher verified!")`
      },
      {
        id: 'm3-async-telemetry-pipeline',
        title: 'Milestone 3: Bounded Asynchronous Pipeline Processor',
        instructions: {
          en: 'Implement `process_telemetry_batch(events: list, sink: TelemetrySink, max_concurrency: int = 5) -> dict`. Enriches events and persists them concurrently, returning `{ "processed": count, "failed": count }`.',
          'hi-Latn': '`process_telemetry_batch` banayein jo events ko concurrently enrich aur sink me persist kare.',
          hi: '`process_telemetry_batch` लागू करें जो घटनाओं को समृद्ध और सहेजे।'
        },
        starter_code: `import asyncio

async def process_single_telemetry(raw_event: dict, sink: TelemetrySink, sem: asyncio.Semaphore) -> bool:
    async with sem:
        if "device_id" not in raw_event or "value" not in raw_event:
            return False
        meta = DeviceEnricher.resolve_device_metadata(raw_event["device_id"])
        enriched = {
            **raw_event,
            "region": meta["region"],
            "tier": meta["tier"],
            "processed": True
        }
        return await sink.persist(enriched)

async def process_telemetry_batch(events: list, sink: TelemetrySink, max_concurrency: int = 5) -> dict:
    sem = asyncio.Semaphore(max_concurrency)
    tasks = [process_single_telemetry(e, sink, sem) for e in events]
    results = await asyncio.gather(*tasks)
    return {
        "processed": sum(1 for r in results if r),
        "failed": sum(1 for r in results if not r)
    }`,
        test_harness: `
async def test_m3():
    sink = MockTelemetrySink()
    batch = [
        {"device_id": "dev_in_01", "value": 42},
        {"device_id": "dev_us_02", "value": 99},
        {"missing_value": True}  # Bad event
    ]
    res = await process_telemetry_batch(batch, sink, max_concurrency=2)
    assert res["processed"] == 2
    assert res["failed"] == 1
    assert len(sink.events) == 2
    assert sink.events[0]["region"] == "ap-south-1"
    print("CAPSTONE MILESTONE 3 VERIFIED: Async Telemetry Pipeline verified!")

asyncio.run(test_m3())`
      },
      {
        id: 'm4-system-lab-verification',
        title: 'Milestone 4: Architecture Validation & Resilience',
        instructions: {
          en: 'Implement `run_systems_lab_audit(processed_events: list) -> dict`. Verifies data integrity across regions and generates summary statistics.',
          'hi-Latn': '`run_systems_lab_audit` banayein jo system integrity verify kare aur regional aggregations report kare.',
          hi: '`run_systems_lab_audit` लागू करें जो डेटा अखंडता की पुष्टि करे और रिपोर्ट बनाए।'
        },
        starter_code: `def run_systems_lab_audit(persisted_events: list) -> dict:
    regions = {}
    total_val = 0
    for e in persisted_events:
        r = e.get("region", "unknown")
        regions[r] = regions.get(r, 0) + 1
        total_val += e.get("value", 0)
    return {
        "total_persisted": len(persisted_events),
        "regional_distribution": regions,
        "total_metric_sum": total_val,
        "health_status": "HEALTHY" if len(persisted_events) > 0 else "EMPTY"
    }`,
        test_harness: `
audit = run_systems_lab_audit(sink.events)
assert audit["total_persisted"] == 2
assert audit["regional_distribution"] == {"ap-south-1": 1, "us-east-1": 1}
assert audit["total_metric_sum"] == 141
assert audit["health_status"] == "HEALTHY"
print("CAPSTONE MILESTONE 4 VERIFIED: Level 4 Advanced Python Systems Lab COMPLETE!")`
      }
    ]
  }
];
